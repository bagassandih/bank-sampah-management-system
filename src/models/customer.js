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
        default: 'unknown'
    },
    withdrawal_decision: {
        type: String,
        enum: ['yes', 'no'],
        default: 'yes'
    },
    balance: {
        withdrawal: {
            type: Number,
            min: [0, 'Amount must be at least 0'],
            default: 0
        },
        deposit: {
            type: Number,
            min: [0, 'Amount must be at least 0'],
            default: 0
        }
    },
    status: {
        type: String,
        enum: ['active', 'deleted'],
        default: 'active'
    },
    join_date: {
        type: Date, 
        default: new Date()
    }
});

// from schema to model
const Customer = mongoose.model('customer', customerSchema);
module.exports = Customer; 