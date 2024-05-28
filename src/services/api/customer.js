require('dotenv').config();
const customerModel = require('../../models/customer');
const moment = require('moment');

async function getDataCustomers(filter, sorting, pagination) {
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

        if (sorting && Object.keys(sorting).length > 0) {
            if (sorting.full_name) sorting['full_name'] = sorting.full_name;
            if (sorting.join_date) sorting['join_date'] = sorting.join_date;
            if (sorting.deposits) sorting['balance.deposits'] = sorting.deposits;
            if (sorting.withdrawals) sorting['balance.withdrawals'] = sorting.withdrawals;
            if (sorting.status) sorting['balance.status'] = sorting.status;
            querySorting = sorting;
        };

        console.log(sorting)
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

module.exports = {
    getDataCustomers,
    deleteDataCustomers,
};