let date = new Date(
  new Date().toLocaleString("en-US", { timeZone: "America/Vancouver" })
);

let date1 = new Date(date);
date1.setDate(date1.getDate() + 1);
let date2 = new Date(date);
date2.setDate(date2.getDate() + 2);

console.log(date());
