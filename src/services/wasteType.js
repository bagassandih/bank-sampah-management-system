require('dotenv').config();
const wasteTypeModel = require('../models/wasteType');

async function createDataWasteType(input) {
  try {
    // check input is exist or not
    if (!input || !input.length) throw { status: 400, message: 'need data input' };

    // set for payload, key field is full_name for detect duplicate data
    const allInputNames = input.map(newData => {
        if (!newData.name) throw { status: 400, message: 'need data input' };
        return newData.name;
    });

    // check the duplicate data
    const foundData = await wasteTypeModel.find({ full_name: { $in: allInputNames } });
    if (foundData && foundData.length) {
        let messageData = foundData.map(data => data.full_name).join(', ');
        throw { status: 422, message: 'duplicated data detected: ' + messageData };
    };

    // execute for createing data
    await wasteTypeModel.create(input);
    return input.length + ' data has been created';
} catch (error) {
    throw { status: error.status ?? 400, message: error.message };
};
}

module.exports = {
  createDataWasteType,
};