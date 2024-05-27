const bcrypt = require('bcrypt');
const adminModel = require('../../models/admin');

async function adminLogin(usernameOrEmail, password) {

    // check account
    const adminFound = await adminModel.findOne({ 
        $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
    }).lean();
    if (!adminFound) throw { status: 404, message: 'Account not found' };

    // check password
    const isMatch = await bcrypt.compare(password, adminFound.password);
    if (!isMatch) throw { status: 401, message: 'Wrong password' };

    return adminFound;
}

module.exports = {
    adminLogin
}