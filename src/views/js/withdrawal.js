const tableElement = document.querySelector('#data-table-withdrawal');
const baseUrlApi = 'http://localhost:3000/';
let timeout;
let inputCount = 1;

filterSorting(undefined, 'same');

// CRUD
function getDetailWithdrawal(data) {
  // delete unnecessary field
  delete data.__v;
  delete data.sortField;
  delete data.updatedAt;

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
    } else if (key === 'deposit') {

      if (data[key]._id !== undefined) {
        htmlData += '<tr>';
        htmlData += `<th>deposit_id</th>`;
        htmlData += `<td>${data.deposit._id}</td>`;
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

function deleteDataWithdrawal(data) {
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
      fetch(baseUrlApi + 'withdrawal', {
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

async function createDataWithdrawal() {
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

// FILTER SORTING
function filterSorting(element, paginationType) {
  const delay = element || paginationType !== 'same' ? 0 : 1000;
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    let sorting = {};
    let filter = {};
    let pagination = {};

    if (element) {
      let status = parseInt(element.getAttribute('data-sort')) || 0;
      const originalText = element.innerText.replace(/[↓↑]/g, '');

      // Update status
      status = (status + 1) % 3;
      resetHeadersAndStatus(element, originalText);
      updateSortingText(element, originalText, status);
      element.setAttribute('data-sort', status);

      if (status > 0) {
        sorting[element.getAttribute('name')] = status === 1 ? 1 : -1;
      }
    };

    sorting = { ...sorting, ...collectSortingData() };
    filter = collectFilterData();
    pagination = collectPagination(paginationType);
    fetchDataTable({ filter, sorting, pagination });
  }, delay);
};

function updateSortingText(element, originalText, status) {
  if (element.getAttribute('name').split('-')[1] !== 'page') {
    element.innerText = originalText;
    if (status === 1) {
      element.innerText += '↑';
    } else if (status === 2) {
      element.innerText += '↓';
    }
  }
};

function resetHeadersAndStatus(element, originalText) {
  document.querySelectorAll('.waste-type-table > thead > tr > th > div:nth-child(1)').forEach(el => {
    el.innerText = el.innerText.replace(/[↓↑]/g, '');
    if (el.innerText !== originalText) {
      el.setAttribute('data-sort', 0);
    }
  });
}

function collectSortingData() {
  const sorting = { createdAt: 'asc' };
  document.querySelectorAll('.waste-type-table > thead > tr > th > div:nth-child(1)').forEach(header => {
    const sortStatus = parseInt(header.getAttribute('data-sort'));
    if (sortStatus > 0) {
      sorting[header.getAttribute('name')] = sortStatus === 1 ? 1 : -1;
    }
  });
  return sorting;
};

function collectFilterData() {
  const filter = { status: 'active' };
  document.querySelectorAll('input, select').forEach(input => {
    if (input.value && input.getAttribute('name')) {
      filter[input.getAttribute('name')] = input.value;
    }
  });
  return filter;
};

// PAGINATION
function collectPagination(paginationType) {
  const pagination = {};
  const limit = 10;
  const getAllSpanPagination = document.querySelectorAll('.pagination > span');
  getAllSpanPagination.forEach((each) => {
    if (each.getAttribute('name') === 'active-page' && paginationType) {
      let activePage = parseInt(each.innerText);
      if (paginationType === 'next') {
        each.innerText = activePage + 1;
        pagination.page = each.innerText;
      } else if (paginationType === 'prev') {
        if (activePage <= 1) return false;
        each.innerText = activePage - 1;
        pagination.page = each.innerText;
      } else if (paginationType === 'last') {
        const totalData = parseInt(document.getElementsByName('last-page')[0].getAttribute('data-page'));
        const lastPage = Math.ceil(totalData / limit);
        each.innerText = lastPage;
        pagination.page = each.innerText;
      } else if (paginationType === 'first') {
        if (activePage <= 1) return false;
        each.innerText = 1;
        pagination.page = 1;
      } else {
        pagination.page = activePage;
      };

    }
  });

  pagination.page = parseInt(pagination.page);
  pagination.limit = limit;
  return pagination;
};

function resetFilter() {
  document.querySelectorAll('.waste-type-table > thead > tr > th').forEach(each => {
      if(each.innerText.includes('↑') || each.innerText.includes('↓')) {
        const getText = each.querySelector('div');
        getText.setAttribute('data-sort', 0);
        resetHeadersAndStatus(each, getText.innerText.replace(/[↓↑]/g, ''));
      }

      const inputElement = each.querySelector('input, div > input') ?? null;
      inputElement ? inputElement.value = '' : null
      
      const selectElement = each.querySelector('select');

      if (selectElement) {
        const typeSelectElement = selectElement.getAttribute('name');
        if (typeSelectElement === 'status') {
          selectElement.value = 'active';
        } else if (typeSelectElement === 'withdrawal_decision') {
          selectElement.value = 'yes';
        }
      }
    });
  filterSorting(undefined, 'reset');
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
  fetch(baseUrlApi + 'withdrawal/table', {
    method: 'POST',  // Change to POST
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(res => {
      const dataTable = res.result?.data;
      tableElement.querySelector('#loading').remove();
      if (dataTable?.length) {
        setBarChart(dataTable);
        // setDougChart(dataTable);
        dataTable.forEach((element, index) => {
          let customerNameConvert = element.customer.full_name.split(' ').map(each => each[0].toUpperCase() + each.slice(1)).join(' ');
          const statusConvert = element.status[0].toUpperCase() + element.status.slice(1);;
          const amountConvert = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(element.amount);
          const parsedElement = JSON.stringify(element).replace(/"/g, "'");
          const deleteBtn = `<img src="img/asset-14.png" onclick="deleteDataWithdrawal(${parsedElement})"/>`;

          if (customerNameConvert.length > 20) customerNameConvert = customerNameConvert.slice(0, 20) + '...';
      
          let newElement = '<tr>';
          newElement += `<td>${element.createdAt}</td>`;
          newElement += `<td>${amountConvert}</td>`;
          newElement += `<td style="width: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${customerNameConvert}</td>`;
          newElement += `<td style="text-align: center;">${statusConvert}</td>`;
          newElement += `
                <td style="text-align: center;">
                    ${element.status === 'active' ? deleteBtn : ''}
                    <img src="img/asset-16.png" onclick="getDetailWithdrawal(${parsedElement})"/>
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
async function setBarChart(rawData) {
  const rawDataWithdrawal = rawData;
  let rawDataset = [];
  
  rawDataWithdrawal.forEach(withdrawal => {
    const getYear = moment(withdrawal.deposit_date).format('YYYY');
    let checkYear = rawDataset.find(data => data.years === getYear);
    if (!checkYear) {
      checkYear = { years: getYear, deposits: [] };
      rawDataset.push(checkYear);
    };
    checkYear.deposits.push({ id: withdrawal.customer, amount: withdrawal.amount });
  });

  // SUMMARY DISPLAY DATA
  const totalData = rawDataWithdrawal.length;
  let totalWithdrawal = rawDataWithdrawal.reduce((acc, current) => acc + current.amount, 0);
  const totalYears = rawDataset.length;

  document.querySelectorAll('.counter-item > .number')[0].innerText = formatNumber(totalData);
  document.querySelector('.counter-item > .number-deposit').innerText = formatNumber(totalWithdrawal);
  document.querySelectorAll('.counter-item > .number')[1].innerText =formatNumber(totalYears);

  const dataWasteType = {
    labels: rawDataset.map(data => data.years) || [],
    datasets: [{
        label: 'Withdrawal Per-year',
        data: rawDataset.map(data => data.deposits.reduce((acc, current) => acc + current.amount, 0)) || [],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgb(54, 162, 235)'
        ],
        borderWidth: 1
    }]
  };
  const configWasteType = {
      type: 'bar',
      data: dataWasteType,
      options: {
        scales: {
          y: {
              beginAtZero: true
          }
        }
      },
  };
  const ctxWasteType = document.getElementById('lineChart-withdrawal').getContext('2d');
  new Chart(ctxWasteType, configWasteType);
};