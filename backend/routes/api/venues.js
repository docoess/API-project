const express = require('express');
const router = express.Router();

const { Group, Membership, Venue } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js')

const { validateVenue } = require('../../utils/custom-validations.js');

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
  let cohost;
  if (memStatus) {
    cohost = memStatus.status === 'co-host';
  }

  if (userId !== group.organizerId && !cohost) {
    res.status(403);
    return res.json({
      error: {
        message: "Not authorized"
      }
    });
  }

  if (!memStatus) {
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
