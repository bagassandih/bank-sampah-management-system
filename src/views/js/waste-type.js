const tableElement = document.querySelector('#data-table-waste-type');

let timeout;
let inputCount = 0;

filterSorting(undefined, 'same');

// CRUD
function createDataWasteType() {
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
    } else {
      inputCount = 0;
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
    </div>
    `;
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
        summaryData();
        dataTable.forEach((element, index) => {
          const nameConvert = element.name[0].toUpperCase() + element.name.slice(1);
          const statusConvert = element.status[0].toUpperCase() + element.status.slice(1);
          const priceConvert = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(element.price);
          const parsedElement = JSON.stringify(element).replace(/"/g, "'");

          let newElement = '<tr>';
          newElement += `<td>${nameConvert}</td>`;
          newElement += `
                <td>
                    ${priceConvert}
                </td>`;
          newElement += `<td>${element.createdAt}</td>`;
          newElement += `<td style="text-align: center;">${element.deposit_count ?? 0}</td>`;
          newElement += `<td style="text-align: center;">${statusConvert}</td>`;
          newElement += `
                <td style="text-align: center;" class="th-action">
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