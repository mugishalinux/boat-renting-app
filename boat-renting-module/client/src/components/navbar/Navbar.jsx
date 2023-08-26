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

const Navbar = ({ imageUrl }) => {
  const { dispatch } = useContext(DarkModeContext);

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
        </div>
      </div>
    </div>
  );
};

export default Navbar;
