import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@material-ui/core/styles";
import { scheduleColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Loading } from "../../pages/Loading/Loading";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

const TripList = () => {
  const classes = useStyles();
  const [departments, setDepartments] = useState([]);
  const [trip, setTrip] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [search, setSearch] = useState("");
  const [depName, setDepName] = useState("");
  const [scheduleName, setScheduleName] = useState("");
  const [rowValue, setRowValue] = useState({});
  const [requestLoad, setRequestLoad] = useState(false);
  const [requestDialog, setRequestDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/schedules").then((response) => {
      setSchedule(response.data);
      console.log(response.data);
    });
  }, []);

  const updateSchedule = (id) => {
    axios
      .put(`http://localhost:8000/schedules/${id}`, {
        schedule_time: scheduleName,
      })
      .then((res) => {
        setRequestDialog(false);
        toast.success("Schedule have been successfull updated..", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        axios.get("http://localhost:8000/schedules").then((response) => {
          setSchedule(response.data);
        });
      });
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setScheduleName(value);
  };

  const deleteSchedule = (id) => {
    axios.delete(`http://localhost:8000/schedules/${id}`).then((res) => {
      toast.success("Schedule have been successfull Deleted..", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      axios.get("http://localhost:8000/schedules").then((response) => {
        setSchedule(response.data);
      });
    });
  };

  const [data, setData] = useState(userRows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              {/* <div className="viewButton">View</div> */}
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  const actionColumns = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => {
                // openPop()
                setRequestDialog(true);
                setRowValue(params.row);
                setDepName(params.row.name);
              }}
            >
              Update
            </div>
            <div
              className="viewButton"
              onClick={() => {
                deleteSchedule(params.row.id);
              }}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="datatable">
        <div className="upper-section-trip">
          <div className="title">
            <h3>List of schedules</h3>
          </div>
          <div className="search">
            <form>
              <input
                type="text"
                onChange={
                  (e) => setSearch(e.target.value)
                  // console.log(e)
                }
                name="search"
                placeholder="searching place"
              />
            </form>
          </div>
          <div className="btn-add">
            <Link
              style={{ marginTop: 40 }}
              to="/schedule/new"
              className="link-add"
            >
              Add New
            </Link>
          </div>
        </div>
        <DataGrid
          className="datagrid"
          rows={schedule.filter((item) => {
            return search.toLocaleLowerCase() === ""
              ? item
              : item.schedule_time.toLocaleLowerCase().includes(search); 
          })}
          columns={scheduleColumns.concat(actionColumns)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      </div>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={requestDialog}
        onClose={() => {
          setRequestDialog(false);
        }}
        aria-labelledby="request appointment"
        aria-describedby="request appointment"
      >
        <DialogTitle style={{ color: "red" }}>Update Schedule</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box>
              <Box
                display="flex"
                style={{ marginTop: 6 }}
                alignItems="center"
                justifyContent="center"
              >
                <div className="bottom">
                  <div className="left"></div>
                  <div className="right">
                    <form
                      className={classes.root}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        id="outlined-basic"
                        label="schedule time"
                        value={scheduleName}
                        variant="outlined"
                        type="text"
                        name="scheduleName"
                        onChange={handleChange}
                      />
                    </form>
                  </div>
                </div>
              </Box>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            className={classes.button}
            onClick={() => {
              setRequestDialog(false);
            }}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            autoFocus
            className={classes.button}
            disableElevation
            variant="contained"
            color="primary"
            onClick={() => {
              updateSchedule(rowValue.id);
            }}
          >
            {requestLoad ? (
              <CircularProgress color="secondary" size={25} />
            ) : (
              "Update Schedule"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TripList;
