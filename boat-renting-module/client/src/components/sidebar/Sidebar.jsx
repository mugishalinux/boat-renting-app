import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useSignOut } from "react-auth-kit";
import { useContext } from "react";

const Sidebar = () => {
  const signOut = useSignOut();
  const { dispatch } = useContext(DarkModeContext);
  const handleLogout = () => {
    signOut();
  };
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="home" style={{ textDecoration: "none" }}>
          <span className="logo">Boat Booking Portal</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/home" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <p className="title">LISTS</p>

          <Link to="/trip" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Destionations</span>
            </li>
          </Link>

          <Link to="/schedule" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Schedules</span>
            </li>
          </Link>

          <Link to="/bookings" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Bookings</span>
            </li>
          </Link>

          <Link
            to="/"
            onClick={handleLogout}
            style={{ textDecoration: "none" }}
          >
            <li>
              <ExitToAppIcon className="icon" />
              <span>Logout</span>
            </li>
          </Link>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
