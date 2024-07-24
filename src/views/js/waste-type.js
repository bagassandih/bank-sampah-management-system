const tableElement = document.querySelector('#data-table-waste-type');
const baseUrlApi = 'http://localhost:3000/';
// const baseUrlApi = 'https://9s4mm4vd-3000.asse.devtunnels.ms/';
let timeout;
let inputCount = 1;

filterSorting(undefined, 'same');
summaryData();
// CRUD
function createDataWasteType() {
  inputCount = 1;
  const tables = `
    <div class='reset-btn sa'>
        <button onclick='addMoreInput()'>Add More+</button>
    </div>
    <table class='sa-input' data-count-input=${inputCount}>
        <tr>
            <th>
                Name
            </th>
            <td>
                <input type="text" value="">    
            </td>
        </tr>
         <tr>
            <th>
                Price
            </th>
            <td>
                <input type="number" value="" min="1">    
            </td>
        </tr>
    </table>
    `;

  Swal.fire({
    title: 'Create new data',
    html: tables,
    confirmButtonText: 'Create',
    confirmButtonColor: 'green',
    showCancelButton: true,
  }).then((result) => {
    let bodyRequest = [];
    const element = document.querySelectorAll('.sa-input > tbody');
    element.forEach(e => {
      const logs = e.querySelectorAll('input');
      bodyRequest.push({
        name: logs[0].value.toLowerCase(),
        price: parseInt(logs[1].value)
      });
    });

    if (result.isConfirmed) {
      fetch(baseUrlApi + 'waste-type/', {
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
              filterSorting();
            });
          };
        })
    }
  });
};

