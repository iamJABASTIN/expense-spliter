const mongoose = require('mongoose');


const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: String, required: true }], // store member names as strings
  createdBy: { type: String, required: true }, // store creator name as string
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Group', groupSchema);