require('dotenv').config();
const services = require('../services/admin');

async function loginController(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) throw { status: 400, error: 'need username and password' };
        
        const data = await services.adminLogin(username, password);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(error.status).json({ status: error.status, message: error.message });
    }
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
        const token = req.headers['authorization'];
        if (!token) throw { status: 401, message: 'unauthorized' };
        
        await services.verifyToken(token, 'access');
        
        await next();
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ status: error.status, message: error.message });
    }
};

module.exports = {
    auth,
    loginController,
    refreshTokenController
};