function deleteDataWasteType(data) {
  let generateTitle;
  let generateText;
  if (data.status === 'active') {
    generateText = data.name + " has been deleted";
    generateTitle = 'Confirm to delete ' + data.name + '?';
  } else {
    generateText = data.name + " has been reactivated";
    generateTitle = 'Confirm to re-active ' + data.name + '?';
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
      fetch(baseUrlApi + 'waste-type/', {
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

function editDataWasteType(data) {
  const tables = `
    <table class='sa-input'>
        <tr>
            <th>
                Name
            </th>
            <td>
                <input type="text" value="${data.name}">    
            </td>
        </tr>
         <tr>
            <th>
                Price
            </th>
            <td>
                <input type="number" value="${data.price}" min="1">    
            </td>
        </tr>
    </table>
    `;

  Swal.fire({
    title: 'Edit data ' + data.name,
    html: tables,
    confirmButtonText: 'Save',
    confirmButtonColor: 'gold',
    showCancelButton: true,
  }).then((result) => {
    const getNameValue = document.querySelectorAll('.sa-input > tbody > tr > td > input')[0].value;
    const getPriceValue = document.querySelectorAll('.sa-input > tbody > tr > td > input')[1].value;
    const bodyRequest = {
      name: getNameValue,
      price: getPriceValue
    };
    if (result.isConfirmed) {
      fetch(baseUrlApi + 'waste-type/', {
        method: 'PUT',  // Change to POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data._id, input: bodyRequest })
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status) {
            Swal.fire({
              title: "Failed to edit!",
              text: res.message,
              icon: "error"
            });
          } else {
            Swal.fire({
              title: 'Successfully updated!',
              icon: "success"
            }).then((res) => {
              filterSorting();
            });
          };
        })
    }
  });
};

function getDetailWasteType(data) {
  delete data.updatedAt;
  delete data.__v;

  let htmlData = `<table style='text-align: left; width: 90%; margin: auto;' id='waste-types'>`;
  for (const key in data) {
    htmlData += '<tr>';
    htmlData += `<th>${key}</th>`;
    htmlData += `<td>${data[key]}</td>`;
    htmlData += '</tr>';
  };
  htmlData += '</table>';

  Swal.fire({
    title: data.name[0].toUpperCase() + data.name.slice(1),
    html: htmlData
  });
};

// INPUT DATA
function addMoreInput() {
  inputCount++;
  document.querySelector('.swal2-html-container').innerHTML += `
    <div data-count-input=${inputCount}>
        <br>
    <div class='reset-btn sa'>
        <button hidden></button>
        <button hidden></button>
        <button onclick='deleteInput()'>Delete</button>
    </div>
    <table class='sa-input'>
        <tr>
            <th>
                Name
            </th>
            <td>
                <input type="text" value="">    
            </td>
        </tr>
         <tr>
            <th>
                Price
            </th>
            <td>
                <input type="number" value="" min="1">    
            </td>
        </tr>
    </table>
    </div>
    `;
};

function deleteInput() {
  inputCount--;
  document.querySelectorAll('.swal2-html-container > div')[inputCount].remove();
};

// PAGINATION
function resetFilter() {
  document.querySelectorAll('.waste-type-table > thead > tr > th').forEach(each => {
      if(each.innerText.includes('↑') || each.innerText.includes('↓')) {
        const getText = each.querySelector('div');
        getText.setAttribute('data-sort', 0);
        resetHeadersAndStatus(each, getText.innerText.replace(/[↓↑]/g, ''));
      }
      // console.log(each.innerText)
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

// FILTER SORTING
function filterSorting(element, paginationType) {
  const delay = element || paginationType !== 'same' ? 0 : 1000;
  clearTimeout(timeout);
  console.log(delay)
  timeout = setTimeout(() => {
    let sorting = {};
    let filter = {};
    let pagination = {};

    if (element) {
      let status = parseInt(element.getAttribute('data-sort')) || 0;
      const originalText = element.innerText.replace(/[↓↑]/g, '');
      const fieldName = originalText.toLowerCase().replace(' ', '_').split(' ')[0];

      // Update status
      status = (status + 1) % 3;
      resetHeadersAndStatus(element, originalText);
      updateSortingText(element, originalText, status);
      element.setAttribute('data-sort', status);

      if (status > 0) {
        sorting[element.getAttribute('name')] = status === 1 ? 1 : -1;
      }
    }

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
  const sorting = { name: 'asc' };
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

// FETCH DATA
function fetchDataTable(bodyRequest) {
  // console.log(bodyRequest)
  const body = bodyRequest;
  tableElement.innerHTML = '';
  const tableElementContainer = document.querySelector('.waste-type-table:nth-child(2) > thead');
  tableElement.innerHTML += `
    <tr id='loading'>
        <td colspan='7' style='text-align: center;'>
            <img src='https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-05-37_512.gif' width='25%'/>
        </td>
    </tr>
    `;

  fetch(baseUrlApi + 'waste-type/table', {
    method: 'POST',  // Change to POST
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(res => {
      const dataTable = res.result?.data;
      tableElement.querySelector('#loading').remove();
      if (dataTable?.length) {
        dataTable.forEach((element, index) => {
          const nameConvert = element.name[0].toUpperCase() + element.name.slice(1);
          const statusConvert = element.status[0].toUpperCase() + element.status.slice(1);
          const priceConvert = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(element.price);
          const parsedElement = JSON.stringify(element).replace(/"/g, "'");

          let newElement = '<tr>';
          // newElement += `<td style="text-align: center;"> ${index+1}</td>`;
          newElement += `<td>${nameConvert}</td>`;
          newElement += `
                <td>
                    ${priceConvert}
                </td>`;
          newElement += `<td>${element.createdAt}</td>`;
          newElement += `<td style="text-align: center;">${element.deposit_count ?? 0}</td>`;
          newElement += `<td style="text-align: center;">${statusConvert}</td>`;
          newElement += `
                <td style="text-align: center;">
                    <img src="img/asset-15.png" onclick="editDataWasteType(${parsedElement})"/>
                    <img src="img/asset-14.png" onclick="deleteDataWasteType(${parsedElement})"/>
                    <img src="img/asset-16.png" onclick="getDetailWasteType(${parsedElement})"/>
                </td>`;

          newElement += '</tr>';
          tableElement.innerHTML += newElement;
          document.getElementsByName('last-page')[0].setAttribute('data-page', element.amount_data ?? 0);
        });
      } else {
        tableElement.innerHTML += `
            <tr>
                <td colspan='7' style='text-align:center; padding: 20px;'>No result.</td>
            </tr>
            `;
      };
    });
};

// SUMMARY DATA
function summaryData() {
  const body = {
    filter: {
      status: 'active'
    },
    pagination: {
      page: 0, limit: 1000
    }
  };
  fetch(baseUrlApi + 'waste-type/table', {
    method: 'POST',  // Change to POST
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  .then(res => res.json())
  .then(res => {
    const rawData = res.result.data || [];
    const totalWasteType = rawData.length;
    const highestPrice = rawData.map(data => data.price).sort((a, b) => b - a)[0];
    document.querySelectorAll('.counter-item > .number')[0].innerText = formatNumber(totalWasteType);
    document.querySelectorAll('.counter-item > .number')[1].innerText = formatNumber(highestPrice);
  });
};