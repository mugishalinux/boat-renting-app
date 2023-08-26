import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const New = ({ inputs, title }) => {
  const classes = useStyles();

  const navigate = useNavigate();

  const [depName, setDepName] = useState("");
  const [tripName, setTripName] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setTripName(value);
  };

  const createDestination = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8000/trip", { tripName: tripName })
      .then((res) => {
        var data = res.data;
        console.log(data);
        toast.success('new destionation was successfull added', {
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
          navigate("/trip");
        }, 5000);
      })
      .then((res) => console.log(res));
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>add new destination</h1>
          <ToastContainer />
        </div>
        <div className="bottom">
          <div className="left"></div>
          <div className="right">
            <form
              onSubmit={createDestination}
              className={classes.root}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Destination name"
                variant="outlined"
                type="text"
                name="tripName"
                onChange={handleChange}
              />

              <button type="submit">Add</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
