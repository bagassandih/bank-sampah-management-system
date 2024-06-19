require('dotenv').config();
const services = require('../services/admin');

async function loginController(req, res) {
    try {
        let { username, password } = req.body;
        if (!username || !password) throw { status: 400, error: 'need username and password' };
        username = username.toLowerCase();
        const data = await services.adminLogin(username, password);
        res.status(200).cookie('token', data, { httpOnly: true }).json(data);
    } catch (error) {
        console.error(error);
        res.status(error.status).json({ status: error.status, message: error.message });
    }
};

async function loginPage(req, res) {
    res.render('login')
};

async function refreshTokenController(req, res) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw { status: 400, message: 'need refresh token' };
        
        const newAccessToken = await services.adminRefresh(refreshToken);
        res.status(200).json({ newAccessToken });
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ status: error.status, message: error.message });
    }
};

async function auth(req, res, next) {
    try{
        // const token = req.headers['authorization'];
        const token = req.cookies['token']?.accessToken ?? null;
        if (token) {
            req.user = await services.verifyToken(token, 'access');
            return await next();
        } else {
            req.user = null;
            return await next();
        }
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ status: error.status, message: error.message });
    }
};

module.exports = {
    auth,
    loginController,
    refreshTokenController,
    loginPage
};
