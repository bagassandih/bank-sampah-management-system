require('dotenv').config();
const services = require('../services/api/customer');

async function getCustomers(req, res) {
    try {
        const { filter, sorting, pagination } = req.body;
        const dataCustomers = await services.getDataCustomers(filter, sorting, pagination);
        res.status(200).json({ dataCustomers });
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ status: error.status, message: error.message });
    }
};

async function deleteCustomers(req, res) {
    try {
        const { id } = req.body;
        const deleteData = await services.deleteDataCustomers(id);
        res.status(200).json({ deleteData });
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ status: error.status, message: error.message });
    }
}

module.exports = {
    getCustomers,
    deleteCustomers
};
