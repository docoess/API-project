const express = require('express');
const router = express.Router();

const { Group, Membership, GroupImage, Venue, User, Event, Attendance, EventImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const validateGroup = [
  check('name')
    .notEmpty()
    .isLength({max: 60})
    .withMessage('Name must be 60 characters or less'),
  check('about')
    .notEmpty()
    .isLength({min: 50})
    .withMessage('About must be 50 characters or more'),
  check('type')
    .notEmpty()
    .isIn(['Online', 'In person'])
    .withMessage("Type must be 'Online' or 'In person'"),
  check('private')
    .notEmpty()
    .isBoolean()
    .withMessage('Private must be a boolean'),
  check('city')
    .exists()
    .notEmpty()
    .withMessage('City is required'),
  check('state')
    .exists()
    .notEmpty()
    .withMessage('State is required'),
  handleValidationErrors
];

const validateVenue = [
  check('address')
    .exists()
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .exists()
    .notEmpty()
    .withMessage('City is required'),
  check('state')
    .exists()
    .notEmpty()
    .withMessage('State is required'),
  check('lat')
    .exists()
    .isDecimal()
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists()
    .isDecimal()
    .withMessage('Longitude is not valid'),
  handleValidationErrors
];

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

router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const { groupId } = req.params;

  let venues;

  let group = await Group.findByPk(groupId);
  const memStatus = await Membership.findOne({
    where: {
      userId
    }
  });

  if (!group) {
    res.status(404)
    return res.json({
      message: "Group couldn't be found"
    });
  }

  if ((userId !== group.organizerId || !memStatus) || (memStatus && memStatus.status !== 'co-host')) {
    res.status(403);
    return res.json({
      message: "Only the group organizer or a co-host can view all venues for a group"
    })
  }

  if (group.organizerId === userId || memStatus.status === 'co-host') {
    venues = await Venue.findAll({
      where: {
        groupId
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });
  }

  return res.json({
    Venues: venues
  });

});

router.get('/:groupId/events', async (req, res, next) => {
  const { groupId } = req.params;
  const modifiedEvents = {"Events": []};

  const group = await Group.findByPk(groupId, {
    attributes: ['id', 'name', 'city', 'state']
  });

  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found"
    });
  }

  let events = await Event.findAll({
    where: {
      groupId
    }
  });

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
    event.Venue = venue || null;

    modifiedEvents.Events.push(event);
  }

  return res.json(modifiedEvents);

});

router.get('/:groupId/members', async (req, res, next) => {
  const userId = req.user.id;
  const { groupId } = req.params;

  const groupMembers = {"Members": []};
  let members;

  const group = await Group.findByPk(groupId);
  const reqMember = await Membership.findOne({
    where: {
      userId
    }
  });

  let cohost;
  if (reqMember) {
    cohost = reqMember.status === 'co-host';
  }

  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found"
    });
  }

  if (group.organizerId === userId || cohost) {
    members = await Membership.findAll({
      where: {
        groupId
      }
    });
  } else {
    members = await Membership.findAll({
      where: {
        groupId,
        status: {
          [Op.in]: ['co-host', 'member']
        }
      }
    });
  }

  for (let member of members) {
    let user = await User.findByPk(member.userId, {
      attributes: ['id', 'firstName', 'lastName']
    });

    let userMembership = await Membership.findByPk(user.id);

    user = user.toJSON();
    userMembership = userMembership.toJSON();

    user.Membership = {
      "status": userMembership.status
    };

    groupMembers.Members.push(user);
  }

  return res.json(groupMembers);

});

router.get('/current', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const modifiedGroups = { "Groups": []};

  const userMemberships = await Membership.findAll({
    where: {
      userId: userId
    }
  });

  let memGroups = [];
  for (let membership of userMemberships) {
    memGroups.push(membership.groupId);
  }

  let groups = await Group.findAll({
    where: {
      id: {
        [Op.in]: memGroups
      }
    }
  });

  for (let group of groups) {
    const members = await Membership.count({
      where: {
        groupId: group.id
      }
    });

    const previewImg = await GroupImage.findOne({
      where: {
        preview: true,
        groupId: group.id
      }
    });

    group = group.toJSON();

    group.numMembers = members;
    group.previewImage = previewImg.url || null;

    modifiedGroups.Groups.push(group)
  }

  return res.json(modifiedGroups);

});

