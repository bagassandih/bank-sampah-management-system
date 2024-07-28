function editDataCustomer(rawData) {
  const data = JSON.parse(rawData);
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
                    Gender
                </th>
                <td>
                    <select>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    </select>
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
    const getGenderValue = document.querySelectorAll('.sa-input select')[0].value;
    const getDecisionValue = document.querySelectorAll('.sa-input select')[1].value;
    const bodyRequest = {
      full_name: getNameValue,
      phone_number: getPhoneValue,
      gender: getGenderValue,
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
              window.location.reload();
            });
          };
        })
    }
  });
};