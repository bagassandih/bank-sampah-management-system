const mongoose = require('mongoose');
// initiate schema
const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
      },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
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
const User = mongoose.model('User', userSchema);
module.exports = User; 