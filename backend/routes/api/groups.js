const express = require('express');
const router = express.Router();

const { Group, Membership, GroupImage, Venue, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
const group = require('../../db/models/group');

const validateGroup = [
  check('name')
    .notEmpty()
    .isLength({min: 1, max: 60})
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

  return res.json(group);

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

  group = group.toJSON();

  group.name = name;
  group.about = about;
  group.type = type;
  group.private = private;
  group.city = city;
  group.state = state;

  return res.json(group);
});

module.exports = router;
