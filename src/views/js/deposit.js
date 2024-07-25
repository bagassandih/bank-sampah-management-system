const tableElement = document.querySelector('#data-table-deposit');

let timeout;
let inputCount = 1;

filterSorting(undefined, 'same');

// CRUD
function getDetailDeposit(data) {
  // delete unnecessary field
  delete data.__v;
  delete data.sortField;

  let htmlData = `<table style='text-align: left; width: 100%; margin: auto;' id='waste-types'>`;
  for (const key in data) {
    if (key === 'customer') {
      if (data[key].full_name !== undefined) {
        htmlData += '<tr>';
        htmlData += `<th>customer_full_name</th>`;
        htmlData += `<td>${data.customer.full_name}</td>`;
        htmlData += '</tr>';
      } 

      if (data[key]._id !== undefined) {
        htmlData += '<tr>';
        htmlData += `<th>customer_id</th>`;
        htmlData += `<td>${data.customer._id}</td>`;
        htmlData += '</tr>';
      }
      
      // remove the processed customer field
      delete data.customer;
    } else if (key === 'waste_type') {
      if (data[key].name !== undefined) {
        htmlData += '<tr>';
        htmlData += `<th>waste_type_name</th>`;
        htmlData += `<td>${data.waste_type.name}</td>`;
        htmlData += '</tr>';
      } 

      if (data[key]._id !== undefined) {
        htmlData += '<tr>';
        htmlData += `<th>waste_type_id</th>`;
        htmlData += `<td>${data.waste_type._id}</td>`;
        htmlData += '</tr>';
      }

      // remove the processed waste_type field
      delete data.waste_type;
    } else {
      htmlData += '<tr>';
      htmlData += `<th>${key}</th>`;
      htmlData += `<td>${data[key]}</td>`;
      htmlData += '</tr>';
    }
  }
  htmlData += '</table>';

  Swal.fire({
    title: 'Data Deposit',
    html: htmlData
  });
};

function deleteDataDeposit(data) {
  let generateTitle;
  let generateText;
  if (data.status === 'active') {
    generateText = data._id + " has been deleted";
    generateTitle = 'Confirm to delete ' + data._id + '?';
  };

  Swal.fire({
    title: generateTitle,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirm"
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(baseUrlApi + 'deposit', {
        method: 'DELETE',  // Change to POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data._id })
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status) {
            Swal.fire({
              title: "Failed to delete!",
              text: res.message,
              icon: "error"
            });
          } else {
            Swal.fire({
              title: generateText,
              icon: "success"
            }).then((res) => {
              filterSorting(undefined, 'same');
            });
          };
        });
    }
  });
};

async function calculateAmount(count) {
  const getDocument = document.querySelectorAll('.sa-input')[count-1];

  const getValueWasteType = getDocument.querySelectorAll('select')[0].value;
  const listWasteType = await getAllWasteTypeData();
  const getOneDataWasteType = listWasteType.filter((each) => each._id === getValueWasteType)[0];
  const getAmountValue = getDocument.querySelectorAll('.sa-input input')[0].value;

  const calculate = getAmountValue * getOneDataWasteType.price;

  getDocument.querySelectorAll('.sa-input input')[1].value = calculate;
};

