import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));


const New = ({ inputs, title }) => {
  
  const classes = useStyles();

  const navigate = useNavigate();

  const [depName, setDepName] = useState("");


  const handleChange = (event) => {
    const value = event.target.value;
    setDepName(value);
  };

console.log(depName)

  const createDepartment = (e) => {

    e.preventDefault();

    axios.post("https://hospital-appointment-com.herokuapp.com/api/v1/department/register", {name:depName})
      .then(res=>{
       var data=res.data;
       console.log(data)
       alert("new department was successfull added")
       setTimeout(()=>{
        navigate('/departments')
       },1000)    
      })
      .then(res => console.log(res))
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>add new department</h1>
         
        </div>
        <div className="bottom">
          <div className="left">

          </div>
          <div className="right" >
            <form onSubmit={createDepartment} className={classes.root} noValidate autoComplete="off">
            <TextField id="outlined-basic"
             label="department name" 
             variant="outlined" 
             type="text"
             name="depName"
             onChange={handleChange}
             />
             
              <button type="submit">Add</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
