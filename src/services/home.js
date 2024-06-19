require('dotenv').config();
const moment = require('moment');
const customerModel = require('../models/customer');
const wasteTypeModel = require('../models/wasteType');
const depositModel = require('../models/deposit');

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
    const rawDataWasteType = await wasteTypeModel.find({ status: 'active' }).sort({ name: 1 }).lean();
    const rawDataWasteTypeCounter = await wasteTypeModel.find({ status: 'active' }).sort({ deposit_count: -1 }).limit(5).lean();
    const rawDataDeposit = await depositModel.find({
      status: 'active', 
      deposit_date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ deposit_date: 1 }).lean();

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

    return { currentYear, countCustomer, totalDeposit, countWasteType, listMonth, listAmountDeposit, listCustomer, rawDataWasteType, listWasteTypeName, listWasteTypeCount };
  } catch (error) {
    throw { status: error.status ?? 400, message: error.message };
  }
}

module.exports = {
  getDataHome,
};
