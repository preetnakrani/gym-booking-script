import "./App.css";
import React, { useState } from "react";
import { dateOptions } from "./utils/generateDateOptions";
import { DropDown, InputField } from "./common-components/Inputs";
import axios from "./api/base";
import { Modal } from "./common-components/modal/Modal";
import { SyncOutlined } from "@ant-design/icons";

function App() {
  const dateValue = (date) => {
    let year = `${date.getFullYear()}`;
    let month = `${date.getMonth() + 1}`;
    let day = `${date.getDate()}`;

    if (date.getMonth() <= 9) {
      month = "0" + month;
    }
    if (date.getDate() <= 9) {
      day = "0" + day;
    }

    return year + month + day;
  };

  const dateString = (date) => {
    return `${date.getDate()} ${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  const timeString = (hrs, mins, amOrPm) => {
    return `${hrs}:${mins} ${amOrPm}`;
  };

  const gymMaker = (gym) => {
    if (gym === "Arc") {
      return 0;
    } else if (gym === "BirdCoop") {
      return 1;
    }

    return -1;
  };

  let dateOpt = dateOptions();
  const amOrPm = ["am", "pm"];
  const mins = ["00", "30"];
  const hrs = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const gyms = ["Arc", "BirdCoop"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [cwl, setCwl] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState(dateValue(dateOpt[2]));
  const [hours, setHours] = useState("07");
  const [minutes, setMinutes] = useState("00");
  const [amPm, setAmPm] = useState("am");
  const [gym, setGym] = useState(0);
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      let response = await axios.post("/book", {
        username: cwl,
        password: password,
        gym: gym,
        date: date,
        time: `${timeString(hours, minutes, amPm)}`,
        refresh: refresh,
      });
      alert(response.data);
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <div className="title">
        <h1>UBC GYM BOOKING APP</h1>
      </div>
      <form className="form">
        <div className="text-input">
          <InputField
            className="cwl"
            label={"CWL"}
            value={cwl}
            placeholder={"CWL"}
            onChange={(e) => {
              setCwl(e.target.value);
            }}
            type={"text"}
            disabled={loading}
          />
        </div>
        <div className="text-input">
          <InputField
            className="password"
            label={"Password"}
            value={password}
            placeholder={"Password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type={"password"}
            disabled={loading}
          />
        </div>
        <div className="dropdown-input">
          <DropDown
            className="date"
            label="Date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
            optionArray={dateOpt}
            displayFunc={dateString}
            valueFunc={dateValue}
            disabled={loading}
          />
        </div>
        <div className="dropdown-input">
          <DropDown
            className="hour"
            label="Hour"
            value={hours}
            onChange={(e) => {
              setHours(e.target.value);
            }}
            optionArray={hrs}
            disabled={loading}
          />
        </div>
        <div className="dropdown-input">
          <DropDown
            className="min"
            label="Minutes"
            value={minutes}
            onChange={(e) => {
              setMinutes(e.target.value);
            }}
            optionArray={mins}
            disabled={loading}
          />
        </div>
        <div className="dropdown-input">
          <DropDown
            className="ampm"
            label="AM/PM"
            value={amPm}
            onChange={(e) => {
              setAmPm(e.target.value);
            }}
            optionArray={amOrPm}
            disabled={loading}
          />
        </div>
        <div className="dropdown-input">
          <DropDown
            className="gym"
            label="Gym"
            value={gym}
            onChange={(e) => {
              setGym(e.target.value);
            }}
            optionArray={gyms}
            valueFunc={gymMaker}
            disabled={loading}
          />
        </div>
        <div className="text-input">
          <InputField
            className="refresh"
            label={"Refresh"}
            placeholder={"Refresh"}
            value={refresh}
            onChange={(e) => {
              setRefresh(e.target.checked);
            }}
            type={"checkbox"}
            disabled={loading}
          />
        </div>
        <div className="submit-button" onClick={loading ? null : onSubmit}>
          Book
        </div>
      </form>
      <div className="alert">
        This website is created to book UBC gym slots. UBC gym sessions get full
        as soon as they are open for booking. This app will spin up a browser on
        the server and will try to book your preferred slot. The connection
        stays alive for about 5 minutes and hence trying to book your slots 5
        minutes before they go live is ideal. For example, if you are trying to
        book the 1 pm slot on the 31st of December that is avaiable for booking
        starting at 6pm on the 29th of December, you can go on this website on
        the 29th of December and request to book a slot at around 05:55 pm and
        check the refresh option. The browser that spins up on the server will
        have your booking open and will refresh right at 6 pm to book your slot
        for you. Please make sure that there is slot that is or will be
        available to be booked in about 5mins. Make sure your check your
        selections and credentials before booking. Errors can occur while
        booking and there is no gaurantee that your slot will be booked. Use at
        your own risk!!!
        <div className="note">
          Note: A virtual browser needs to be used on the backend at UBC GYM
          booking system does not have a public API.
        </div>
        <div className="warning">
          Warning: Your CWL passwords are not stored but are logged and can be
          viewed by the host and the developer of the website. Use at your own
          risk!!!
        </div>
      </div>
      {loading && (
        <Modal>
          Booking in Progress!!!
          <SyncOutlined
            className={"spinner"}
            spin={true}
            style={{ fontSize: "30px" }}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
