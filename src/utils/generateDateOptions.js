export const dateOptions = () => {
  let date = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Vancouver" })
  );

  let date1 = new Date(date);
  date1.setDate(date1.getDate() + 1);

  let date2 = new Date(date);
  date2.setDate(date2.getDate() + 2);

  let date3 = new Date(date);
  date3.setDate(date3.getDate() + 3);

  return [date, date1, date2, date3];
};
