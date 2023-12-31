import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@material-ui/core/styles";
import {
  userColumns,
  bookingColumns,
  paymentColumn,
  depColumns,
  userRows,
} from "../../datatablesource";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loading } from "../../pages/Loading/Loading";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItem";
import { BASE_URL } from "../../config/baseUrl";
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
import { useAuthUser } from "react-auth-kit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import the autoTable plugin

const useStyles = makeStyles((theme) => ({
  header: {
    height: "70px",
  },
  searchBox: {
    "& .MuiOutlinedInput-root": {
      border: "solid 1px gray",
      borderRadius: 5,
      height: 55,
      width: 600,
    },
  },
  menuItem: {
    borderBottom: `1px solid white`,
    backgroundColor: "white",
    "&:last-child": {
      borderBottom: `1px solid white`,
      backgroundColor: "white",
    },
    "&:first-child": {
      borderBottom: `1px solid white`,
      backgroundColor: "white",
    },
  },
  selectBox: {
    width: "200px",
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

const BookingList = () => {
  const auth = useAuthUser();
  const classes = useStyles();
  const [user, setUser] = useState([]);
  const [booking, setPayment] = useState([]);
  const [payment, setBooking] = useState([]);
  const [tempUsers, setTempUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [depName, setDepName] = useState("");
  const [rowValue, setRowValue] = useState({});
  const [requestLoad, setRequestLoad] = useState(false);
  const [requestDialog, setRequestDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [search, setSearch] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedRole, setSelectedRole] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(user);
  const [pageSize, setPageSize] = useState(100);

  const handleExportToPDF = () => {
    const doc = new jsPDF();

    const columns = bookingColumns.map((column) => column.headerName);

    // Prepare the rows for the PDF table
    const rows = payment.map((item) => {
      const rowData = [];
      columns.forEach((column) => {
        let value = "";

        if (column === "Id") {
          value = item.id || ""; // Access the nested property directly
        } else if (column === "Booking Ref") {
          value = item.bookingRef || ""; // Access the nested property directly
        } else if (column === "Booking Date") {
          const readableDate = new Date(item.bookingDate).toLocaleDateString();
          value = readableDate || ""; // Access the nested property directly
        } else if (column === "From") {
          value = item.bookingFrom || ""; // Access the nested property directly
        } else if (column === "To") {
          value = item.bookingTo || ""; // Access the nested property directly
        } else if (column === "names") {
          value = item.names || ""; // Access the nested property directly
        } else if (column === "Phone Number") {
          value = item.phoneNumber || ""; // Access the nested property directly
        } else if (column === "Payment Status") {
          value = item.paymentStatus || ""; // Access the nested property directly
        } else {
          const field = bookingColumns.find(
            (col) => col.headerName === column
          )?.field;
          if (field) {
            value = item[field] || "";
          }
        }
        rowData.push(value);
      });
      return rowData;
    });

    // Add a title
    doc.text("List Of All Bookings", 105, 10, { align: "center" });

    // Add the table using autoTable
    doc.autoTable({
      head: [columns],
      body: rows,
    });

    // Save the PDF
    doc.save("booking_report_list.pdf");
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
  };
  const sliderRef = useRef(null);

  const previousImage = () => {
    sliderRef.current.slickPrev();
  };

  const nextImage = () => {
    sliderRef.current.slickNext();
  };

  const pageSizeOptions = [10, 25, 50, 100];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_, next) => setCurrentImage(next),
  };

  const handleRoleSelect = (event) => {
    const role = event.target.value;
    setSelectedRole(role);

    if (role === "") {
      setFilteredUsers(user);
    } else {
      const filteredResult = tempUsers.filter(
        (user) => user.access_level === role
      );
      setBooking(filteredResult);
    }
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/booking/`, {
        headers: {
          Authorization: `Bearer ${auth().jwtToken}`,
        },
      })
      .then((response) => {
        setBooking(response.data);
        setTempUsers(response.data);
        console.log(response.data);
      });
  }, []);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    // setRowValue({...rowValue, [rowValue.name]:value});
    setDepName(value);
    // console.log(depName)
  };

  const [data, setData] = useState(userRows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const [searchText, setSearchText] = useState("");
  const [filteredUser, setFilteredUser] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    // Filter the user based on the search text
    const filteredData = user.filter((item) => {
      // Check if any column value includes the search text
      return Object.values(item).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(value.toLowerCase())
      );
    });

    setFilteredUser(filteredData);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setFilteredUser(user);
  };

  const columns = [
    // Define your columns here
    // Modify or replace these with your actual columns
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    // Add more columns as needed
  ];

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
      width: 100,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => {
                let url = `${BASE_URL}/payment/${params.row.id}`;
                fetch(url, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth().jwtToken}`,
                  },
                  body: JSON.stringify({
                    id: params.row.id,
                  }),
                })
                  .then((response) => {
                    response.json();
                    toast.success("Payment was successfully deleted", {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                    axios
                      .get(`${BASE_URL}/booking`, {
                        headers: {
                          Authorization: `Bearer ${auth().jwtToken}`,
                        },
                      })
                      .then((response) => {
                        setBooking(response.data);
                        console.log(response.data);
                      });
                  })

                  .then((data) => {
                    // Handle response data here
                    console.log(data);
                  })
                  .catch((error) => {
                    let message = String(
                      error.response?.data?.message || error.message
                    );
                    // Handle error here
                    console.error(error);
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
        <ToastContainer />
        <div style={{ marginBottom: "30px" }} className="upper-section-trip">
          <div className="title">
            <h3>Bookings</h3>
          </div>

          <div className={classes.searchBox}>
            <form>
              <TextField
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                name="search"
                placeholder="Searching payment"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </div>
          <div>
            <button
              onClick={handleExportToPDF}
              style={{
                padding: "13px",
                width: "150px",
                borderRadius: "7px",
                marginLeft: "50px",
                backgroundColor: "#09143c",
                color: "white",
                border: "solid 1px #09143c",
              }}
            >
              Download Report
            </button>
          </div>
        </div>
        <DataGrid
          style={{ width: "85%", margin: "0 auto" }}
          className="datagrid"
          rows={
            search === ""
              ? payment
              : payment.filter((item) =>
                  [
                    item.amount,
                    item.iniPaymentRef,
                    item.extPaymentRef,
                    item.accountNumber,
                    item.created_by,
                  ].some((value) => String(value).includes(search))
                )
          }
          columns={bookingColumns.concat(actionColumns)}
          pageSize={100}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      </div>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>Documents</DialogTitle>
        <DialogContent>
          <Slider {...settings} ref={sliderRef} initialSlide={currentImage}>
            {images.map((image, index) => (
              <Grid container justifyContent="center" key={index}>
                <Grid item>
                  <img
                    src={image}
                    alt={`Image ${index}`}
                    style={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
            ))}
          </Slider>
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "16px",
          }}
        >
          <IconButton
            aria-label="previous"
            onClick={previousImage}
            style={{
              color: "#333",
              padding: "8px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            aria-label="next"
            onClick={nextImage}
            style={{
              color: "#333",
              padding: "8px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BookingList;