async function getAllWasteTypeData() {
  const bodyRequest = {
    filter: { status: 'active' },
    pagination: { page: 0, limit: 1000 }
  };

  try {
    const response = await fetch(baseUrlApi + 'waste-type/table', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyRequest)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const res = await response.json();
    return res.result?.data.map(each => ({
      _id: each._id,
      name: each.name.split(' ').map(each => each[0].toUpperCase() + each.slice(1)).join(' '),
      price: each.price
    })) || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

async function getAllCustomerData() {
  const bodyRequest = {
    filter: { status: 'active' },
    pagination: { page: 0, limit: 1000 }
  };

  try {
    const response = await fetch(baseUrlApi + 'customer/table', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyRequest)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const res = await response.json();
    return res.result?.data.map(each => ({
      _id: each._id,
      name: each.full_name.split(' ').map(each => each[0].toUpperCase() + each.slice(1)).join(' '),
      price: each.price
    })) || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

async function createDataDeposit() {
  const listWasteType = await getAllWasteTypeData();
  const listCustomer = await getAllCustomerData();

  let optionWasteType = '';
  let optionCustomer = '';

  listWasteType.forEach(wt => {
    optionWasteType += `<option value="${wt._id}">${wt.name}</option>`
  });

  listCustomer.forEach(customer => {
    optionCustomer += `<option value="${customer._id}">${customer.name}</option>`
  });
  
  const tables = `
    <div class='reset-btn sa'>
        <button onclick='addMoreInput(${JSON.stringify(optionWasteType)}, ${JSON.stringify(optionCustomer)})'>Add More+</button>
    </div>
    <table class='sa-input' data-count-input=${inputCount}>
      <tr>
        <th>
            Waste Type
        </th>
        <td>
            <select>${optionWasteType}</select>
        </td>
      </tr>
        
      <tr>
        <th>
            Customer
        </th>
        <td>
            <select>${optionCustomer}</select>
        </td>
      </tr>
      
      <tr>
          <th>
              Weight
          </th>
          <td>
              <input type="number" value="" min="0" placeholder="Weight.." onchange="calculateAmount(${inputCount})">    
          </td>
      </tr>

      <tr>
          <th>
              Amount
          </th>
          <td>
              <input type="number" value="" placeholder="Amount.." readOnly style="color:gray;">    
          </td>
      </tr>
     
  </table>
    `;

  Swal.fire({
    title: 'Create New Data',
    html: tables,
    confirmButtonText: 'Create',
    confirmButtonColor: 'green',
    showCancelButton: true,
  }).then((result) => {
    let bodyRequest = [];
    const element = document.querySelectorAll('.sa-input > tbody');
    element.forEach(e => {
      const getWasteTypeValue = e.querySelectorAll('.sa-input select')[0].value;
      const getCustomerValue = e.querySelectorAll('.sa-input select')[1].value;
      const getWeightValue = e.querySelectorAll('.sa-input input')[0].value;
      const getAmountValue = e.querySelectorAll('.sa-input input')[1].value;
      bodyRequest.push({
        waste_type: getWasteTypeValue,
        customer: getCustomerValue,
        weight: +getWeightValue,
        amount: +getAmountValue
      });
    });

    if (result.isConfirmed) {
      fetch(baseUrlApi + 'deposit', {
        method: 'POST',  // Change to POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: bodyRequest })
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status) {
            Swal.fire({
              title: "Failed to create!",
              text: res.message,
              icon: "error"
            });
          } else {
            Swal.fire({
              title: 'Successfully created!',
              icon: "success"
            }).then((res) => {
              filterSorting(undefined, 'same');
            });
          };
        })
    }
  });
};

// INPUT DATA
function addMoreInput(optionWasteType, optionCustomer) {
  inputCount++;
  document.querySelector('.swal2-html-container').innerHTML += `
    <div data-count-input=${inputCount}>
        <br>
    <div class='reset-btn sa'>
        <button hidden></button>
        <button hidden></button>
        <button onclick='deleteInput()'>Delete</button>
    </div>
    <table class='sa-input' data-count-input=${inputCount}>
      <tr>
        <th>
            Waste Type
        </th>
        <td>
            <select>${optionWasteType}</select>
        </td>
      </tr>
        
      <tr>
        <th>
            Customer
        </th>
        <td>
            <select>${optionCustomer}</select>
        </td>
      </tr>
      
      <tr>
          <th>
              Weight
          </th>
          <td>
              <input type="number" value="" min="0" placeholder="Weight.." onchange="calculateAmount(${inputCount})">    
          </td>
      </tr>

      <tr>
          <th>
              Amount
          </th>
          <td>
              <input type="number" value="" placeholder="Amount.." readOnly style="color:gray;">    
          </td>
      </tr>
     
  </table>
  </div>
    `;
};

// FETCH DATA
function fetchDataTable(bodyRequest) {
  const body = bodyRequest;
  tableElement.innerHTML = '';
  tableElement.innerHTML += `
    <tr id='loading'>
        <td colspan='8' style='text-align: center;'>
            <img src='https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-05-37_512.gif' width='25%'/>
        </td>
    </tr>
    `;
  fetch(baseUrlApi + 'deposit/table', {
    method: 'POST',  // Change to POST
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(res => {
      const dataTable = res.result?.data;
      tableElement.querySelector('#loading').remove();
      if (dataTable?.length) {
        summaryData();
        dataTable.forEach((element, index) => {
          let customerNameConvert = element.customer.full_name.split(' ').map(each => each[0].toUpperCase() + each.slice(1)).join(' ');
          let wasteTypeConvert = element.waste_type.name.split(' ').map(each => each[0].toUpperCase() + each.slice(1)).join(' ');
          const statusConvert = element.status[0].toUpperCase() + element.status.slice(1);
          const withdrawalConvert = element.withdrawal_status[0].toUpperCase() + element.withdrawal_status.slice(1);
          const amountConvert = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(element.amount);
          const parsedElement = JSON.stringify(element).replace(/"/g, "'");
          const deleteBtn = `<img src="img/asset-14.png" onclick="deleteDataDeposit(${parsedElement})"/>`;

          if (customerNameConvert.length > 20) customerNameConvert = customerNameConvert.slice(0, 20) + '...';
      
          let newElement = '<tr>';
          newElement += `<td>${element.deposit_date}</td>`;
          newElement += `<td>${amountConvert}</td>`;
          newElement += `<td style="text-align: right;">${element.weight} kg</td>`;
          newElement += `<td style="width: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${wasteTypeConvert}</td>`;
          newElement += `<td style="width: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${customerNameConvert}</td>`;
          newElement += `<td style="text-align: center;">${withdrawalConvert}</td>`;
          newElement += `<td style="text-align: center;">${statusConvert}</td>`;
          newElement += `
                <td style="text-align: center;">
                    ${element.status === 'active' ? deleteBtn : ''}
                    <img src="img/asset-16.png" onclick="getDetailDeposit(${parsedElement})"/>
                </td>`;

          newElement += '</tr>';
          tableElement.innerHTML += newElement;
          document.getElementsByName('last-page')[0].setAttribute('data-page', element.amount_data ?? 0);
        });
      } else {
        tableElement.innerHTML += `
            <tr>
                <td colspan='8' style='text-align:center; padding: 20px;'>No result.</td>
            </tr>
            `;
      };
    });
};

// CHART
async function setLineChart(rawData) {
  const rawDataDeposit = rawData;
  let rawDataset = [];

   // REMOVE EXISTING CANVAS
   document.getElementById('lineChart-deposit').remove();
   const canvasLine = document.createElement('canvas');
   canvasLine.id = 'lineChart-deposit';
   document.querySelectorAll('.chart-deposit')[0].appendChild(canvasLine);
  
  rawDataDeposit.forEach(deposit => {
    const getMonth = moment(deposit.deposit_date).format('MMMM');
    let checkMonth = rawDataset.find(data => data.month === getMonth);
    if (!checkMonth) {
      checkMonth = { month: getMonth, customers: [] };
      rawDataset.push(checkMonth);
    };
    checkMonth.customers.push({ id: deposit.customer, amount: deposit.amount });
  });

  let dataDeposit = {
    labels:  rawDataset.map(data => data.month),
    datasets: [{
        label: 'Total Deposit',
        data: rawDataset.map(data => data.customers.reduce((acc, current) => acc + current.amount, 0)),
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgb(75, 192, 192, 0.2)',
        borderWidth: 2
    }]
  };
  
  const configDeposit = {
    type: 'line',
    data: dataDeposit,
    options: {
        responsive: true,
        scales: {
            x: {
                display: true,
                title: {
                    display: false,
                    text: 'Month'
                }
            },
            y: {
                display: true,
                title: {
                    display: false,
                    text: 'Amount'
                }
            }
        }
    }
  };
  
  const ctxDeposit = document.getElementById('lineChart-deposit').getContext('2d');
  new Chart(ctxDeposit, configDeposit);
};

async function changeYear(year) {
  const body = {
    filter: { 
      status: 'active',
      deposit_chart: `${year}-07-24T05:01:37.986Z`
    },
    pagination: {
      page: 0,
      limit: 1000
    }
  };

  const response = await fetch(baseUrlApi + 'deposit/table', {
    method: 'POST',  // Change to POST
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  };

  const data = await response.json();
  setLineChart(data.result.data);
  setDougChart(data.result.data);
};

async function setDougChart(rawData) {
  const rawDataDeposit = rawData;
  let rawDataset = [];
  
  // REMOVE EXISTING CANVAS
  document.getElementById('doughChart-deposit').remove();
  const canvasDough = document.createElement('canvas');
  canvasDough.id = 'doughChart-deposit';
  document.querySelectorAll('.chart-customer')[0].appendChild(canvasDough);

  rawDataDeposit.forEach(deposit => {
    const getMonth = moment(deposit.deposit_date).format('MMMM');
    let checkMonth = rawDataset.find(data => data.month === getMonth);
    if (!checkMonth) {
      checkMonth = { month: getMonth, customers: [] };
      rawDataset.push(checkMonth);
    };
    checkMonth.customers.push({ id: deposit.customer, amount: deposit.amount });
  });

  const getActiveCustomer = rawDataset.map(monthData => {
    const uniqueCustomers = new Set(monthData.customers.map(customer => customer.id._id));
    return uniqueCustomers.size;
  });

  const dataCustomer = {
    labels: rawDataset.map(data => data.month),
    datasets: [{
        label: 'Customers Active',
        data: getActiveCustomer,
        backgroundColor: [
            'rgb(54, 162, 235, 0.8)',
            'rgb(104, 162, 235, 0.8)',
            'rgb(154, 162, 235, 0.8)',
            'rgb(204, 162, 235, 0.8)',
            'rgb(254, 162, 235, 0.8)',
            'rgb(54, 162, 235, 0.8)',
        ],
        hoverOffset: 2
    }]
  };

  const configCustomer = {
    type: 'doughnut',
    data: dataCustomer,
  };

  const ctxCustomer = document.getElementById('doughChart-deposit').getContext('2d');
  new Chart(ctxCustomer, configCustomer);
};

// SUMMARY DATA
function summaryData() {
  const body = {
    pagination: {
      page: 0, limit: 1000
    }
  };
  fetch(baseUrlApi + 'deposit/table', {
    method: 'POST',  // Change to POST
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  .then(res => res.json())
  .then(res => {
    const rawData = res.result.data;
    let totalData = rawData.length;
    let totalDeposit = rawData.reduce((acc, current) => acc + current.amount, 0);
    let totalWeight = rawData.reduce((acc, current) => acc + current.weight, 0);
  
    document.querySelectorAll('.counter-item > .number')[0].innerText = formatNumber(totalData);
    document.querySelector('.counter-item > .number-deposit').innerText = formatNumber(totalDeposit);
    document.querySelectorAll('.counter-item > .number')[1].innerText = formatNumber(totalWeight);

    setLineChart(rawData);
    setDougChart(rawData);
  });
};