router.get('/:groupId', async (req, res) => {
  const { groupId } = req.params;
  let group = await Group.findByPk(groupId);

  if (!group) {
    res.status(404)
    return res.json({
      message: "Group couldn't be found"
    });
  }

  group = group.toJSON();

  group.numMembers = await Membership.count({
    where: {
      groupId: group.id
    }
  });

  group.GroupImages = await GroupImage.findAll({
    where: {
      groupId: group.id
    },
    attributes: ['id', 'url', 'preview']
  });

  group.Organizer = await User.findOne({
    where: {
      id: group.organizerId
    },
    attributes: {
      exclude: ['username']
    }
  });

  group.Venues = await Venue.findAll({
    where: {
      groupId: group.id
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  });


  return res.json(group);
});

router.get('/', async (_req, res) => {
  let groups = await Group.findAll();
  const modifiedGroups = { "Groups": []};

  for (let group of groups) {
    const members = await Membership.count({
      where: {
        groupId: group.id
      }
    });

    const previewImg = await GroupImage.findOne({
      where: {
        preview: true,
        groupId: group.id
      }
    });

    group = group.toJSON();

    group.numMembers = members;
    group.previewImage = previewImg.url || null;

    modifiedGroups.Groups.push(group)
  }



  return res.json(modifiedGroups);
});

router.post('/:groupId/venues', requireAuth, validateVenue, async (req, res, next) => {
  const userId = req.user.id;
  const { groupId } = req.params;
  const { address, city, state, lat, lng } = req.body;

  let venue;

  const group = await Group.findByPk(groupId);

  const member = await Membership.findOne({
    where: {
      groupId,
      userId
    }
  });

  if (!member) {
    res.status(403);
    return res.json({
      error: {
        message: "Not authorized"
      }
    });
  }

  if (!group) {
    res.status(404)
    return res.json({
      message: "Group couldn't be found"
    });
  }

  if ((userId !== group.organizerId || !member) && (member && member.status !== 'co-host')) {
    res.status(403);
    return res.json({
      message: "Only the group organizer or a co-host can add a Venue"
    });
  }

  if (group.organizerId === userId || member.status === 'co-host') {
    venue = await Venue.create({
      groupId,
      address,
      city,
      state,
      lat,
      lng
    });
  }

  if (venue) {
    venue = await Venue.findByPk(venue.id);
  }

  return res.json(venue);

});

router.post('/:groupId/images', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const { groupId } = req.params;

  let group = await Group.findByPk(groupId);

  if (!group) {
    res.status(404);
    return res.json({
      error: {
        message: "Group couldn't be found"
      }
    });
  };

  if (userId !== group.organizerId) {
    res.status(403);
    return res.json({
      error: {
        message: 'Not authorized'
      }
    });
  };

  const { url, preview } = req.body;

  const groupImage = await GroupImage.create({
    groupId,
    url,
    preview
  });

  return res.json({
    id: groupImage.id,
    url,
    preview
  });


});

router.post('/:groupId/events', requireAuth, validateEvent, async (req, res, next) => {
  const userId = req.user.id;
  const { groupId } = req.params;

  let event;

  const group = await Group.findByPk(groupId);
  const member = await Membership.findOne({
    where: {
      userId,
      groupId
    }
  });

  if (!member) {
    res.status(403);
    return res.json({
      error: {
        message: "Not authorized"
      }
    });
  }

  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found"
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

  if ((userId !== group.organizerId || !member) && (member && member.status !== 'co-host')) {
    res.status(403);
    return res.json({
      message: "Only the group organizer or a co-host can create an event"
    });
  }

  if (group.organizerId === userId || member.status === 'co-host') {
    event = await Event.create({
      venueId,
      groupId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate
    });

    event = await Event.findByPk(event.id);
  }

  return res.json(event);

});

router.post('/:groupId/membership', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const { groupId } = req.params;

  let newMembership;

  const group = await Group.findByPk(groupId);

  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found"
    });
  }

  const membership = await Membership.findOne({
    where: {
      userId,
      groupId
    }
  });

  if (membership) {
    res.status(400);
    if (membership.status === 'pending') {
      return res.json({
        message: 'Membership has already been requested'
      });
    } else {
      return res.json({
        message: "User is already a member of the group"
      });
    }
  } else {
      newMembership = await Membership.create({
        userId,
        groupId,
        status: "pending"
      });
  }

  return res.json({
    memberId: newMembership.id,
    status: 'pending'
  });
});

