import "./datatable.scss";
import "./newDoctor.scss";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@material-ui/core/styles";
import { userColumns, locationColumns, userRows } from "../../datatablesource";
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

const LocationList = () => {
  const auth = useAuthUser();
  const classes = useStyles();
  const [user, setUser] = useState([]);
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
  const [isRegistering, setIsRegistering] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const sliderRef = useRef(null);
  const [locationName, setLocationName] = useState("");
  const [locationImages, setLocationImages] = useState([]);
  const [tempName, setTempName] = useState("");
  const [tempId, setTempId] = useState([]);
  const handleInputChange = (event) => {
    if (event.target.name === "locationName") {
      setLocationName(event.target.value);
    } else if (event.target.name === "locationImageOne") {
      const files = Array.from(event.target.files);
      setLocationImages(files);
    }
  };

  const CloudinaryCredentials = {
    cloudName: "ded6s1sof",
    uploadPreset: "pcq731ml",
    apiKey: "348193329193946",
    apiSecret: "lNTKKbJe9sf3AQb7sZqgftF9H5w",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsRegistering(true); // Start the registration process

    let combinedImageUrls = "ttftf";

    if (locationImages.length > 0) {
      // Upload images to Cloudinary
      const uploadPromises = locationImages.map((image) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", CloudinaryCredentials.uploadPreset);

        return axios.post(
          `https://api.cloudinary.com/v1_1/${CloudinaryCredentials.cloudName}/upload`,
          formData
        );
      });

      const cloudinaryResponses = await Promise.all(uploadPromises);

      // Get the image URLs from Cloudinary responses
      const imageUrls = cloudinaryResponses.map(
        (response) => response.data.secure_url
      );

      // Combine the image URLs into a comma-separated string
      combinedImageUrls = imageUrls.join(",");
    }

    // Create the location data object
    const locationData = {
      locationName,
      locationImage: combinedImageUrls,
    };

    try {
      // Submit location data to API endpoint only if images were uploaded
      await axios.put(`${BASE_URL}/location/${tempId}`, locationData, {
        headers: {
          Authorization: `Bearer ${auth().jwtToken}`,
        },
      });

      // Display success toast notification
      toast.success("Location was successfully updated", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Handle any additional logic after successful form submission
      // ...

      axios
        .get(`${BASE_URL}/location`, {
          headers: {
            Authorization: `Bearer ${auth().jwtToken}`,
          },
        })
        .then((response) => {
          setUser(response.data);
          setTempUsers(response.data);
          console.log(response.data);
        });

      setModalOpen(false); // Close the dialog modal
    } catch (error) {
      // Display error toast notification
      toast.error(`Location update failed, ${error}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    setIsRegistering(false); // Registration process completed
  };

  const previousImage = () => {
    sliderRef.current.slickPrev();
  };

  const nextImage = () => {
    sliderRef.current.slickNext();
  };

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
      setUser(filteredResult);
    }
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/location`, {
        headers: {
          Authorization: `Bearer ${auth().jwtToken}`,
        },
      })
      .then((response) => {
        setUser(response.data);
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
      width: 330,
      renderCell: (params) => {
        let status = "";
        if (params.row.status == 2) {
          status = "Activate Account";
        } else {
          status = "Disable Account";
        }
        return (
          <div className="cellAction">
            <div
              className="viewButton"
              onClick={() => {
                // openPop()
                setOpen(true);
                setRowValue(params.row);
                const imageUrls = params.row.locationImage
                  .split(",")
                  .map((url) => url.trim());
                setImages(imageUrls);
              }}
            >
              view Pictures
            </div>

            <div
              className="updateButton"
              onClick={() => {
                setTempId(params.row.id);
                setLocationName(params.row.locationName);
                setTempName(params.row.locationName);
                setLocationImages(params.row.locationImage);
                setModalOpen(true);
              }}
            >
              Update
            </div>

            <div
              className="deleteButton"
              onClick={() => {
                let url = `${BASE_URL}/location/${params.row.id}`;
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
                    toast.success("User was successfully deleted", {
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
                      .get(`${BASE_URL}/location`, {
                        headers: {
                          Authorization: `Bearer ${auth().jwtToken}`,
                        },
                      })
                      .then((response) => {
                        setUser(response.data);
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
            <h3>All Locations</h3>
          </div>

          <div className={classes.searchBox}>
            <form>
              <TextField
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                name="search"
                placeholder="Searching user"
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

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              marginLeft: "160px",
            }}
            className="btn-add"
          >
            <Link
              style={{ height: "50px" }}
              to="/location/new"
              className="link-add"
            >
              Add New
            </Link>
          </div>
        </div>
        <DataGrid
          style={{ width: "" }}
          className="datagrid"
          rows={
            search === ""
              ? user
              : user.filter((item) =>
                  item.locationName.toLowerCase().includes(search.toLowerCase())
                )
          }
          columns={locationColumns.concat(actionColumns)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      </div>

      <div>
        <Dialog
          style={{ width: "100%" }}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        >
          <DialogTitle> Update Location</DialogTitle>
          <DialogContent style={{ width: "100%" }}>
            <form
              style={{ width: "150%", marginLeft: "-150px", border: "" }}
              className="forms"
              onSubmit={handleSubmit}
            >
              <div className="section-1">
                <div>
                  <TextField
                    id="outlined-basic"
                    value={locationName}
                    onChange={handleInputChange}
                    className="input"
                    name="locationName"
                    type="text"
                    label="Location Name"
                    variant="outlined"
                  />
                </div>
                <div>
                  <label
                    style={{
                      marginLeft: "50px",
                      marginTop: "10px",
                      color: "black",
                      fontWeight: "bold",
                    }}
                    htmlFor="locationName"
                  >
                    Upload Location Images:
                  </label>
                  <TextField
                    id="outlined-basic"
                    onChange={handleInputChange}
                    className="input"
                    name="locationImageOne"
                    type="file"
                    accept="image/*"
                    variant="outlined"
                    inputProps={{
                      multiple: true,
                      accept: ".jpeg,.jpg,.png",
                    }}
                  />
                </div>
                <div className="submit" style={{ marginTop: "50px" }}>
                  <Button
                    id="send-btn"
                    type="submit"
                    disabled={isRegistering}
                    variant="contained"
                    color="primary"
                  >
                    {isRegistering ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Update"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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

export default LocationList;
