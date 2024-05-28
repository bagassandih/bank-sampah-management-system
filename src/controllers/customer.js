require('dotenv').config();
const services = require('../services/api/customer');

async function getCustomer(req, res) {
    try {
        const { filter, sorting, pagination } = req.body;
        const dataCustomers = await services.getDataCustomer(filter, sorting, pagination);
        res.status(200).json({ dataCustomers });
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ status: error.status, message: error.message });
    }
};

async function deleteCustomer(req, res) {
    try {
        const { id } = req.body;
        const deleteData = await services.deleteDataCustomer(id);
        res.status(200).json({ deleteData });
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ status: error.status, message: error.message });
    }
};

module.exports = {
    getCustomer,
    deleteCustomer
};
