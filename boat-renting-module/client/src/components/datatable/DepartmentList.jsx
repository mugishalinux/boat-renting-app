import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from '@material-ui/core/styles';
import { userColumns, depColumns , userRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState , useEffect } from "react";
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

const DepartmentList = () => {

  
  const classes = useStyles();
  const [departments , setDepartments] = useState([]);
  const [depName, setDepName] = useState("");
  const [rowValue , setRowValue] = useState({});
  const [requestLoad,setRequestLoad]=useState(false);
  const [requestDialog,setRequestDialog]=useState(false);
  const [loading , setLoading] = useState(false);

  useEffect(()=>{
    //axios.get("https://hospital-appointment-com.herokuapp.com/api/v1/department" ).then((response) => { 
    axios.get("http://localhost:8080/api/v1/department" ).then((response) => { 
    setDepartments(response.data)
    console.log(response.data);
});
  }, [])

  const updateDepartment = (id) => {
    axios.put(`http://localhost:8080/api/v1/department/update/${id}` , {name:depName})
    .then(res => {
      setRequestDialog(false);
      alert("Department have been successfull updated");
      axios.get("http://localhost:8080/api/v1/department" ).then((response) => { 
       setDepartments(response.data)
       
    });
    })
  };

  const changeValue = () => {
    
  }

  const handleChange = (event) => {
    const value = event.target.value;
    // setRowValue({...rowValue, [rowValue.name]:value});
    setDepName(value);
    // console.log(depName)
  };
  const updateDepartments = (id) =>{
     alert(id)
  }
  const deleteDepartment = (id) => {
    axios.delete(`http://localhost:8080/api/v1/department/delete/${id}` )
    .then(res => {
      alert("Department have been successfull Deleted..");
      axios.get(" http://localhost:8080/api/v1/department" ).then((response) => { 
        setDepartments(response.data)
        // console.log(response.datas
    });


    })
  };



  const [data, setData] = useState(userRows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
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
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => {
                // openPop()
                setRequestDialog(true);
                setRowValue(params.row)
                setDepName(params.row.name)
              }}
            >
              Update
            </div>
            <div
              className="viewButton"
              onClick={() => {
                // deleteDepartment(params.row.id)
               
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
    {/* <div className="datatable">
     <div className="datatableTitle">
        Add New Department
        <Link to="/departments/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div> */}

    <div className="datatable">
     <div className="datatableTitle">
        Add New Department
        <Link to="/departments/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={departments}
        columns={depColumns.concat(actionColumns)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
    <Dialog
    maxWidth="sm"
    fullWidth
        open={requestDialog}
        onClose={()=>{
          setRequestDialog(false);
        }}
        aria-labelledby="request appointment"
        aria-describedby="request appointment"
      >
        <DialogTitle style={{color:"red"}}>Update Department Info</DialogTitle>
        <DialogContent>
          <DialogContentText >
            <Box>
              <Box display="flex" style={{marginTop:6}} alignItems='center' justifyContent='center'>
              <div className="bottom">
          <div className="left">

          </div>
          <div className="right" >
            <form className={classes.root} noValidate autoComplete="off">
            <TextField id="outlined-basic"
             label="department name" 
             value={depName}
             variant="outlined" 
             type="text"
             name="depName"
             onChange={handleChange}
             />
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
                updateDepartment(rowValue.id);
              }}>
               {requestLoad?<CircularProgress  color="secondary" size={25}/>:"Update Department"}
                </Button>
         

        </DialogActions>
</Dialog>
    </>

  );
};

export default DepartmentList;
