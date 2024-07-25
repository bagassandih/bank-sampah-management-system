const tableElement = document.querySelector('#data-table-customer');

let timeout;
let inputCount = 1;

filterSorting(undefined, 'same');
summaryData();

// CRUD
function getDetailCustomer(data) {
  // delete unecesarry field
  delete data.__v;

  let htmlData = `<table style='text-align: left; width: 100%; margin: auto;' id='waste-types'>`;
  for (const key in data) {
    htmlData += '<tr>';
    if (key === 'balance') {
      if (data[key].deposit !== undefined) {
        htmlData += '<tr>';
        htmlData += `<th>deposit</th>`;
        htmlData += `<td>${data.balance.deposit}</td>`;
        htmlData += '</tr>';
      }; 
      if (data[key].withdrawal !== undefined) {
        htmlData += '<tr>';
        htmlData += `<th>withdrawal</th>`;
        htmlData += `<td>${data.balance.withdrawal}</td>`;
        htmlData += '</tr>';
      };
    } else {
      htmlData += `<th>${key}</th>`;
      htmlData += `<td>${data[key]}</td>`;
    };
    htmlData += '</tr>';
  };
  htmlData += '</table>';

  Swal.fire({
    title: data.full_name[0].toUpperCase() + data.full_name.slice(1),
    html: htmlData
  });
};

