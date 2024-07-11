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