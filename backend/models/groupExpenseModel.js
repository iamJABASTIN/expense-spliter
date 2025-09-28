const mongoose = require('mongoose');

const groupExpenseSchema = new mongoose.Schema({
  group: { type: String, required: true }, // group name as string
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: String, required: true }, // paidBy as string (name)
  splitAmong: [{ type: String }], // member names as strings
  splitType: { type: String, enum: ['equal', 'custom'], default: 'equal' },
  customSplits: [{ user: { type: String }, amount: Number }], // user as string
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroupExpense', groupExpenseSchema);