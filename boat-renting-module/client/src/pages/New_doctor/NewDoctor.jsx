import "./newDoctor.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { FortTwoTone } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";

const NewDoctor = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);

  const [isActive, setIsActive] = useState(false);

  const [message, setMessage] = useState();

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/department").then((response) => {
      setDepartments(response.data);
      console.log(response.data);
    });
  }, []);

  const [doctor, setDoctor] = useState({
    lastName: "",
    firstName: "",
    departmentName: "",
    gender: "",
    email: "",
    phoneNumber: "",
    age: "",
    startingHour: "",
    endingHour: "",
  });

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setDoctor({
      ...doctor,
      [name]: value,
    });
    console.log(doctor);
  };

  const [dep, setDep] = useState([]);

  // useEffect(()=>{
  //     axios.post(`http://localhost:8080/api/v1/apt/${doctorId}`, { })
  //     .then(()=> {

  //     })
  //   setDep(response.data);
  //   console.log(response.data);

  // }, [])

  const openSnackBar = (msg = "Something went wrong...") => {
    setMessage(msg);
    setIsActive(true);
  };

  const createDoctor = (e) => {
    e.preventDefault();

    axios
      .post(
        `http://localhost:8080/api/v1/doctor/register/dept/${doctor.departmentName}`,
        {
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          gender: doctor.gender,
          age: doctor.age,
          phoneNumber: doctor.phoneNumber,
          email: doctor.email,
          startHour: doctor.startingHour,
          endHour: doctor.endingHour,
          profilePic: "",
        }
      )
      .then((res) => {
        var data = res.data;
        console.log(data);
        alert("doctor have been successful created");
        setTimeout(() => {
          navigate("/doctor");
        }, 1000);
      })
      .then((res) => console.log(res));
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Doctor</h1>
        </div>

        <form className="forms" onSubmit={createDoctor}>
          <div className="section-1">
            <div>
              <TextField
                id="outlined-basic"
                value={doctor.firstName}
                onChange={handleChanges}
                className="input"
                name="firstName"
                type="text"
                required
                label="First Name"
                variant="outlined"
              />
            </div>
            <div>
              <TextField
                id="outlined-basic"
                value={doctor.lastName}
                onChange={handleChanges}
                className="input"
                name="lastName"
                type="text"
                required
                label="Last Name"
                variant="outlined"
              />
            </div>
            <TextField
              id="outlined-basic"
              value={doctor.email}
              onChange={handleChanges}
              className="input"
              name="email"
              type="email"
              required
              label="Email"
              variant="outlined"
            />
            <div>
              <TextField
                id="outlined-basic"
                value={doctor.phoneNumber}
                onChange={handleChanges}
                className="input"
                name="phoneNumber"
                type="phone"
                required
                label="Phone Number"
                variant="outlined"
              />
            </div>
            <div>
              <TextField
                id="outlined-basic"
                value={doctor.age}
                onChange={handleChanges}
                className="input"
                name="age"
                type="number"
                required
                label="Age"
                variant="outlined"
              />
            </div>
          </div>
          <div className="section-2">
            <div>
              <TextField
                id="outlined-select-currency"
                select
                onChange={handleChanges}
                name="departmentName"
                value={doctor.departmentName}
                label="Select Department"
                className="input"
                style={{
                  width: "100%",
                  marginTop: "10px",
                  marginButton: "5px",
                }}
              >
                {departments.map((option) => (
                  <MenuItem key={option.value} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div>
              <TextField
                id="outlined-select-currency"
                value={doctor.gender}
                name="gender"
                onChange={handleChanges}
                select
                label="Select Gender"
                style={{
                  width: "100%",
                  marginTop: "10px",
                  marginButton: "5px",
                }}
                className="input"
              >
                <MenuItem value="male">male</MenuItem>
                <MenuItem value="female">female</MenuItem>
              </TextField>
            </div>
            <TextField
              id="outlined-basic"
              value={doctor.startingHour}
              onChange={handleChanges}
              name="startingHour"
              type="number"
              className="input"
              required
              label="Starting Hour"
              variant="outlined"
            />
            <div>
              <TextField
                id="outlined-basic"
                value={doctor.endingHour}
                onChange={handleChanges}
                name="endingHour"
                type="number"
                className="input"
                required
                label="Ending Hour"
                variant="outlined"
              />
            </div>
            <div className="submit" style={{ marginTop: "50px;" }}>
              <button id="send-btn" typp="submit" type="submit">
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDoctor;
