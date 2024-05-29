require('dotenv').config();
const wasteTypeModel = require('../models/wasteType');

async function createDataWasteType(input) {
  try {
    // check input is exist or not
    if (!input || !input.length) throw { status: 400, message: 'need data input' };

    // set for payload, key field is full_name for detect duplicate data
    const allInputNames = input.map(newData => {
      if (!newData.name || !newData.price) throw { status: 400, message: 'need data input' };
      return newData.name;
    });

    // check the duplicate data
    const foundData = await wasteTypeModel.find({ name: { $in: allInputNames } });
    if (foundData && foundData.length) {
      let messageData = foundData.map(data => data.name).join(', ');
      throw { status: 422, message: 'duplicated data detected: ' + messageData };
    };

    // execute for createing data
    await wasteTypeModel.create(input);
    return input.length + ' data has been created';
  } catch (error) {
    throw { status: error.status ?? 400, message: error.message };
  };
};

async function updateDataWasteType(id, input) {
  try {
    if (!id || !input || (input && !Object.keys(input).length)) throw { status: 400, message: 'need data input' };

    // initiate message for response
    let message = `'s has been updated`;
    let objUpdate = {};

    // check every field for update, to handle empty value
    for (const eachInput in input) {
      if (input[eachInput]) objUpdate[eachInput] = input[eachInput];
    };

    // execute update
    const updatedData = await wasteTypeModel.findByIdAndUpdate(id, objUpdate, { new: true });
    return updatedData.name + message;
  } catch (error) {
    throw { status: error.status ?? 400, message: error.message };
  }
};

async function deleteDataWasteType(id) {
  try {
    // messages for response
    if (!id) throw { status: 400, message: 'need data input' };
    let message = `'s has been deleted`;
    let updateStatus = 'deleted';

    // check for the current satus
    const checkId = await wasteTypeModel.findOne({ _id: id });
    if (!checkId) throw { status: 404, message: 'data not found' };

    if (checkId.status === 'deleted') {
      updateStatus = 'active'
      message = `'s has been reactivated`;
    };

    // execute soft delete
    await wasteTypeModel.findByIdAndUpdate(id, {
      status: updateStatus
    });

    return checkId.name + message;
  } catch (error) {
    throw { status: error.status ?? 400, message: error.message };
  }
};

module.exports = {
  createDataWasteType,
  deleteDataWasteType,
  updateDataWasteType
};