require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { bookSlot } = require("./api/slotBooker");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "build")));

app.post("/book", async (req, res, next) => {
  try {
    await bookSlot({
      headless: process.env.NODE_ENV !== "development",
      ...req.body,
    });
    console.log("slot booked");
    return res.send(`${req.body.username}'s slot has been booked!`);
  } catch (err) {
    console.log(err);
    return next(
      new Error(
        `Something went wrong! ${req.body.username}'s slot may or may not have been booked!`
      )
    );
  }
});

app.use((err, _req, res, _next) => {
  if (err) {
    return res.send(err.message);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.port || process.env.PORT || 9999, () => {
  console.log(
    `Server started at http://localhost:${
      process.env.port || process.env.PORT || 9999
    }`
  );
});
