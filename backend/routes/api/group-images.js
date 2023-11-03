const express = require('express');
const router = express.Router();

const { GroupImage, Group, Membership } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js')

router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const { imageId } = req.params;

  const groupImage = await GroupImage.findByPk(imageId);

  if (!groupImage) {
    res.status(404);
    return res.json({
      message: "Group Image couldn't be found"
    });
  }

  const group = await Group.findByPk(groupImage.groupId);
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
      message: "Forbidden"
    });
  }

  if (group.organizerId === userId || cohost) {
    await groupImage.destroy();
  }

  return res.json({
    message: 'Successfully deleted'
  });
});

module.exports = router;
