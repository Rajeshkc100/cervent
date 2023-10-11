import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { setLocalStorage, removeLocalStorage } from "../helpers/auth";
import "../App.css";
import "./registerStyle.css";
import { TextField, Button, Grid } from "@material-ui/core";
import Nav from "./nav.js";
import EditIcon from "@material-ui/icons/Edit";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

const ViewProfile = ({ match }) => {
  const [userData, setUserData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    address: "",
    number: "",
    email: "",
    role: "",
    _id: "",
  });
  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem("user")));
    const first_name = JSON.parse(localStorage.getItem("user"))["first_name"];
    const middle_name = JSON.parse(localStorage.getItem("user"))["middle_name"];
    const last_name = JSON.parse(localStorage.getItem("user"))["last_name"];
    const address = JSON.parse(localStorage.getItem("user"))["address"];
    const number = JSON.parse(localStorage.getItem("user"))["number"];
    const email = JSON.parse(localStorage.getItem("user"))["email"];
    const role = JSON.parse(localStorage.getItem("user"))["role"];
    const _id = JSON.parse(localStorage.getItem("user"))["_id"];
    setUserData({
      ...userData,
      first_name,
      middle_name,
      last_name,
      address,
      number,
      email,
      role,
      _id,
    });
  }, []);

  const [isDisabled, setIsDisabled] = useState(true);

  const handleChange = (text) => (e) => {
    setUserData({ ...userData, [text]: e.target.value });
  };

  const handleEditCLick = (e) => {
    e.preventDefault();
    setIsDisabled(false);
  };
  const handleCancleCLick = (e) => {
    e.preventDefault();
    setIsDisabled(true);
  };
  const handleConfirmCLick = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_URL}/updateProfileDetails`, userData)
      .then((res) => {
        removeLocalStorage("user");
        setLocalStorage("user", res.data.data);

        window.location = "/viewProfile";
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <Nav />
      <div className="container2">
        <h1
          style={{
            color: "#5B4F5B",
            textAlign: "center",
            fontFamily: "Arial",
            fontSize: "30px",
          }}
        >
          Acccount Details{" "}
        </h1>
        {isDisabled ? (
          <Button
            color="primary"
            style={{ float: "right" }}
            onClick={handleEditCLick}
          >
            <EditIcon color="primary" style={{ marginRight: "10px" }} />
            Edit Profile{" "}
          </Button>
        ) : (
          <div>
            <Button
              color="secondary"
              style={{ float: "right" }}
              onClick={handleCancleCLick}
            >
              <CancelIcon color="secondary" style={{ marginRight: "10px" }} />{" "}
              Cancle{" "}
            </Button>
            <Button
              color="primary"
              style={{ float: "right" }}
              onClick={handleConfirmCLick}
            >
              <CheckCircleIcon
                color="primary"
                style={{ marginRight: "10px" }}
              />{" "}
              Confirm{" "}
            </Button>
          </div>
        )}
        <form style={{ width: "100%" }}>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <TextField
                style={{ width: "100%" }}
                required
                disabled={isDisabled ? "disabled" : ""}
                value={userData ? userData.first_name : ""}
                id="standard-required"
                label="First Name"
                onChange={handleChange("first_name")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                disabled={isDisabled ? "disabled" : ""}
                label="Middle Name"
                style={{ width: "100%" }}
                value={userData ? userData.middle_name : ""}
                onChange={handleChange("middle_name")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                disabled={isDisabled ? "disabled" : ""}
                required
                label="Last Name"
                style={{ width: "100%" }}
                value={userData ? userData.last_name : ""}
                onChange={handleChange("last_name")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                disabled={isDisabled ? "disabled" : ""}
                required
                label="Address"
                style={{ width: "100%" }}
                value={userData ? userData.address : ""}
                onChange={handleChange("address")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                disabled={isDisabled ? "disabled" : ""}
                required
                label="Contact Number"
                style={{ width: "100%" }}
                value={userData ? userData.number : ""}
                onChange={handleChange("number")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                disabled
                required
                label="Email"
                style={{ width: "100%" }}
                value={userData ? userData.email : ""}
                onChange={handleChange("email")}
              />
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default ViewProfile;
