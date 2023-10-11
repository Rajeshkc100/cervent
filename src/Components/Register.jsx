import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { isAuth } from "../helpers/auth";
import { Redirect } from "react-router-dom";
import "../App.css";
import "./registerStyle.css";
import { TextField, Button } from "@material-ui/core";
import LogoBlack from "../img/logoBlack.jpg";

function handleCancle() {
  window.location = "/";
}
function handleLogin() {
  window.location = "/login";
}

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    address: "",
    number: "",
    email: "",
    password1: "",
    password2: "",
    textChange: "Sign Up",
  });

  const {
    first_name,
    middle_name,
    last_name,
    address,
    number,
    email,
    password1,
    password2,
  } = formData;

  //handle change from inputs
  const handleChange = (text) => (e) => {
    console.log(
      first_name,
      middle_name,
      last_name,
      address,
      number,
      email,
      password1,
      password2
    );
    setFormData({ ...formData, [text]: e.target.value });
  };

  //submit data to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    if (first_name && last_name && address && number && email && password1) {
      if (password1 === password2) {
        setFormData({ ...formData, textChange: "Submitting" });
        axios
          .post(`${process.env.REACT_APP_API_URL}/register`, {
            first_name,
            middle_name,
            last_name,
            address,
            number,
            email,
            password: password1,
          })
          .then((res) => {
            setFormData({
              ...formData,
              first_name: "",
              middle_name: "",
              last_name: "",
              address: "",
              number: "",
              email: "",
              password1: "",
              password2: "",
              textChange: "Submitted",
            });
            toast.success(res.data.message);
          })
          .catch((err) => {
            toast.error(err.response.data.errors);
          });
      } else {
        toast.error("Passwords don't matches");
      }
    } else {
      toast.error("Please fill all fields");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      {isAuth() ? <Redirect to="/" /> : null}
      <div className="formContainer">
        <div style={{ display: "flex", textAlign: "left" }}>
          <img src={LogoBlack} alt="logo" className="formLogo" />
          <div className="title">
            <h1
              style={{
                fontFamily: "Arial",
                fontSize: "70px",
                marginTop: "20px",
              }}
            >
              Cervent
            </h1>
            <h4
              style={{
                fontFamily: "Arial",
                fontWeight: "normal",
                marginTop: "-35px",
                fontSize: "30px",
              }}
            >
              Make Bookings for Your Event
            </h4>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <TextField
              style={{ marginLeft: "55px" }}
              // error
              required
              value={first_name}
              onChange={handleChange("first_name")}
              // id="standard-error-helper-text"
              id="standard-required"
              label="First Name"

              // defaultValue="Hello World"
              // helperText="Incorrect entry."
            />
            <TextField
              label="Middle Name"
              style={{ marginLeft: "55px" }}
              value={middle_name}
              onChange={handleChange("middle_name")}
            />
            {/* value={this.state.lastName} onChange={this.onChangeLastName} */}
          </div>
          <div style={{ marginTop: "30px" }}>
            <TextField
              required
              label="Last Name"
              style={{ marginLeft: "55px" }}
              value={last_name}
              onChange={handleChange("last_name")}
            />
            <TextField
              required
              label="Address"
              style={{ marginLeft: "55px" }}
              value={address}
              onChange={handleChange("address")}
            />
          </div>
          <div style={{ marginTop: "30px" }}>
            <TextField
              required
              label="Contact Number"
              style={{ marginLeft: "55px" }}
              value={number}
              onChange={handleChange("number")}
            />
            <TextField
              required
              label="Email"
              style={{ marginLeft: "55px" }}
              value={email}
              onChange={handleChange("email")}
            />
          </div>
          <div style={{ marginTop: "30px" }}>
            <TextField
              required
              label="Password"
              type="password"
              style={{ marginLeft: "55px" }}
              value={password1}
              onChange={handleChange("password1")}
            />
            <TextField
              required
              label="Confirm Password"
              type="password"
              style={{ marginLeft: "55px" }}
              value={password2}
              onChange={handleChange("password2")}
            />
          </div>
          <Button
            variant="contained"
            type="submit"
            style={{
              marginTop: "40px",
              marginLeft: "45px",
              width: "25%",
              color: "#fff",
              backgroundColor: "#1ab3da",
            }}
          >
            {" "}
            Register{" "}
          </Button>

          <div className="my-12 border-b text-center">
            <Button
              variant="contained"
              type="button"
              style={{
                marginTop: "40px",
                marginLeft: "40px",
                width: "10%",
                color: "#fff",
                backgroundColor: "#1ab3da",
              }}
              onClick={handleLogin}
            >
              {" "}
              Login{" "}
            </Button>
            <Button
              variant="contained"
              type="button"
              style={{
                marginTop: "40px",
                marginLeft: "20px",
                width: "10%",
                backgroundColor: "red",
                color: "#fff",
              }}
              onClick={handleCancle}
            >
              {" "}
              Cancle{" "}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
