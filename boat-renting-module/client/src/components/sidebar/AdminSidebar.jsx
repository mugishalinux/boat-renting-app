import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useSignOut } from "react-auth-kit";
import { useContext } from "react";

const AdminSidebar = () => {
  const signOut = useSignOut();
  const { dispatch } = useContext(DarkModeContext);
  const handleLogout = () => {
    signOut();
  };
  return (
    <div className="sidebar">
      <div className="top">
        <div style={{ textDecoration: "none" }}>
          <span className="logo">Admin Portal</span>
        </div>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <p className="title">LISTS</p>

          <Link to="/skipper" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>User</span>
            </li>
          </Link>

          <Link to="/location" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Locations</span>
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

export default AdminSidebar;
