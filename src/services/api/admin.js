require('dotenv').config();
const bcrypt = require('bcrypt');
const adminModel = require('../../models/admin');
const jwt = require('jsonwebtoken');

async function adminLogin(usernameOrEmail, password) {
    // check account
    const adminFound = await adminModel.findOne({ 
        $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
    }).lean();
    if (!adminFound) throw { status: 404, message: 'Account not found' };

    // check password
    const isMatch = await bcrypt.compare(password, adminFound.password);
    if (!isMatch) throw { status: 401, message: 'Wrong password' };

    // initiate payload for token
    const payload = {
        email: adminFound.email,
        username: adminFound.username,
        full_name: adminFound.full_name,
    };

    // Generaste token and data admin
    const accessToken = jwt.sign( payload, process.env.SECRET_KEY_ACCESS, { expiresIn: '30m' });
    const refreshToken = jwt.sign( payload, process.env.SECRET_KEY_REFRESH, { expiresIn: '8h' });
    const admin = adminFound;

    // remove field status and password
    delete admin.status;
    delete admin.password;

    return {
        accessToken,
        refreshToken,
        admin
    };
}

module.exports = {
    adminLogin
}