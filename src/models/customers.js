const mongoose = require('mongoose');
// initiate schema
const customerSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: 'Unknown'
    },
    phone_number: {
        type: String,
        unique: true,
        required: true
    },
    balance: {
        withdrawals: {
            type: Number,
            min: [0, 'Amount must be at least 0']
        },
        deposits: {
            type: Number,
            min: [0, 'Amount must be at least 0']
        }
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
const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer; 