import React, { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../../config/baseUrl";
import { TextField, CircularProgress } from "@mui/material";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import { Stepper, Step, StepLabel, Button } from "@material-ui/core";

const Register = () => {
  const CloudinaryCredentials = {
    cloudName: "ded6s1sof",
    uploadPreset: "pcq731ml",
    apiKey: "348193329193946",
    apiSecret: "lNTKKbJe9sf3AQb7sZqgftF9H5w",
  };

  const handleImageUpload = async (image) => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", CloudinaryCredentials.uploadPreset);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CloudinaryCredentials.cloudName}/image/upload`,
        formData
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed");
    }
  };

  const navigate = useNavigate();
  const auth = () => {
    navigate("/home");
  };
  const register = () => {
    navigate("/register");
  };
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [reg, setReg] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dob: "",
    password: "",
    access_level: "skipper",
    email: "",
  });

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setReg({ ...reg, [name]: value });
  };

  const validateDob = (value) => {
    const currentDate = new Date().toISOString().split("T")[0];
    return value <= currentDate
      ? undefined
      : "Date of birth cannot be in the future";
  };

  const validatePhoneNumber = (value) => {
    const phoneNumberRegex = /(2507[8,2,3,9])[0-9]{7}/;
    return phoneNumberRegex.test(value)
      ? undefined
      : "Phone number should match the pattern (2507[8,2,3,9])[0-9]{7}";
  };

  // Get the current date in the format YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Pad the month and day with leading zeros if needed
    month = month.toString().padStart(2, "0");
    day = day.toString().padStart(2, "0");

    return `${today.getFullYear()}-${month}-${day}`;
  };

  const handleNext = () => {
    const { firstName, lastName, phoneNumber, dob, password } = reg;

    if (firstName && lastName && phoneNumber && dob && password) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      toast.error("Please fill in all the fields", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      reg.firstName &&
      reg.lastName &&
      reg.dob &&
      reg.password &&
      reg.password &&
      reg.email
    ) {
      setIsLoading(true);

      try {
        const requestBody = {
          firstName: reg.firstName,
          lastName: reg.lastName,
          dob: reg.dob,
          phoneNumber: reg.phoneNumber,
          access_level: "client",
          password: reg.password,
          email: reg.email,
        };

        const response = await axios.post(
          `${BASE_URL}/user/createAccount`,
          requestBody
        );

        toast.success("Account was successfully created", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => {
          setIsLoading(false);
          navigate("/");
        }, 3000);
      } catch (error) {
        let message = String(error.response?.data?.message || error.message);
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setIsLoading(false);
      }
    } else {
      toast.error("Please upload all the required files", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    console.log(reg);
  };

  return (
    <div className="login-section">
      <ToastContainer />
      <div style={{ border: "", height: "550px" }} className="login-page">
        <div className="login-header">
          <div className="login-item"></div>
          <div className="login-item">
            <h5 style={{ paddingTop: "50px" }}>Create Account</h5>
          </div>

          <form className="form-group" onSubmit={handleSubmit}>
            {activeStep === 0 && (
              <div>
                <div className="form-input">
                  <input
                    type="text"
                    name="firstName"
                    onChange={handleInputs}
                    value={reg.firstName}
                    className=""
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="form-input">
                  <input
                    type="text"
                    name="lastName"
                    onChange={handleInputs}
                    value={reg.lastName}
                    className=""
                    placeholder="Last Name"
                    required
                  />
                </div>
                <div className="form-input">
                  <input
                    type="text"
                    name="phoneNumber"
                    onChange={handleInputs}
                    value={reg.phoneNumber}
                    className=""
                    placeholder="Phone"
                    required
                  />
                </div>
                <div className="form-input">
                  <input
                    type="date"
                    name="dob"
                    onChange={handleInputs}
                    value={reg.dob}
                    className=""
                    placeholder="Date of Birth"
                    max={getCurrentDate()} // Set the max attribute to the current date
                    required
                  />
                </div>
                <div className="form-input">
                  <input
                    type="email"
                    name="email"
                    onChange={handleInputs}
                    value={reg.email}
                    className=""
                    placeholder="Enter email "
                    required
                  />
                </div>
                <div className="form-input">
                  <input
                    type="password"
                    name="password"
                    onChange={handleInputs}
                    value={reg.password}
                    className=""
                    placeholder="Password"
                    required
                  />
                </div>
                <div style={{ paddingBottom: "30px" }} className="form-input">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    CREATE ACCOUNT
                  </Button>
                  <Button
                    style={{ paddingTop: "10px;", marginTop: "10px" }}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
