require('dotenv').config();
const moment = require('moment');
const customerModel = require('../models/customer');
const wasteTypeModel = require('../models/wasteType');
const depositModel = require('../models/deposit');
const withdrawalModel = require('../models/withdrawal');

async function getDataHome() {
  try {
    let countCustomer = 0;
    let totalDeposit = 0;
    let countWasteType = 0;

    let rawDataset = [];

    const currentYear = moment().format('YYYY');
    const startDate = moment(currentYear + '-01-01').startOf('day').toDate();
    const endDate = moment(currentYear + '-12-31').endOf('day').toDate();

    const rawDataCustomer = await customerModel.find({ status: 'active' }).lean();
    const rawDataWasteType = await wasteTypeModel.find({ status: 'active' }).sort({ name: 1 }).limit(10).lean();
    const rawDataWasteTypeCounter = await wasteTypeModel.find({ status: 'active' }).sort({ deposit_count: -1 }).limit(5).lean();
    const rawDataDeposit = await depositModel.find({
      status: 'active',
      deposit_date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ deposit_date: 1 }).lean();
    const rawDataWitdhrawal = await withdrawalModel.find().sort({ createdAt: -1 }).lean();

    if (rawDataCustomer?.length) {
      // add counter 
      countCustomer = rawDataCustomer.length;
      countWasteType = rawDataWasteType.length;

      // count total deposit
      rawDataCustomer.forEach(customer => totalDeposit += customer.balance.deposit);

      // translate
      if (totalDeposit >= 1000) {
        const thousands = parseFloat(totalDeposit / 1000);
        totalDeposit = `${thousands}k`;
      } else {
        totalDeposit = `${totalDeposit}`;
      }
    };

    if (rawDataDeposit?.length) {
      rawDataDeposit.forEach(deposit => {
        const getMonth = moment(deposit.deposit_date).format('MMMM');
        let checkMonth = rawDataset.find(data => data.month === getMonth);
        if (!checkMonth) {
          checkMonth = { month: getMonth, customers: [] };
          rawDataset.push(checkMonth);
        };
        checkMonth.customers.push({ id: deposit.customer, amount: deposit.amount });
      })
    };

    // dataset for chart deposit
    const listMonth = rawDataset.map(data => data.month);
    const listAmountDeposit = rawDataset.map(data => data.customers.reduce((acc, current) => acc + current.amount, 0));
    const listCustomer = rawDataset.map(data => data.customers.length);
    const listWasteTypeName = rawDataWasteTypeCounter.map(data => data.name);
    const listWasteTypeCount = rawDataWasteTypeCounter.map(data => data.deposit_count);

    const lastDataCustomer = rawDataCustomer
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    const lastDataWithdrawal = rawDataWitdhrawal[0];
    const lastDataDeposit = rawDataDeposit
      .slice()
      .sort((a, b) => new Date(b.deposit_date) - new Date(a.createdAt))[0];
    const lastDataWasteType = rawDataWasteType
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];


    const dataHome = {
      currentYear,
      countCustomer,
      totalDeposit,
      countWasteType,
      listMonth,
      listAmountDeposit,
      listCustomer,
      rawDataWasteType,
      listWasteTypeName,
      listWasteTypeCount
    };

    const dataDashboard = {
      countCustomer,
      countWasteType,
      totalDeposit,
      lastDataCustomer,
      lastDataWithdrawal,
      lastDataDeposit,
      lastDataWasteType
    };

    lastDataCustomer.join_date = moment(lastDataCustomer.join_date).format('ll');
    lastDataDeposit.deposit_date = moment(lastDataDeposit.deposit_date).format('ll');
    lastDataWasteType.createdAt = moment(lastDataWasteType.createdAt).format('ll');
    lastDataWithdrawal.createdAt = moment(lastDataWithdrawal.createdAt).format('ll');

    return { dataHome, dataDashboard };
  } catch (error) {
    throw { status: error.status ?? 400, message: error.message };
  }
}

module.exports = {
  getDataHome,
};
