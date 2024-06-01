const mongoose = require('mongoose');
// initiate schema
const withdrawalSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: [0, 'Amount must be at least 0'],
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true
});

// from schema to model
const Withdrawal = mongoose.model('withdrawal', withdrawalSchema);
module.exports = Withdrawal; 