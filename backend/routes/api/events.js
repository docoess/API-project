const express = require('express');
const router = express.Router();

const { Event, Attendance, Group, Venue, EventImage, Membership } = require('../../db/models');
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

  const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

  const venue = await Venue.findByPk(venueId);

  if (!venue) {
    res.status(404);
    return res.json({
      message: "Venue couldn't be found"
    });
  }

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

  return res.json(event);

});

module.exports = router;
