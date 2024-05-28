require('dotenv').config();
const services = require('../services/api/customer');

async function getCustomers(req, res) {
    try {
        const { filter } = req.body;
        const dataCustomers = await services.getDataCustomers(filter);
        res.status(200).json({ dataCustomers });
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ status: error.status, message: error.message });
    }
};

module.exports = {
    getCustomers,
};
