import "./DatatableDoctor.scss";
import { DataGrid } from "@mui/x-data-grid";
import { doctorColumns } from "./datatablesource";
import { Link } from "react-router-dom";
import { useState , useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {Loading} from '../../pages/Loading/Loading';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItem';
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
  DialogTitle
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  header: {
    height:"70px"
  },
  middle:{
    height:"350px",
    backgroundColor:"#007ACC"
  },
  formControl:{
    backgroundColor:"#fff",
    // width:250,
    marginTop:50,
    borderRadius:5,
    textTransform:"capitalize"
  },
  container:{
    marginTop:80
  },
  title:{
    marginTop:50,
    color:"#fff"
  },
  footer:{
    height:"50px",
    backgroundColor:"#535A6B" 
  },
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  button:{
    textTransform:"capitalize" 
  }
}));

const DoctortList = () => {

  const classes = useStyles();

  const [loading , setLoading] = useState(false);

  const [user , setUser] = useState([]);
  const [departments , setDepartments] = useState([]);
  const [rowValue , setRowValue] = useState({});
  const [requestLoad,setRequestLoad]=useState(false);
  const [requestDialog,setRequestDialog]=useState(false);
  const [doctor , setDoctor] = useState({
    lastName:"",
    firstName:"",
    departmentName:"",
    gender:"",
    email:"",
    phoneNumber:"",
    age:"",
    startingHour:"",
    endingHour:""
})

const handleChanges = (e) => {
    const { name, value } = e.target;
    setDoctor({
        ...doctor,
        [name]: value,
      });
      console.log(doctor);
}

  const handleChange = (event) => {
    const value = event.target.value;
    // setRowValue({...rowValue, [rowValue.name]:value});
    // setDepName(value);
    // console.log(depName)
  };

  const updateDoctor = () =>{

  }
  useEffect(()=>{
    axios.get("http://localhost:8080/api/v1/department" ).then((response) => { 
    setDepartments(response.data)
    console.log(response.data);
  });
  }, [])
  const deleteDoctor = (id) => {
    axios.delete(`http://localhost:8080/api/v1/doctor/${id}`)
    .then(res => {
      alert("Doctor have been successfull Deleted..");
      axios.get("http://localhost:8080/api/v1/doctor" ).then((response) => { 
        setUser(response.data)
        // console.log(response.datas
    });


    })
  };


  useEffect(()=>{  
    // axios.get("https://hospital-appointment-com.herokuapp.com/api/v1/doctor" ).then((response) => { 
      axios.get("http://localhost:8080/api/v1/doctor" ).then((response) => {   
    setUser(response.data);
    console.log(response.data);
    setLoading(true);
});
  }, [])



const actionColumns = [
  {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          <div
            className="deleteButton"
            onClick={() => {
              // openPop()
              setRequestDialog(true);
              // setRowValue(params.row)
              // setDepName(params.row.name)
            }}
          >
            Update
          </div>
          <div
            className="viewButton"
            onClick={() => {
               deleteDoctor(params.row.id)
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
     <div className="datatableTitle">
        Add New Doctor
        <Link to="/doctor/newDoctor" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={user}
        columns={doctorColumns.concat(actionColumns)}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
      />
    </div>
    <Dialog
    style={{width:""}}
    maxWidth="sm"
    fullWidth
        open={requestDialog}
        onClose={()=>{
          setRequestDialog(false);
        }}
        aria-labelledby="request appointment"
        aria-describedby="request appointment"
      >
        <DialogTitle style={{color:"red"}}>Update Doctor Info</DialogTitle>
        <DialogContent>
          <DialogContentText >
            <Box>
              <Box display="flex" style={{marginTop:6}} alignItems='center' justifyContent='center'>
              <div className="bottom">
          <div className="left">

          </div>
          <div className="right" >
          <form className="forms"  style={{width:"100%"}}>
      
      <div className="section-1">
      <div>
      <TextField id="outlined-basic" value={doctor.firstName} onChange={handleChanges} className="input"  name="firstName" type="text" required label="First Name" variant="outlined" />
      </div>
      <div>
       <TextField id="outlined-basic" value={doctor.lastName} onChange={handleChanges} className="input" name="lastName" type="text" required label="Last Name" variant="outlined" />
       </div>
       <TextField id="outlined-basic" value={doctor.email} onChange={handleChanges} className="input" name="email" type="email" required label="Email" variant="outlined" />
       <div>
       <TextField id="outlined-basic" value={doctor.phoneNumber} onChange={handleChanges} className="input" name="phoneNumber" type="phone" required label="Phone Number" variant="outlined" />
       </div>
       <div>
       <TextField id="outlined-basic" value={doctor.age} onChange={handleChanges} className="input" name="age" type="number" required label="Age" variant="outlined" />
       </div>
          </div>
          <div className="section-2">
      <div>
      <TextField
           id="outlined-select-currency"
           select
           onChange={handleChanges}
           name="departmentName"
           value={doctor.departmentName}
           label="Select Department"
           className="input"
           style={{width:"100%", marginTop:"10px", marginButton:"5px"}}
         >
           {departments.map((option) => (
             <MenuItem key={option.value} value={option.id}>
               {option.name}
             </MenuItem>
           ))}
         </TextField>
      </div>
      <div>
 
         <TextField id="outlined-select-currency" value={doctor.gender} name="gender" onChange={handleChanges} select label="Select Gender"   className="input">
         <MenuItem value="male" >male</MenuItem>
         <MenuItem value="female">female</MenuItem>
         </TextField>
      </div>
       <TextField id="outlined-basic" value={doctor.startingHour} onChange={handleChanges}  name="startingHour" type="number" className="input" required label="Starting Hour" variant="outlined" />
       <div>
       <TextField id="outlined-basic" value={doctor.endingHour} onChange={handleChanges} name="endingHour" type="number" className="input" required label="Ending Hour" variant="outlined" />
       </div>
          </div>
          </form>
          </div>
        </div>
              </Box>
            </Box>
            </DialogContentText>
       </DialogContent>
       <DialogActions>
          
          <Button variant="outlined" className={classes.button} onClick={()=>{
            setRequestDialog(false);
          }} color="secondary" >
          
           Cancel

          </Button>
             <Button autoFocus className={classes.button} disableElevation variant="contained" color="primary" onClick={()=>{
                updateDoctor(rowValue.id);
              }}>
               {requestLoad?<CircularProgress  color="secondary" size={25}/>:"Update Department"}
                </Button>
         

        </DialogActions>
</Dialog>
    </>

  );
};

export default DoctortList;
