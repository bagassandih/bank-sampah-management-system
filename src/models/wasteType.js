const mongoose = require('mongoose');
// initiate schema
const wasteTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        default: [0, 'Amount must be at least 0'],
        required: true
    },
    deposit_count: {
        type: Number,
        default: [0, 'Amount must be at least 0'],
    },
    status: {
        type: String,
        enum: ['active', 'deleted'],
        default: 'active'
    },
}, { timestamps: true });

// from schema to model
const wasteType = mongoose.model('waste_type', wasteTypeSchema);
module.exports = wasteType; 
