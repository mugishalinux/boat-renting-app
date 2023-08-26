import React, { useState } from "react";
import "./login.css";
import logo from "./16631.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../../config/baseUrl";
import { CircularProgress } from "@mui/material";
import { useSignIn } from "react-auth-kit";

const Login = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const auth = () => {
    navigate("/home");
  };
  const register = () => {
    navigate("/register");
  };
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [key, setKey] = useState("");

  if (success == true) {
    navigate("/home");
    localStorage.setItem("auth", key);
  }

  console.log(key);

  const [phoneNumber, setPhoneNumber] = useState("");

  const [password, setPassWords] = useState("");

  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState("");

  const [data, setData] = useState({
    phoneNumber: "",
    password: "",
  });

  const handleEmail = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handlePassword = (e) => {
    setPassWords(e.target.value);
  };

  const handleIn = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const log = (e) => {
    e.preventDefault();
    setIsLoading(true); // Show the loader
    axios
      .post(`${BASE_URL}/user/auth/login/user`, data)
      .then((response) => {
        if (response.status == 201) {
          const { jwtToken, id, phone, access_level, profile } = response.data;
          signIn({
            token: jwtToken,
            expiresIn: 3600,
            tokenType: "Bearer",
            authState: {
              id: id,
              phone: phone,
              access_level: access_level,
              profile: profile,
              jwtToken: jwtToken,
            },
          });

          setIsLoading(false); // Show the loader

          if (access_level === "admin") {
            navigate("/skipper"); // Redirect to "/skipper" for admin
          } else {
            navigate("/home"); // Redirect to "/home" for non-admin
          }
        }
      })
      .catch((error) => {
        let message = String(error.response.data.message);
        if (error.response.data.statusCode == 401) {
          toast.error(message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setIsLoading(false); // Show the loader
        } else if (error.response.data.statusCode == 400) {
          toast.error(message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setIsLoading(false); // Show the loader
        }
      });
  };

  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate() + 1).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  return (
    <>
      <div className="login-section">
        <ToastContainer />
        <div className="login-page">
          <div className="login-header">
            <div className="login-item">
              <img style={{ width: "20%" }} src={logo}></img>
            </div>
            <div className="login-item">
              <h5 style={{ marginTop: "20px", fontWeight: "bold" }}>
                Login Form
              </h5>
            </div>
            <form onSubmit={log} className="form-group">
              <div className="form-input">
                <input
                  type="phone"
                  name="phone"
                  value={data.email}
                  onChange={handleIn}
                  className=""
                  placeholder="phone number"
                />
              </div>
              <div className="form-input">
                <input
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={handleIn}
                  className=""
                  placeholder="Password"
                />
              </div>

              <div style={{ paddingBottom: "0px" }} className="form-input">
                {isLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      backgroundColor: "#00778b",
                      border: "solid #00778b 2px",
                      color: "white",
                      borderRadius: "5px",
                      height: "40px",
                    }}
                  >
                    <CircularProgress
                      size={20}
                      style={{ marginRight: "10px", color: "white" }}
                    />
                    <span>Please wait...</span>
                  </div>
                ) : (
                  <button type="submit">Sign In</button>
                )}
              </div>

              <div className="form-input-btn">
                <button onClick={register}>Create Account</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
