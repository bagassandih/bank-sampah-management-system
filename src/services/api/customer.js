require('dotenv').config();
const customerModel = require('../../models/customer');
const moment = require('moment');

async function getDataCustomer(filter, sorting, pagination) {
    try {
        // initiate query 
        let queryFilter = {};
        let querySorting = { full_name: 'asc' };
        const limit = pagination && pagination.limit || 10;
        const skip = limit * (pagination && pagination.page || 0);

        if (filter && Object.keys(filter).length > 0) {
            if (filter.status) {
                filter['status'] = filter.status;
            };

            // handle filter full name
            if (filter.full_name) {
                filter.full_name = { $regex: filter.full_name, $options: 'i' };
            };

            // handle filter balance
            const fieldBalance = ['withdrawals', 'deposits'];
            fieldBalance.forEach(eachField => {
                if (filter[eachField] !== undefined) {

                    //default operator
                    let operator = filter[eachField];

                    // handle filter balance by range
                    if (filter.balance_range) {
                        if (filter.balance_range === 'less_than') operator = { $lt: filter[eachField] };
                        if (filter.balance_range === 'more_than') operator = { $gt: filter[eachField] };
                    }
                    filter[`balance.${eachField}`] = operator;
                    delete filter[eachField];
                }
            });

            // handle filter createdAt
            if (filter.join_date) {

                // handling iso date problem
                const startDate = moment(filter.join_date, 'MM/YYYY').startOf('month');
                const endDate = moment(filter.join_date, 'MM/YYYY').endOf('month');

                // default operator
                let operator = {
                    $gte: new Date(startDate),
                    $lt: new Date(endDate)
                };
                // handle filter date by range
                if (filter.date_range) {
                    if (filter.date_range === 'less_than') operator = { $lt: new Date(startDate) };
                    if (filter.date_range === 'more_than') operator = { $gt: new Date(endDate) };
                };

                filter.join_date = operator;
            };

            // delete unecessary filter for query to mongoose
            delete filter.date_range;
            delete filter.balance_range;
            queryFilter = filter;
        };

        // handle sorting
        if (sorting && Object.keys(sorting).length > 0) {
            if (sorting.full_name) sorting['full_name'] = sorting.full_name;
            if (sorting.join_date) sorting['join_date'] = sorting.join_date;
            if (sorting.deposits) sorting['balance.deposits'] = sorting.deposits;
            if (sorting.withdrawals) sorting['balance.withdrawals'] = sorting.withdrawals;
            if (sorting.status) sorting['balance.status'] = sorting.status;
            querySorting = sorting;
        };

        return await customerModel
            .find(queryFilter)
            .sort(querySorting)
            .skip(skip)
            .limit(limit)
            .lean();

    } catch (error) {
        throw { status: 400, message: error.message };
    }
};

async function createDataCustomer(input) {
    try {
        // check input is exist or not
        if (!input || !input.length) throw { status: 400, message: 'need data input' };

        // set for payload, key field is full_name for detect duplicate data
        const allInputNames = input.map(newData => {
            if (!newData.full_name) throw { status: 400, message: 'need data input' };
            return newData.full_name;
        });

        // check the duplicate data
        const foundData = await customerModel.find({ full_name: { $in: allInputNames } });
        if (foundData && foundData.length) {
            let messageData = foundData.map(data => data.full_name).join(', ');
            throw { status: 422, message: 'duplicated data detected: ' + messageData };
        };

        // execute for createing data
        await customerModel.create(input);
        return input.length + ' data has been created';
    } catch (error) {
        throw { status: error.status ?? 400, message: error.message };
    };
};

async function deleteDataCustomer(id) {
    try {
        // messages for response
        let message = `'s has been deleted`;
        let updateStatus = 'deleted';

        // check for the current satus
        const checkId = await customerModel.findOne({ _id: id });
        if (!checkId) throw { status: 404, message: 'data not found' };

        if (checkId.status === 'deleted') {
            updateStatus = 'active'
            message = `'s has been reactivated`;
        };

        // execute soft delete
        await customerModel.findByIdAndUpdate(id, {
            status: updateStatus
        });

        return checkId.full_name + message;
    } catch (error) {
        throw { status: error.status ?? 400, message: error.message };
    }
};

async function updateDataCustomer(id, input) {
    try {
        // initiate message for response
        let message = `'s has been updated`;
        let objUpdate = {};

        // check every field for update, to handle empty value
        for (const eachInput in input) {
            if (input[eachInput]) objUpdate[eachInput] = input[eachInput];
        };

        // execute update
        const updatedData = await customerModel.findByIdAndUpdate(id, objUpdate, { new: true });
        return updatedData.full_name + message;
    } catch (error) {
        throw { status: error.status ?? 400, message: error.message };
    }
};

module.exports = {
    getDataCustomer,
    deleteDataCustomer,
    createDataCustomer,
    updateDataCustomer
};
