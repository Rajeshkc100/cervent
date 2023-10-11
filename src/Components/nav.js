import React from "react";
import "./navStyle.css";
import SearchIcon from "@material-ui/icons/Search";
import PropTypes from "prop-types";
import MyMenu from "./menu.js";
import MyProfile from "./profile.js";
import { withStyles } from "@material-ui/core/styles";
import FilterListIcon from "@material-ui/icons/FilterList";
import { Link, Redirect } from "react-router-dom";
import LogoBlack from "../img/logoBlack.jpg";
import LogoWhite from "../img/logoWhite.jpg";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@material-ui/core";

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "#aee5e8",
    },
    "& .MuiInput-underline": {
      "&:hover:not($disabled):before": {
        borderBottomColor: "white",
      },
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#aee5e8",
    },
    "& underline.Mui-focused": {
      borderBottomColor: "#aee5e8",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "red",
      },
      "&:hover fieldset": {
        borderColor: "yellow",
      },
      "&.Mui-focused fieldset": {
        borderColor: "green",
      },
    },
  },
})(TextField);

const styles = {
  root: {
    background: "#fff",
  },
  input: {
    color: "white",
  },
};
class nav extends React.Component {
  componentDidMount() {
    document.querySelector(".navbar").className = "navbar";
    window.addEventListener("scroll", this.handleScroll);
    // console.log(this.props.userName);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    if (window.scrollY > 40) {
      document.querySelector(".navbar").className = "navbar activeNav";
      document.querySelector(".mainHeader").className = "mainHeader invisible";
      document.querySelector(".companySubTitle").className = "companySubTitle";
      document.querySelector(".topBlankSpace").className = "topBlankSpace";
      document.querySelector(".bottomBlankSpace").className =
        "bottomBlankSpace";
      document.querySelector(".navbarItems").className =
        "navbarItems marginCorrection";
    } else {
      document.querySelector(".navbar").className = "navbar";
      document.querySelector(".mainHeader").className = "mainHeader";
      document.querySelector(".companySubTitle").className =
        "companySubTitle invisible";
      document.querySelector(".topBlankSpace").className =
        "topBlankSpace invisible";
      document.querySelector(".bottomBlankSpace").className =
        "bottomBlankSpace invisible";
      document.querySelector(".navbarItems").className = "navbarItems";
    }
  };
  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className="mainHeader">
          <img src={LogoBlack} alt="logo" className="logo1" />

          <div className="title">
            <h1 style={{ fontFamily: "Arial", color: "black" }}>
              <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                Cervent
              </Link>
            </h1>
            <h4
              style={{
                fontFamily: "Arial",
                fontWeight: "normal",
                marginTop: "-20px",
                color: "black",
              }}
            >
              <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                Make Bookings for Your Event
              </Link>
            </h4>
          </div>
        </div>
        <div
          className="topBlankSpace invisible"
          style={{ zIndex: "999" }}
        ></div>
        <AppBar className="navbar" style={{ zIndex: "999" }}>
          <Toolbar>
            <Typography variant="h6">
              <div className="companySubTitle invisible">
                <h4
                  style={{
                    fontFamily: "Comic Sans MS",
                    color: "whitesmoke",
                    marginLeft: "82%",
                    marginTop: "5%",
                  }}
                >
                  <u>
                    <Link
                      to="/"
                      style={{ textDecoration: "none", color: "whitesmoke" }}
                    >
                      Cervent
                    </Link>
                  </u>
                </h4>
                <img src={LogoBlack} alt="logo" className="smallLogo" />
              </div>
            </Typography>
            <div className="navbarItems">
              <div className="searchBox">
                <SearchIcon
                  style={{
                    fontSize: "40px",
                    color: "whitesmoke",
                  }}
                />
                <CssTextField
                  className={classes.margin}
                  id="custom-css-standard-input"
                  placeholder="Search Events ..."
                  size="small"
                  InputProps={{ className: classes.input }}
                  style={{
                    width: "400px",
                    marginLeft: "5px",
                    marginTop: "7px",
                  }}
                />
              </div>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                size="small"
                style={{
                  width: "200px",
                  marginTop: "-3px",
                  marginLeft: "25px",
                }}
              ></FormControl>
              <MyProfile userName={this.props.userName} />
              <MyMenu userName={this.props.userName} />
            </div>
          </Toolbar>
        </AppBar>
        <div
          className="bottomBlankSpace invisible"
          style={{ zIndex: "999" }}
        ></div>
      </div>
    );
  }
}
nav.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(nav);
