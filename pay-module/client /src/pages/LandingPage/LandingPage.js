import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import "./design.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation
import { BASE_URL } from "../../config/baseUrl";

import { Card, CardContent, CardActionArea, Modal, Grid } from "@mui/material";

const drawerWidth = 240;
const navItems = ["Home", "Claiming", "Admin Login"];

const LandingPage = (props) => {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuthUser();
  const navigate = useNavigate();
  const [selectedClaim, setSelectedClaim] = useState(null);
  const openModal = (claim) => {
    setSelectedClaim(claim);
  };

  const closeModal = () => {
    setSelectedClaim(null);
  };
  const handleReportClaim = () => {
    navigate("/claimForm");
  };
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        setIsLoading(true);
        //fetch christians users
        const fetchClaiming = await axios.get(`${BASE_URL}/public`);
        setClaims(fetchClaiming.data);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch user information:", error);
        setIsLoading(false);
      }
    };

    fetchUserInformation();
  }, []);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />

      <List>
        <ListItem component={Link} to="/login">
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <div className="list">
        <AppBar component="nav" sx={{ background: "transparent" }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              BLUE BANK
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Button
                onClick={() => {
                  navigate("/login");
                }}
                key={3}
                sx={{ color: "#fff" }}
              >
                Login
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <div
          className="listContainer"
          style={{
            position: "relative",
            width: "100%",
            height: "100vh",
            backgroundColor: "back",
            //   backgroundImage: `url("./banner.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "#1e0979",
              opacity: 0.7,
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "100px",
              transform: "translateY(-50%)",
              color: "#fff",
            }}
          >
            <h1 style={{ width: "800px", color: "white", fontWeight: "900	" }}>
              BANKING GLOBAL APP
            </h1>
            <p
              style={{
                color: "white",
                width: "1000px",
                textTransform: "lowercase",
              }}
            >
              Welcome to BANKING GLOBAL APP, your trusted financial partner.
              With MyApp Banking, managing your finances is easy, secure, and
              convenient. Whether you need to check your account balance, pay
              bills, transfer funds, or apply for loans, we've got you covered.
            </p>
            <button
              onClick={() => {
                navigate("/register");
              }}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "white",
                fontWeight: "bold",
                color: "#1e0979",
                border: "none",
                cursor: "pointer",
              }}
            >
              CREATE ACCOUNT
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
