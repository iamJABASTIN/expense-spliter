const express = require('express');
const router = express.Router();
const Group = require('../models/groupModel');
const User = require('../models/userModel');

// Create a new group
// Create a new group (members and createdBy are names, not IDs)
router.post('/create', async (req, res) => {
  try {
    const { name, members, createdBy } = req.body;
    // members: array of names (strings), createdBy: string
    const group = new Group({ name, members, createdBy });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add user to group
router.post('/:groupId/add-member', async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findByIdAndUpdate(
      req.params.groupId,
      { $addToSet: { members: userId } },
      { new: true }
    );
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all groups for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const groups = await Group.find({ members: req.params.userId });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
