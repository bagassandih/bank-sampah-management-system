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

async function createCustomer(req, res) {
    try {
        const { input } = req.body;

        // handle empty value each field
        const inputMap = input.map(eachData => {
            let noEmptyValue = {};
            for (const eachField in eachData) {
                if (eachData[eachField]) noEmptyValue[eachField] = eachData[eachField];
            }
            return noEmptyValue;
        });

        // call the service with new parameter
        const dataCustomers = await services.createDataCustomer(inputMap);
        res.status(200).json({ dataCustomers });
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ status: error.status, message: error.message, data: error.data });
    }
};

async function updateCustomer(req, res) {
    try {
        const { id, input } = req.body;
        const dataCustomers = await services.updateDataCustomer(id, input);
        res.status(200).json({ dataCustomers });
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ status: error.status, message: error.message, data: error.data });
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
    createCustomer,
    updateCustomer,
    deleteCustomer
};
