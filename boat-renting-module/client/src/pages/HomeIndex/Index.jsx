import React, { useState, useEffect } from "react";
import appointment from "./appointment.jpg";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Audio } from "react-loader-spinner";
import {
  Box,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Chip,
  Divider,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import Format from "date-fns/format";
import { Close, Today, DateRange } from "@material-ui/icons";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  header: {
    height: "70px",
  },
  middle: {
    height: "350px",
    backgroundColor: "#007ACC",
  },
  formControl: {
    backgroundColor: "#fff",
    // width:250,
    marginTop: 50,
    borderRadius: 5,
    textTransform: "capitalize",
  },
  container: {
    marginTop: 80,
  },
  title: {
    marginTop: 50,
    color: "#fff",
  },
  footer: {
    height: "50px",
    backgroundColor: "#535A6B",
  },
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    textTransform: "capitalize",
  },
}));

function Index(props) {
  const navigate = useNavigate();

  const classes = useStyles();

  useEffect(() => {
    get_doctors();
  }, []);

  useEffect(() => {
    get_schedules();
  }, []);

  useEffect(() => {
    get_trips();
  }, []);

  //get schedules
  const [schedules, setSchedules] = useState([]);

  const get_schedules = () => {
    axios
      .get("http://localhost:8000/schedules")

      .then((res) => {
        console.log(res.data);
        setSchedules(res.data);
      })
      .catch((err) => {
        var e = err.message;
        if (err.response) {
          e = err.response.data.message;
        }
      });
  };

  //getting all trips

  const [trips, setTrips] = useState([]);
  const get_trips = () => {
    axios
      .get("http://localhost:8000/trip")

      .then((res) => {
        console.log(res.data);
        setTrips(res.data);
      })
      .catch((err) => {
        var e = err.message;
        if (err.response) {
          e = err.response.data.message;
        }
      });
  };

  // get list of doctors

  const [doctors, setDoctors] = useState([]);
  const get_doctors = () => {
    axios
      .get("http://localhost:8080/api/v1/doctor")

      .then((res) => {
        console.log(res.data);
        setDoctors(res.data);
      })
      .catch((err) => {
        var e = err.message;
        if (err.response) {
          e = err.response.data.message;
        }
      });
  };

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    trip: "",
    schedule: "",
  });

  const handleFirstChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  // get doctor appointment schedule

  //   const [body , setBody] = useState({
  //     "patientName":"mugisha",
  //     "patientEmail":"mugi@gmail.com",
  //     "patientSicknessDetail":"munda",
  //      "appointmentDate":"2022-05-29",
  //     "appointmentHour":"14",
  // })

  // disable previous dates

  const [appointmentDate, setAppointmentDate] = useState({
    value: Format(new Date(), ["yyyy-MM-dd"]),
    error: "",
  });
  const [doctorId, setDoctorId] = useState({ value: 0, error: "" });

  const [destinationId, setDestinationId] = useState({ value: 0, error: "" });

  const [appointmentLoad, setAppointmentLoad] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const get_appointment = () => {
    const data = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      trip: parseInt(formValues.trip),
      schedule: parseInt(formValues.schedule),
    };
    axios
      .post("http://localhost:8000/booking/create", data)
      .then((response) => {
        if (response.status == 201) {
          toast.success("Thank your booking was successfully done!!", {
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
            window.location.reload(true);
          }, 5000);
        }
      })

      .catch((error) => {
        let message = String(error.response.data.message);
        toast.error("Booking failed!!!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
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
      });
  };
  const notify = () => toast("Wow so easy!");

  // request doctor appointment
  const [requestDialog, setRequestDialog] = useState(false);
  const [firstName, setFirstName] = useState({ value: "", error: "" });
  const [lastName, setLastName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [sickness, setSickness] = useState({ value: "", error: "" });
  const [requestLoad, setRequestLoad] = useState(false);
  const [appointmentHour, setAppointmentHour] = useState(0);
  const request_appointment = () => {
    if (firstName.value == "") {
      setFirstName({ value: "", error: "Please enter your first name" });
    } else if (lastName.value == "") {
      setLastName({ value: "", error: "Please enter your last name" });
    } else if (email.value == "") {
      setEmail({ value: "", error: "Please enter your email" });
    } else if (sickness.value == "") {
      setSickness({ value: "", error: "Please briefly explain your sickness" });
    } else {
      setRequestLoad(true);
      var requestBody = {
        patientName: firstName.value + " " + lastName.value,
        patientEmail: email.value,
        patientSicknessDetail: sickness.value,
        appointmentHour: appointmentHour,
        appointmentDate: appointmentDate.value,
      };
      // axios.get((`http://localhost:8080/api/v1/apt/${doctorId}`), requestBody)

      axios
        .post(`https://localhost:8080.com/api/v1/apt/${doctorId}`, {
          patientName: firstName.value + " " + lastName.value,
          patientEmail: email.value,
          patientSicknessDetail: sickness.value,
          appointmentHour: parseInt(appointmentHour),
          appointmentDate: appointmentDate.value,
        })

        .then((res) => {
          var message = "appointment successful booked";
          alert(message);
          setTimeout(() => {
            window.location.reload(true);
          }, 1000);
          setRequestLoad(false);
          setRequestDialog(false);

          setFirstName({ value: "", error: "" });
          setLastName({ value: "", error: "" });
          setEmail({ value: "", error: "" });
          setSickness({ value: "", error: "" });
        })
        .catch((err) => {
          setRequestLoad(false);
          var e = err.message;
          if (err.response) {
            e = err.response.data;
          }
        });
    }
  };
  const login = () => {
    navigate("/login");
  };

  const token = localStorage.getItem("token");

  return (
    <div>
      <section class="home-banner">
        <div
          style={{
            marginTop: "300px",
            marginLeft: "560px",
            position: "absolute",
            width: "20%",
          }}
        >
          {/* <Audio
            height="80"
            marginTop="300"
            width="830"
            radius="9"
            color="green"
            ariaLabel="mutating-dots-loading"
            wrapperStyle
            wrapperClass
          /> */}
        </div>
        <div class="home-banner-child">
          <div class="overlay"></div>
          <div class="container">
            <div class="row slider-text align-items-end">
              <div class="col-md-7 col-sm-12 ftco-animate mb-5 title">
                <h1 class="mb-3">
                  Our friendly, qualified staff put their patients at the heart
                  of everything they do.
                </h1>
              </div>
              <div className="login-admin">
                <button
                  style={{ width: "150px;", padding: "10px;" }}
                  onClick={login}
                >
                  Browse admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="ftco-intro " style={{ marginTop: "-300px" }}>
        <div class="container">
          <form onSubmit={handleSubmit} action="#" class="appointment-form">
            <div class="row no-gutters">
              <div class="col-md-3 color-1 p-4">
                <h3 class="mb-4">Personal Details</h3>
                <div className="form-inside">
                  <div className="inputs">
                    <input
                      id="all"
                      onChange={handleFirstChange}
                      type="text"
                      name="firstName"
                      placeholder="first name"
                      className="input-form"
                    ></input>
                    <input
                      style={{ marginTop: 10 }}
                      onChange={handleFirstChange}
                      id="all"
                      type="text"
                      name="lastName"
                      placeholder="last name"
                      className="input-form"
                    ></input>
                  </div>
                </div>
              </div>

              <div class="col-md-3 color-2 p-4">
                <h3 class="mb-4">Contact Info</h3>
                <div className="form-inside">
                  <div className="inputs">
                    <input
                      style={{ marginTop: 10 }}
                      id="all"
                      type="email"
                      placeholder="email"
                      name="email"
                      className="input-form"
                      onChange={handleFirstChange}
                      required
                    ></input>
                  </div>
                  <ToastContainer />
                </div>
              </div>

              <div class="col-md-6 color-3 p-4">
                <h3 class="mb-2">Make an Appointment</h3>
                <div class="row">
                  <div class="col-sm-4">
                    <div class="form-group">
                      <div class="select-wrap">
                        <div class="icon">
                          <span class="ion-ios-arrow-down"></span>
                        </div>
                        <label>
                          <small style={{ fontSize: 13 }}>
                            Select Destination
                          </small>
                        </label>
                        <select
                          style={{ backgroundColor: "black" }}
                          labelId="trip"
                          className="form-control"
                          id="trip"
                          required
                          name="trip"
                          onChange={handleFirstChange}
                        >
                          {trips.map((option) => (
                            <option
                              style={{ backgroundColor: "black" }}
                              value={option.id}
                            >
                              {option.tripName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="col-sm-4">
                    <div class="form-group">
                      <div class="icon">
                        <span class="ion-ios-calendar"></span>
                      </div>
                      <label>
                        <small style={{ fontSize: 13 }}>Select Time</small>
                      </label>
                      <select
                        style={{ backgroundColor: "black" }}
                        labelId="schedule"
                        className="form-control"
                        id="schedule"
                        required
                        name="schedule"
                        onChange={handleFirstChange}
                      >
                        {schedules.map((option) => (
                          <option
                            style={{ backgroundColor: "black" }}
                            value={option.id}
                          >
                            {option.schedule_time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-sm-4">
                    <div class="form-group">
                      <button
                        className="btn btn-primary"
                        style={{
                          backgroundColor: "#00e600",
                          marginTop: "10px",
                          color: "white",
                          width: "160px",
                          borderRadius: "5px",
                        }}
                        disableElevation
                        variant="contained"
                        disabled={appointmentLoad}
                        startIcon={<Today />}
                        onClick={() => {
                          get_appointment();
                        }}
                      >
                        {appointmentLoad ? (
                          <CircularProgress size={25} />
                        ) : (
                          "check availability"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Index;
