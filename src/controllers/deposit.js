require('dotenv').config();
const services = require('../services/deposit');

async function getDeposit(req, res) {
    try {
        const { filter, sorting, pagination } = req.body;
        const dataDeposits = await services.getDataDeposit(filter, sorting, pagination);
        res.status(200).json({ dataDeposits });
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ status: error.status, message: error.message });
    }
};

async function createDeposit(req, res) {
    try {
        const { input } = req.body;
        // handle empty value each field
        const inputMap = input.map(eachData => {
            let noEmptyValue = {};
            for (const eachField in eachData) {
                if (eachData[eachField]) noEmptyValue[eachField] = eachData[eachField];
            };
            return noEmptyValue;
        });

        // call the service with new parameter
        const dataDeposits = await services.createDataDeposit(inputMap);
        res.status(200).json({ dataDeposits });
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ status: error.status, message: error.message, data: error.data });
    }
};

async function deleteDeposit(req, res) {
    try {
        const { id } = req.body;
        const deleteData = await services.deleteDataDeposit(id);
        res.status(200).json({ deleteData });
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ status: error.status, message: error.message });
    }
};

module.exports = {
    getDeposit,
    createDeposit,
    deleteDeposit
};
