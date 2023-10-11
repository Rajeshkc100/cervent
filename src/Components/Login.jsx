import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { authenticate, isAuth } from "../helpers/auth";
import { Link } from "react-router-dom";
import { TextField, Button } from "@material-ui/core";
import LogoBlack from "../img/logoBlack.jpg";

function handleCancle() {
  window.location = "/";
}
function handleRegister() {
  window.location = "/register";
}

const Login = ({ history }) => {
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
  });
  const { email, password1 } = formData;
  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const handleSubmit = (e) => {
    console.log(process.env.REACT_APP_API_URL);
    e.preventDefault();
    if (email && password1) {
      setFormData({ ...formData, textChange: "Submitting" });
      axios
        .post(`${process.env.REACT_APP_API_URL}/login`, {
          email,
          password: password1,
        })
        .then((res) => {
          authenticate(res, () => {
            isAuth() && isAuth().role === "admin"
              ? history.push("/admin")
              : history.push("/");
            setFormData({
              ...formData,
              email: "",
              password1: "",
              textChange: "Submitted",
            });
            console.log("asdfasdf");
            toast.success(`Hey ${res.data.user.first_name}, Welcome back!`);
          });
        })
        .catch((err) => {
          setFormData({
            ...formData,
            textChange: "Sign In",
          });
          console.log(err.response);
          toast.error(err.response.data.errors);
        });
    } else {
      toast.error("Please fill all fields");
    }
  };
  return (
    <div>
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
          <div style={{ marginTop: "30px" }}>
            <TextField
              required
              label="Email"
              value={email}
              onChange={handleChange("email")}
              style={{ marginLeft: "55px", width: "35%" }}
            />
          </div>
          <div style={{ marginTop: "30px" }}>
            <TextField
              type="password"
              required
              label="Password"
              value={password1}
              onChange={handleChange("password1")}
              style={{ marginLeft: "55px", width: "35%" }}
            />
          </div>
          <div style={{ marginTop: "15px" }}>
            <Link
              to="/users/password/forget"
              style={{ marginLeft: "50px", textDecoration: "none" }}
            >
              Forgot Password
            </Link>
          </div>
          <Button
            variant="contained"
            color="primary"
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
            Login{" "}
          </Button>
          <div
            style={{
              marginTop: "25px",
              backgroundColor: "whitesmoke",
              width: "41%",
              padding: "10px",
              marginLeft: "30%",
            }}
          >
            Or Create a new account
          </div>
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
            onClick={handleRegister}
          >
            {" "}
            Register{" "}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            type="button"
            style={{
              marginTop: "40px",
              marginLeft: "20px",
              width: "10%",
              color: "#fff",
              backgroundColor: "red",
            }}
            onClick={handleCancle}
          >
            {" "}
            Cancle{" "}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
