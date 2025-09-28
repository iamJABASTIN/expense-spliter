const express = require('express');
const router = express.Router();
const GroupExpense = require('../models/groupExpenseModel');
const Group = require('../models/groupModel');

// Add a group expense and split equally
// Add a group expense and split equally (all fields are strings)
router.post('/add', async (req, res) => {
  try {
    const { group, description, amount, paidBy, splitAmong, splitType, customSplits } = req.body;
    let splits = [];
    if (splitType === 'equal') {
      const share = amount / splitAmong.length;
      splits = splitAmong.map(user => ({ user, amount: share }));
    } else if (splitType === 'custom') {
      splits = customSplits;
    }
    const groupExpense = new GroupExpense({
      group,
      description,
      amount,
      paidBy,
      splitAmong,
      splitType,
      customSplits: splits
    });
    await groupExpense.save();
    res.status(201).json(groupExpense);
  } catch (err) {
    console.error('Error in /group-expense/add:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all expenses for a group
// Get all expenses for a group (by group name)
router.get('/group/:groupName', async (req, res) => {
  try {
    const expenses = await GroupExpense.find({ group: req.params.groupName });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Calculate balances for a group
router.get('/group/:groupId/balances', async (req, res) => {
  try {
    const expenses = await GroupExpense.find({ group: req.params.groupId });
    const balances = {};
    expenses.forEach(exp => {
      exp.customSplits.forEach(split => {
        if (!balances[split.user]) balances[split.user] = 0;
        balances[split.user] -= split.amount;
      });
      if (!balances[exp.paidBy]) balances[exp.paidBy] = 0;
      balances[exp.paidBy] += exp.amount;
    });
    res.json(balances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
