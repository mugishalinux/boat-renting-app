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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@material-ui/core";
import AdminSidebar from "../../components/sidebar/AdminSidebar";

import SkipperSidebar from "../../components/sidebar/SkipperSidebar";

const New = () => {
  const auth = useAuthUser();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);

  const [isActive, setIsActive] = useState(false);

  const [message, setMessage] = useState();

  const [locationName, setLocationName] = useState("");
  const [locationImageOne, setLocationImageOne] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        // Fetch user information using auth()
        const userInformation = await auth();

        // Set the user object in component state
        setUser(userInformation);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch user information:", error);
        setIsLoading(false); // Set
      }
    };
    fetchUserInformation();
  }, []);
  const CloudinaryCredentials = {
    cloudName: "ded6s1sof",
    uploadPreset: "pcq731ml",
    apiKey: "348193329193946",
    apiSecret: "lNTKKbJe9sf3AQb7sZqgftF9H5w",
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/department").then((response) => {
      setDepartments(response.data);
      console.log(response.data);
    });
  }, []);

  // const [location, setLocation] = useState({
  //   locationName: "",
  //   locationImageOne: "",
  //   locationImageTwo: "",
  //   locationImageThree: "",
  // });

  const [location, setLocation] = useState({
    locationName: "",
    locationImageOne: "",
  });

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

  const handleInputChange = (event) => {
    if (event.target.name === "locationName") {
      setLocationName(event.target.value);
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

    // Create the location data object
    const locationData = {
      locationName,
      locationImage: combinedImageUrls,
    };

    try {
      // Submit location data to API endpoint
      await axios.post(`${BASE_URL}/location/creation`, locationData, {
        headers: {
          Authorization: `Bearer ${auth().jwtToken}`,
        },
      });

      // Clear the form after submission
      setLocationName("");
      setLocationImages([]);

      // Display success toast notification
      toast.success("Location was successfully created", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/location");

      // Handle any additional logic after successful form submission
      // ...
    } catch (error) {
      // Display error toast notification
      toast.error(`Location failed, ${error}`, {
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
      <ToastContainer />
      {user && user.access_level == "admin" ? (
        <AdminSidebar />
      ) : (
        <SkipperSidebar />
      )}
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add Location</h1>
        </div>

        <form className="forms" onSubmit={handleSubmit}>
          <div className="section-1">
            <div>
              <TextField
                id="outlined-basic"
                value={locationName}
                onChange={handleInputChange}
                className="input"
                name="locationName"
                type="text"
                required
                label="Location Name"
                variant="outlined"
              />
            </div>
            <div>
              <label
                style={{
                  marginLeft: "50px;",
                  marginTop: "10px",
                  color: "black",
                  fontWeigth: "bold",
                }}
                htmlFor="locationName"
              >
                Upload Location Images :
              </label>
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
            <div className="submit" style={{ marginTop: "50px" }}>
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
