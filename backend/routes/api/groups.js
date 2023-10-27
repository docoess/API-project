const express = require('express');
const router = express.Router();

const { Group, Membership, GroupImage } = require('../../db/models');

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
    group.previewImage = previewImg.url;

    modifiedGroups.Groups.push(group)
  }



  return res.json(modifiedGroups);
});

module.exports = router;
