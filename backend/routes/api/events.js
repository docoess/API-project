const express = require('express');
const router = express.Router();

const { Event, Attendance, Group, Venue, EventImage, Membership, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const validateEvent = [
  check('venueId')
    .exists()
    .withMessage('Venue does not exist'),
  check('name')
    .exists()
    .notEmpty()
    .isLength({min: 5})
    .withMessage('Name must be at least 5 characters'),
  check('type')
    .exists()
    .isIn(['Online', 'In person'])
    .withMessage('Type must be Online or In person'),
  check('capacity')
    .exists()
    .isInt()
    .withMessage('Capacity must be an integer'),
  check('price')
    .exists()
    .isNumeric()
    .withMessage('Price is invalid'),
  check('description')
    .exists()
    .notEmpty()
    .withMessage('Description is required'),
  handleValidationErrors
  ];

router.get('/:eventId', async (req, res, next) => {
  const { eventId } = req.params;

  let event = await Event.findByPk(eventId, {
    include: [
      {
        model: Group,
        attributes: ['id', 'name', 'private', 'city', 'state']
      },
      {
        model: Venue,
        attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
      },
      {
        model: EventImage,
        attributes: ['id', 'url', 'preview']
      }
    ]
  });

  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found"
    });
  }

  event = event.toJSON();

  event.numAttending = await Attendance.count({
    where: {
      eventId
    }
  });

  return res.json(event);

});

router.get('/:eventId/attendees', async (req, res, next) => {
  let userId;
  if (req.user) {
    userId = req.user.id;
  }

  const { eventId } = req.params;

  const event = await Event.findByPk(eventId);
  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found"
    });
  }

  const group = await Group.findByPk(event.groupId);
  let organizer;
  let cohost;

  if (userId) {
    organizer = group.organizerId === userId;

    const membership = await Membership.findOne({
      where: {
        groupId: group.id,
        userId
      }
    });

    if (membership) {
      cohost = membership.status === 'co-host';
    }
  }

  const attendees = {"Attendees": []};

  let attendances;

  if (organizer || cohost) {
    attendances = await Attendance.findAll({
      where: {
        eventId
      }
    });
  } else {
    attendances = await Attendance.findAll({
      where: {
        eventId,
        status: {
          [Op.in]: ['attending', 'waitlist']
        }
      }
    });
  }

  for (let attendance of attendances) {
    const user = await User.findByPk(attendance.userId);

    attendees.Attendees.push({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      Attendance: {
        status: attendance.status
      }
    });
  }

  return res.json(attendees);

});

router.get('/', async (req, res, next) => {
  let events = await Event.findAll();
  const modifiedEvents = {"Events": []}

  for (let event of events) {
    const numAttending = await Attendance.count({
      where: {
        eventId: event.id
      }
    });

    const previewImage = await EventImage.findOne({
      where: {
        eventId: event.id,
        preview: true
      }
    });

    const group = await Group.findOne({
      where: {
        id: event.groupId
      },
      attributes: ['id', 'name', 'city', 'state']
    });

    const venue = await Venue.findOne({
      where: {
        id: event.venueId
      },
      attributes: ['id', 'city', 'state']
    });

    event = event.toJSON();

    event.numAttending = numAttending;
    event.previewImage = previewImage.url || null;
    event.Group = group;
    event.Venue = venue;

    modifiedEvents.Events.push(event);
  }

  return res.json(modifiedEvents);
});

router.post('/:eventId/images', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const { eventId } = req.params;

  let eventImage;

  const event = await Event.findByPk(eventId);

  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found"
    });
  }

  const userAttendance = await Attendance.findOne({
    where: {
      userId
    }
  });

  let attendee;
  if (userAttendance) {
    attendee = userAttendance.status === 'attending';
  }

  const group = await Group.findOne({
    where: {
      id: event.groupId
    }
  });

  const memStatus = await Membership.findOne({
    where: {
      userId
    }
  });

  let cohost;
  if (memStatus) {
    cohost = memStatus.status === 'co-host';
  }

  const { url, preview } = req.body;

  if (attendee || group.organizerId === userId || cohost) {
    eventImage = await EventImage.create({
      eventId: event.id,
      url,
      preview
    });
  }

  eventImage = await EventImage.findByPk(eventImage.id, {
    attributes: {
      exclude: ['eventId']
    }
  });

  return res.json(eventImage);
});

router.post('/:eventId/attendance', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const { eventId } = req.params;

  const event = await Event.findByPk(eventId);
  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found"
    });
  }

  const attendance = await Attendance.findOne({
    where: {
      userId,
      eventId
    }
  });

  if (attendance) {
    res.status(400);

    if (attendance.status === 'pending') {
      return res.json({
        message: "Attendance has already been requested"
      });
    } else {
      return res.json({
        message: "User is already an attendee of the event"
      });
    }
  } else {
    await Attendance.create({
      eventId,
      userId,
      status: 'pending'
    });
  }

  return res.json({
    userId,
    status: 'pending'
  });

});

router.put('/:eventId/attendance', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const { eventId } = req.params;

  let event = await Event.findByPk(eventId);

  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found"
    });
  }

  const changedUserId = req.body.userId;
  const changedStatus = req.body.status;

  if (changedStatus === 'pending') {
    res.status(400);
    return res.json({
      message: "Cannot change an attendance status to pending"
    });
  }

  const group = await Group.findByPk(event.groupId);
  const organizer = group.organizerId === userId;
  const membership = await Membership.findOne({
    groupId: group.id,
    userId
  });
  const cohost = membership.status === 'co-host';

});

router.put('/:eventId', requireAuth, validateEvent, async (req, res, next) => {
  const userId = req.user.id;
  const { eventId } = req.params;

  let event = await Event.findByPk(eventId);

  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found"
    });
  }

  const group = await Group.findByPk(event.groupId);
  const organizer = group.organizerId === userId;

  const membership = await Membership.findOne({
    where: {
      userId,
      groupId: group.id
    }
  });
  const cohost = membership.status === 'co-host';

  const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

  const venue = await Venue.findByPk(venueId);

  if (!venue) {
    res.status(404);
    return res.json({
      message: "Venue couldn't be found"
    });
  }

  if (organizer || cohost) {
    event.set({
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate
    });

    await event.save();
  }

  return res.json(event);

});

router.delete('/:eventId', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const { eventId } = req.params;

  const event = await Event.findByPk(eventId);

  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found"
    });
  }

  const group = await Group.findByPk(event.groupId);
  const organizer = group.organizerId === userId;

  const membership = await Membership.findOne({
    where: {
      userId,
      groupId: group.id
    }
  });

  const cohost = membership.status === 'co-host';

  if (organizer || cohost) {
    await event.destroy();
  }

  return res.json({
    message: "Successfully deleted"
  });

});

module.exports = router;