function editDataCustomer(data) {
  const tables = `
    <table class='sa-input'>
        <tr>
            <th>
                Name
            </th>
            <td>
                <input type="text" value="${data.full_name}">    
            </td>
        </tr>
         <tr>
            <th>
                Phone
            </th>
            <td>
                <input type="number" value="${data.phone_number}" min="0">    
            </td>
        </tr>
         <tr>
            <th>
                Address
            </th>
            <td>
                <textarea>${data.address}</textarea>
            </td>
        </tr>
         <tr>
            <th>
                Decision
            </th>
            <td>
                <select>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
            </td>
        </tr>
    </table>
    `;

  Swal.fire({
    title: 'Edit data ' + data.full_name,
    html: tables,
    confirmButtonText: 'Save',
    confirmButtonColor: 'gold',
    showCancelButton: true,
  }).then((result) => {
    const getNameValue = document.querySelectorAll('.sa-input input')[0].value;
    const getPhoneValue = document.querySelectorAll('.sa-input input')[1].value;
    const getAdressValue = document.querySelector('.sa-input textarea').value;
    const getDecisionValue = document.querySelector('.sa-input select').value;
    const bodyRequest = {
      full_name: getNameValue,
      phone_number: getPhoneValue,
      address: getAdressValue,
      withdrawal_decision: getDecisionValue
    };
    if (result.isConfirmed) {
      fetch(baseUrlApi + 'customer', {
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

function deleteDataCustomer(data) {
  let generateTitle;
  let generateText;
  if (data.status === 'active') {
    generateText = data.full_name + " has been deleted";
    generateTitle = 'Confirm to delete ' + data.full_name + '?';
  } else {
    generateText = data.full_name + " has been reactivated";
    generateTitle = 'Confirm to re-active ' + data.full_name + '?';
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
      fetch(baseUrlApi + 'customer', {
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

function createDataCustomer() {
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
              <input type="text" value="" placeholder="Name..">    
          </td>
      </tr>
        <tr>
          <th>
              Phone
          </th>
          <td>
              <input type="number" value="" min="0" placeholder="Phone number..">    
          </td>
      </tr>
        <tr>
          <th>
              Address
          </th>
          <td>
              <textarea placeholder="Address.."></textarea>
          </td>
      </tr>
        <tr>
          <th>
              Decision
          </th>
          <td>
              <select>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
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
      const getNameValue = e.querySelectorAll('.sa-input input')[0].value;
      const getPhoneValue = e.querySelectorAll('.sa-input input')[1].value;
      const getAdressValue = e.querySelector('.sa-input textarea').value;
      const getDecisionValue = e.querySelector('.sa-input select').value;
      bodyRequest.push({
        full_name: getNameValue.toLowerCase(),
        phone_number: getPhoneValue ?? 0,
        address: getAdressValue.toLowerCase(),
        withdrawal_decision: getDecisionValue.toLowerCase()
      });
    });

    if (result.isConfirmed) {
      fetch(baseUrlApi + 'customer', {
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
      <table class='sa-input' data-count-input=${inputCount}>
      <tr>
          <th>
              Name
          </th>
          <td>
              <input type="text" value="" placeholder="Name..">    
          </td>
      </tr>
        <tr>
          <th>
              Phone
          </th>
          <td>
              <input type="number" value="" min="0" placeholder="Phone number..">    
          </td>
      </tr>
        <tr>
          <th>
              Address
          </th>
          <td>
              <textarea placeholder="Address.."></textarea>
          </td>
      </tr>
        <tr>
          <th>
              Decision
          </th>
          <td>
              <select>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
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
  const tableElementContainer = document.querySelector('.waste-type-table:nth-child(2) > thead');
  tableElement.innerHTML += `
    <tr id='loading'>
        <td colspan='7' style='text-align: center;'>
            <img src='https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-05-37_512.gif' width='25%'/>
        </td>
    </tr>
    `;
  fetch(baseUrlApi + 'customer/table', {
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
          let nameConvert = element.full_name.split(' ').map(each => each[0].toUpperCase() + each.slice(1)).join(' ');
          let addressConvert = element.address[0].toUpperCase() + element.address.slice(1);

          if (nameConvert.length > 20) nameConvert = nameConvert.slice(0, 20) + '...';
          if (addressConvert.length > 20) addressConvert = addressConvert.slice(0, 20) + '...';
          const statusConvert = element.status[0].toUpperCase() + element.status.slice(1);
          const depositConvert = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(element.balance.deposit);
          const withdrawConvert = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(element.balance.withdrawal);
          const decisionConvert = element.withdrawal_decision[0].toUpperCase() + element.withdrawal_decision.slice(1);
          const parsedElement = JSON.stringify(element).replace(/"/g, "'");

          let newElement = '<tr>';
          // newElement += `<td style="text-align: center;"> ${index+1}</td>`;
          newElement += `<td style="width: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${nameConvert}</td>`;
          newElement += `<td>${element.phone_number !== 'unknown' ? element.phone_number : '-'}</td>`;
          newElement += `<td style="width: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${addressConvert}</td>`;
          newElement += `<td>${depositConvert}</td>`;
          newElement += `<td>${withdrawConvert}</td>`;
          newElement += `<td>${element.join_date}</td>`;
          newElement += `<td style="text-align: center;">${decisionConvert}</td>`;
          newElement += `<td style="text-align: center;">${statusConvert}</td>`;
          newElement += `
                <td style="text-align: center;">
                    <img src="img/asset-15.png" onclick="editDataCustomer(${parsedElement})"/>
                    <img src="img/asset-14.png" onclick="deleteDataCustomer(${parsedElement})"/>
                    <img src="img/asset-16.png" onclick="getDetailCustomer(${parsedElement})"/>
                </td>`;

          newElement += '</tr>';
          tableElement.innerHTML += newElement;
          document.getElementsByName('last-page')[0].setAttribute('data-page', element.amount_data ?? 0);
        });
      } else {
        tableElement.innerHTML += `
            <tr>
                <td colspan='10' style='text-align:center; padding: 20px;'>No result.</td>
            </tr>
            `;
      };
    });
};

// SUMMARY DATA
function summaryData() {
  const body = {
    pagination: {
      page: 0, limit: 1000
    }
  };
  fetch(baseUrlApi + 'customer/table', {
    method: 'POST',  // Change to POST
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  .then(res => res.json())
  .then(res => {
    const rawData = res.result.data;
    const totalCustomers = rawData.length;
    const totalCustomerActive = rawData.filter(each => each.status === 'active').length;
    const totalCustomerDeleted = rawData.filter(each => each.status === 'deleted').length;
  
    document.querySelectorAll('.counter-item > .number')[0].innerText = formatNumber(totalCustomers);
    document.querySelectorAll('.counter-item > .number')[1].innerText = formatNumber(totalCustomerActive);
    document.querySelectorAll('.counter-item > .number')[2].innerText =formatNumber(totalCustomerDeleted);
  });
};