router.post('/', requireAuth, validateGroup, async (req, res, next) => {
  const userId = req.user.id;
  const { name, about, type, private, city, state } = req.body;

  const group = await Group.create({
    organizerId: userId,
    name,
    about,
    type,
    private,
    city,
    state
  });

  await Membership.create({
    userId,
    groupId: group.id,
    status: 'co-host'
  });

  return res.json(group);

});

router.put('/:groupId/membership', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const { groupId } = req.params;

  const group = await Group.findByPk(groupId);
  if (!group) {
    res.status(404);
    return res.json({
      error: {
        message: "Group couldn't be found"
      }
    });
  }

  const authUserMembership = await Membership.findOne({
    where: {
      userId
    }
  });

  const organizer = group.organizerId === userId;
  let cohost;
  if (authUserMembership) {
    cohost = authUserMembership.status === 'co-host';
  }

  const { memberId, status } = req.body;

  let changedUserMembership = await Membership.findOne({
    where: {
      userId: memberId,
      groupId
    }
  });

  if (!changedUserMembership) {
    res.status(404);
    return res.json({
      error: {
        message: "Membership between the user and the group does not exist"
      }
    });
  }

  const user = await User.findByPk(memberId);
  if (!user) {
    res.status(400);
    return res.json({
      message: 'Validation Error',
      errors: {
        "memberId": "User couldn't be found"
      }
    });
  }

  if (status === 'pending') {
    res.status(400);
    return res.json({
      message: 'Validation Error',
      errors: {
        "memberId": "Cannot change a membership status to pending"
      }
    });
  }

  if (status === 'co-host' && !organizer) {
    res.status(403);
    return res.json({
      message: 'Validation Error',
      errors: {
        "memberId": "Only group organizer can change a membership status to co-host"
      }
    });
  }

  if (status === 'member' && !(organizer || cohost)) {
    res.status(403);
    return res.json({
      message: 'Validation Error',
      errors: {
        "memberId": "Only group organizer or a co-host can change a membership status"
      }
    });
  }

  changedUserMembership.set({
    status
  });

  await changedUserMembership.save();

  return res.json({
    id: changedUserMembership.id,
    groupId: parseInt(groupId),
    memberId: changedUserMembership.userId,
    status
  });


});

router.put('/:groupId', requireAuth, validateGroup, async (req, res, next) => {
  const userId = req.user.id;
  const { groupId } = req.params;

  let group = await Group.findByPk(groupId);

  if (!group) {
    res.status(404);
    return res.json({
      error: {
        message: "Group couldn't be found"
      }
    });
  };

  if (userId !== group.organizerId) {
    res.status(403);
    return res.json({
      error: {
        message: 'Not authorized'
      }
    });
  };

  const { name, about, type, private, city, state } = req.body;

  group.set({
    name,
    about,
    type,
    private,
    city,
    state
  });

  await group.save();

  return res.json(group);
});

router.delete('/:groupId/membership', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const { groupId } = req.params;

  const group = await Group.findByPk(groupId);

  if (!group) {
    res.status(404);
    return res.json({
      error: {
        message: "Group couldn't be found"
      }
    });
  }

  const organizer = group.organizerId === userId;

  const { memberId } = req.body;
  const user = await User.findByPk(memberId);

  if (!user) {
    res.status(400);
    return res.json({
      message: 'Validation Error',
      errors: {
        "memberId": "User couldn't be found"
      }
    });
  }

  const membershipToDelete = await Membership.findOne({
    where: {
      userId: memberId,
      groupId
    }
  });

  if (!membershipToDelete) {
    res.status(404);
    return res.json({
      message: 'Membership does not exist for this User'
    });
  }

  if (!organizer && userId !== membershipToDelete.userId) {
    res.status(403);
    return res.json({
      message: 'Validation Error',
      errors: {
        "memberId": "Only group organizer or a member themself can remove a membership"
      }
    });
  }

  await membershipToDelete.destroy();

  return res.json({
    message: "Successfully deleted membership from group"
  });

});

router.delete('/:groupId', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const { groupId } = req.params;

  const group = await Group.findByPk(groupId);

  if (!group) {
    res.status(404);
    return res.json({
      error: {
        message: "Group couldn't be found"
      }
    });
  }

  if (userId !== group.organizerId) {
    res.status(403);
    return res.json({
      message: "Only the group organizer can delete a Group"
    });
  }

  if (group.organizerId === userId) {
    await group.destroy();

    return res.json({
      message: 'Successfully deleted'
    });
  }
});

module.exports = router;
