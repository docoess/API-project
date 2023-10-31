const express = require('express');
const router = express.Router();

const { Event, Attendance, Group, Venue, EventImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

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

module.exports = router;
