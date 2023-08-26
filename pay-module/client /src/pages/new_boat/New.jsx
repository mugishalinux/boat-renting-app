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
import { BASE_URL } from "../../config/baseUrl";
import { ToastContainer, toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@material-ui/core";
import SkipperSidebar from "../../components/sidebar/SkipperSidebar";

const New = () => {
  const auth = useAuthUser();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);

  const [isActive, setIsActive] = useState(false);

  const [message, setMessage] = useState();
  const [age, setAge] = useState("");
  const [locationName, setLocationName] = useState("");
  const [boatPrice, setBoatPrice] = useState();
  const [boatMaxPeople, setBoatMaxPeople] = useState();
  const [locationImageOne, setLocationImageOne] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);
  const [locationId, setLocationId] = useState("");
  const [location, setLocation] = useState([]);
  const CloudinaryCredentials = {
    cloudName: "ded6s1sof",
    uploadPreset: "pcq731ml",
    apiKey: "348193329193946",
    apiSecret: "lNTKKbJe9sf3AQb7sZqgftF9H5w",
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/location`, {
        headers: {
          Authorization: `Bearer ${auth().jwtToken}`,
        },
      })
      .then((response) => {
        setLocation(response.data);

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
  const [locationImages, setLocationImages] = useState([]);

  const [dep, setDep] = useState([]);

  const openSnackBar = (msg = "Something went wrong...") => {
    setMessage(msg);
    setIsActive(true);
  };

  const handleInputChange = (event) => {
    if (event.target.name === "locationName") {
      setLocationName(event.target.value);
    } else if (event.target.name === "locationId") {
      setLocationId(event.target.value);
    } else if (event.target.name === "boatPrice") {
      setBoatPrice(event.target.value);
    } else if (event.target.name === "boatMaxPeople") {
      setBoatMaxPeople(event.target.value);
    } else if (event.target.name === "locationImageOne") {
      const files = Array.from(event.target.files);
      setLocationImages(files);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsRegistering(true); // Start the registration process

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
    const combinedImageUrls = imageUrls.join(",");

    // Create the boat data object
    const boatData = {
      user: auth().id,
      location: locationId,
      maxNumber: boatMaxPeople,
      price: boatPrice,
      boatImages: combinedImageUrls,
    };

    try {
      // Submit location data to API endpoint
      await axios.post(`${BASE_URL}/boat/creation`, boatData, {
        headers: {
          Authorization: `Bearer ${auth().jwtToken}`,
        },
      });

      // Clear the form after submission
      setLocationName("");
      setLocationImages([]);

      // Display success toast notification
      toast.success("Boat was successfully created", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/boat");

      // Handle any additional logic after successful form submission
      // ...
    } catch (error) {
      // Display error toast notification
      let message = String(error.response?.data?.message || error.message);
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
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

  return (
    <div className="new">
      <ToastContainer />
      <SkipperSidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Boat</h1>
        </div>

        <form className="forms" onSubmit={handleSubmit}>
          <div className="section-1">
            <div>
              <FormControl style={{ marginLeft: "10px" }} fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select Location
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={handleInputChange}
                  value={locationId}
                  name="locationId"
                  variant="outlined"
                  required
                  label=" Select Location"
                  // onChange={handleChange}
                >
                  {location.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.locationName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div>
              <TextField
                id="outlined-basic"
                value={boatPrice}
                onChange={handleInputChange}
                className="input"
                name="boatPrice"
                type="number"
                required
                label="Boat Price"
                variant="outlined"
              />
            </div>
          </div>

          <div className="section-2">
            <div>
              <TextField
                id="outlined-basic"
                value={boatMaxPeople}
                onChange={handleInputChange}
                className="input"
                name="boatMaxPeople"
                type="number"
                required
                label="Boat Max Capacity"
                variant="outlined"
              />
            </div>
            <div>
              <TextField
                id="outlined-basic"
                onChange={handleInputChange}
                className="input"
                name="locationImageOne"
                type="file"
                accept="image/*"
                required
                variant="outlined"
                inputProps={{
                  multiple: true,
                  multiple: true,
                  accept: ".jpeg,.jpg,.png",
                }}
              />
            </div>
            <div className="submit" style={{ marginTop: "0px" }}>
              <button id="send-btn" type="submit" disabled={isRegistering}>
                {isRegistering ? (
                  <CircularProgress size={20} color="white" />
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default New;
