function formatNumber(value) {
  if (value >= 1000) {
    const thousands = Math.floor(parseFloat(value / 1000).toFixed(1)); // Use toFixed(1) for one decimal place
     return `${thousands}k`;
  } else {
     return `${value}`;
  }
};