const express = require('express');
const router = express.Router();

const { Group, Membership, Venue } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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

router.put('/:venueId', requireAuth, validateVenue, async (req, res, next) => {
  const userId = req.user.id;
  const { venueId } = req.params;
  const { address, city, state, lat, lng } = req.body;

  let venue = await Venue.findByPk(venueId);

  if (!venue) {
    res.status(404);
    return res.json({
      message: "Venue couldn't be found"
    });
  }

  const group = await Group.findByPk(venue.groupId);

  const memStatus = await Membership.findOne({
    where: {
      userId
    }
  });

  if (userId !== group.organizerId && (memStatus && memStatus.status !== 'co-host')) {
    res.status(403);
    return res.json({
      error: {
        message: "Not authorized"
      }
    });
  }

  if (group.organizerId === userId || memStatus.status === 'co-host') {
    venue.address = address;
    venue.city = city;
    venue.state = state;
    venue.lat = lat;
    venue.lng = lng;
  }

  await venue.save();

  return res.json(venue);
});



module.exports = router;
