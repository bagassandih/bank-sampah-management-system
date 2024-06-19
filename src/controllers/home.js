require('dotenv').config();
const services = require('../services/home.js');

async function getHomeData(req, res) {
    try {
        const dataHome = await services.getDataHome();
        const data = {
          full_name: req.user?.full_name ?? null,
          ...dataHome
        };
        res.render('home', data);
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ status: error.status, message: error.message });
    }
};

module.exports = {
  getHomeData
};
