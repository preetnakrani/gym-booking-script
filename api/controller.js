require("dotenv").config();
const { bookSlot } = require("./slotBooker");

(async () => {
  return await bookSlot({
    headless: process.env.NODE_ENV !== "development", // set false to see the browser booking the slot
    username: "",
    password: "",
    gym: 0, // 0 = arc and 1 = birdcoop
    date: "", // fomat YYYYMMDD
    time: "", // format HH:MM XM
    refresh: false,
  });
})();
