const express = require('express');
const router = express.Router();

const { EventImage, Event, Group, Membership } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js');

router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const { imageId } = req.params;

  const eventImage = await EventImage.findByPk(imageId);

  if (!eventImage) {
    res.status(404);
    return res.json({
      message: "Event Image couldn't be found"
    });
  }

  const event = await Event.findOne({
    where: {
      id: eventImage.eventId
    }
  });

  const group = await Group.findOne({
    where: {
      id: event.groupId
    }
  });

  let groupOrg;
  if (group) {
    groupOrg = group.organizerId === userId;
  }

  const memStatus = await Membership.findOne({
    where: {
      userId
    }
  });

  let member;
  if (memStatus) {
    member = memStatus.status === 'co-host';
  }

  if (member || groupOrg) {
    await eventImage.destroy();
  }

  return res.json({
    message: 'Successfully deleted'
  });

});

module.exports = router;
