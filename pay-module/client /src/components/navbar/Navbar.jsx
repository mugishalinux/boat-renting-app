import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";

const Navbar = ({ imageUrl }) => {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const { dispatch } = useContext(DarkModeContext);
  const handleLogout = () => {
    signOut();
    navigate("/");
  };
  return (
    <div className="navbar">
      <div style={{ display: "flex" }} className="wrapper">
        <div style={{ marginLeft: "850px" }} className="items">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>
          <div className="item">
            <FullscreenExitOutlinedIcon className="icon" />
          </div>

          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <img src={imageUrl} alt="" className="avatar" />
          </div>
          <button
            onClick={handleLogout}
            style={{ backgroundColor: "black", color: "white", padding: "5px" }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
