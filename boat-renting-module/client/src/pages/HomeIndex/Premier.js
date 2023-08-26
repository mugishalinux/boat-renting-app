import React, { useState, useEffect } from "react"
import appointment from "./appointment.jpg";
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import "./index.css";
import { useSnackbar } from "notistack";
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

import Format from "date-fns/format";
import {Close,Today,DateRange} from '@material-ui/icons';



import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

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

function Premier(props){
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();



  // get list of doctors 



  




  const [doctors,setDoctors]=useState([]);
  const get_doctors=()=>{

    axios.get("http://localhost:8080/api/v1/doctor" )
    
    .then(res=>{
      console.log(res.data);
      setDoctors(res.data);
     })
    .catch(err=>{
        var e = err.message;
        if (err.response) {
          e = err.response.data.message;
          enqueueSnackbar(e, {
            variant: "error",
            action: (k) => (
              <IconButton
                onClick={() => {
                  closeSnackbar(k);
                }}
                size="small"
              >
                <Close fontSize="small" />
              </IconButton>
            ),
          });
        }
      });
  }


  // get doctor appointment schedule 

//   const [body , setBody] = useState({
//     "patientName":"mugisha",
//     "patientEmail":"mugi@gmail.com",
//     "patientSicknessDetail":"munda",
//      "appointmentDate":"2022-05-29",
//     "appointmentHour":"14",
// })

// disable previous dates

const disablePastDate = () => {
  const today = new Date();
  const dd = String(today.getDate() + 1).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); 
  const yyyy = today.getFullYear();
  return yyyy + "-" + mm + "-" + dd;
};

  const [appointmentDate, setAppointmentDate] = useState({value:Format(new Date(), ["yyyy-MM-dd",]),error:""});
  const [doctorId,setDoctorId]=useState({value:0,error:""});

  const [appointmentLoad,setAppointmentLoad]=useState(false);
  const [appointments,setAppointments]=useState([]);
  const get_appointment=()=>{
    if(doctorId.value==0){
      enqueueSnackbar("Please select doctor", {
        variant: "error",
        action: (k) => (
          <IconButton
            onClick={() => {
              closeSnackbar(k);
            }}
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        ),
      });
      return
    }else{
      setAppointmentLoad(true);
    
      var obj={
        id:doctorId.value,
        date:appointmentDate.value
      };
      setDoctorId(obj.id)

     
     
        axios.get(`http://localhost:8080/api/v1/apt/doc/${obj.id}/date/${obj.date}`)
        .then(res=>{
          var data=res.data;
          console.log(data);
          setAppointmentLoad(false);
          setAppointments(data);
        })
      
        .catch(err=>{
        setAppointmentLoad(false);
        var e = err.message;
        if (err.response) {
          e = err.response.data.message;
          enqueueSnackbar(e, {
            variant: "error",
            action: (k) => (
              <IconButton
                onClick={() => {
                  closeSnackbar(k);
                }}
                size="small"
              >
                <Close fontSize="small" />
              </IconButton>
            ),
          });
        }
      })
    }
  }

  // request doctor appointment

  const [requestDialog,setRequestDialog]=useState(false);
  const [firstName,setFirstName]=useState({value:"",error:""});
  const [lastName,setLastName]=useState({value:"",error:""});
  const [email,setEmail]=useState({value:"",error:""});
  const [phone,setPhone]=useState({value:"",error:""});
  const [requestLoad,setRequestLoad]=useState(false);
  const [appointmentHour,setAppointmentHour]=useState(0);
  const request_appointment=()=>{
    if(firstName.value==""){
      setFirstName({value:"",error:"Please enter your first name"});
    }else if(lastName.value==""){
      setLastName({value:"",error:"Please enter your last name"});
    }else if(email.value==""){
      setEmail({value:"",error:"Please enter your email"});
    }else if(phone.value==""){
      setPhone({value:"",error:"Please enter valid phone number"});
    }else{
      setRequestLoad(true);
      var requestBody={
        patientName:firstName.value+" "+lastName.value,
        patientEmail:email.value,
        patientSicknessDetail:phone.value,
        appointmentHour:appointmentHour,
        appointmentDate:appointmentDate.value,
      };
      // axios.get((`http://localhost:8080/api/v1/apt/${doctorId}`), requestBody)
      axios.post(`http://localhost:8080/api/v1/apt/${doctorId}`, {
        patientName:firstName.value+" "+lastName.value,
        patientEmail:email.value,
        patientSicknessDetail:phone.value,
        appointmentHour:parseInt(appointmentHour),
        appointmentDate:appointmentDate.value,
      })
      
      .then((res)=>{
        var message="appointment successful booked";
        enqueueSnackbar(message, { 
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
        },
      });
      setTimeout(() => {
        window.location.reload(true);
      },2000);
      setRequestLoad(false);
      setRequestDialog(false);

      setFirstName({value:"",error:""});
      setLastName({value:"",error:""});
      setEmail({value:"",error:""});
      setPhone({value:"",error:""});

      })
      .catch((err)=>{
      setRequestLoad(false);
        var e = err.message;
        if (err.response) {
          e = err.response.data;
          enqueueSnackbar(e, {
            variant: "error",
            action: (k) => (
              <IconButton
                onClick={() => {
                  closeSnackbar(k);
                }}
                size="small"
              >
                <Close fontSize="small" />
              </IconButton>
            ),
          });
        }
      })
    }
  }

  const login = () => {
    // navigate('/login')
  }

  return(
<div>
<section class="home-banner">
      <div class="home-banner-child" >
        <div class="overlay"></div>
        <div class="container" >
          <div class="row slider-text align-items-end">
            <div class="col-md-7 col-sm-12 ftco-animate mb-5 title">
              <h1 class="mb-3" >Our friendly, qualified staff put their patients at the heart of everything they do.</h1>
            </div>
            <div className="login-admin">
              <button style={{width:"100px;", padding:"10px;"}} onClick={login}>Sign as admin</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ftco-intro " style={{marginTop:'60px'}}>
    	<div class="container">
    		<div class="row no-gutters">
    			<div class="col-md-3 color-1 p-4">
    				<h3 class="mb-4">Emergency Cases</h3>
          
    				<span class="phone-number">+ (123) 123 1234</span>
    			</div>
    			<div class="col-md-3 color-2 p-4">
    				<h3 class="mb-4">Opening Days</h3>
    				<p class="openinghours d-flex">
    					<span>Monday - Sunday</span>
    				
    				</p>
    			</div>
    			<div class="col-md-6 color-3 p-4">
    				<h3 class="mb-2">Make an Appointment</h3>
    				<form action="#" class="appointment-form">
	            <div class="row">
	            	<div class="col-sm-4">
	                <div class="form-group">
			              <div class="select-wrap">
                      <div class="icon"><span class="ion-ios-arrow-down"></span></div>
         
                      <select  labelId="doctor"
                      className="form-control"
          id="doctor"
          value={doctorId.value}
          onChange={(e)=>{
            if(e.target.value!=0){
              setDoctorId({value:e.target.value,error:""});
            }else{
              setDoctorId({value:0,error:"Incorrect value"})
            }
          }}>
            {doctors.map((option) => (
              <option value={option.id}>{option.firstName + " " + option.lastName + "  " + option.department.name + " specialist"}</option>
            ))}
          </select>
                    </div>
			            </div>
                 
	              </div>
                <div class="col-sm-4">
	                <div class="form-group">
	                	<div class="icon"><span class="ion-ios-calendar"></span></div>
	                  <input  className="form-control"
    value={appointmentDate.value}
    id="odate" 
    type="date"  
    size="small" 
    variant="outlined" 
    onChange={(e)=>{
      setAppointmentDate({value:e.target.value,error:""});
      console.log(e.target.value);
    }} min={disablePastDate()} class="form-control appointment_date" placeholder="Date"/>
	                </div>    
	              </div>
	            </div>
	            <div class="row">
	              <div class="col-sm-4">
	                <div class="form-group">
                 
                  <button 
      className="btn btn-primary"
      style={{backgroundColor:"#00e600", color:"white",width:"160px",borderRadius:"5px"}}
      disableElevation
      variant="contained"
      disabled={appointmentLoad}
      startIcon={<Today/>}
      onClick={()=>{get_appointment();}}
      >
        {appointmentLoad? <CircularProgress size={25} />:"check availability"}
      </button>
	                </div>    
	              </div>
	            </div>
	          </form>
    			</div>
    		</div>
    	</div>
    </section>


<Box>

<Box>
  <Container maxWidth="sm">
   
  <List>
    {appointments.map((o)=>{
      return(
      <>
      <ListItem style={{border:"solid 2px red;"}}>
        <ListItemAvatar>
        <img src={appointment} width={100}  />
        </ListItemAvatar>
        <ListItemText primary={<Typography>{o.date} {o.time+":00"}</Typography>} />
         <ListItemSecondaryAction>
         
           <Button className={classes.button} startIcon={<DateRange/>} variant="outlined" onClick={()=>{
            setAppointmentHour(o.time);
            setRequestDialog(true);
           }}>
             Book
             </Button>
            
         </ListItemSecondaryAction>
      </ListItem>
      <Divider/>
      </>
      );
    })}
    
    </List>

   {appointments.length==0&&<center> 
  
 
    </center>}
    
   
  </Container>
</Box>
</Box>


{/* request appointment  start dialog*/}
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
        <DialogTitle style={{color:"red"}}>Book Appointment</DialogTitle>
        <DialogContent>
          <DialogContentText >
            <Box>
              <Box>
              <ListItem>
                <ListItemAvatar>
                <img src={appointment} style={{width:"200px"}}  />
                </ListItemAvatar>
                <ListItemText primary={<Typography>2{appointmentDate.value} {appointmentHour}</Typography>}  />
              </ListItem>
              </Box>
              <Box display="flex" mt={1} alignItems='center' justifyContent='center'>
              <TextField size='small' 
              variant='outlined' 
                error={firstName.error!==""}
                helperText={firstName.error}
                value={firstName.value}
                onChange={(e)=>{
                  if(e.target.value===""){
                    setFirstName({value:"",error:"Enter firstname"});
                  }else{
                    setFirstName({value:e.target.value,error:""});
                  }
                }}
            label="First Name"
            color='primary' 
             fullWidth/>
              </Box>
              <Box display="flex" style={{marginTop:6}} alignItems='center' justifyContent='center'>
              <TextField size='small' 
              variant='outlined' 
                error={lastName.error!==""}
                helperText={lastName.error}
                value={lastName.value}
                onChange={(e)=>{
                  if(e.target.value===""){
                    setLastName({value:"",error:"Enter firstname"});
                  }else{
                    setLastName({value:e.target.value,error:""});
                  }
                }}
            label="Last Name"
            color='primary' 
             fullWidth/>
              </Box>

              <Box display="flex" style={{marginTop:6}} alignItems='center' justifyContent='center'>
              <TextField size='small' 
              variant='outlined' 
                error={phone.error!==""}
                helperText={phone.error}
                value={phone.value}
                onChange={(e)=>{
                  if(e.target.value===""){
                    setPhone({value:"",error:"Enter firstname"});
                  }else{
                    setPhone({value:e.target.value,error:""});
                  }
                }}
                label="Phone Number"
                color='primary' 
                fullWidth/>
              </Box>

              <Box display="flex" style={{marginTop:6}} alignItems='center' justifyContent='center'>
              <TextField size='small' 
              variant='outlined' 
                error={email.error!==""}
                helperText={email.error}
                value={email.value}
                onChange={(e)=>{
                  if(e.target.value===""){
                    setEmail({value:"",error:"Enter firstname"});
                  }else{
                    setEmail({value:e.target.value,error:""});
                  }
                }}
                type="text"
                label="Email"
                color='primary' 
                fullWidth/>
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
                request_appointment();
              }}>
               {requestLoad?<CircularProgress  color="secondary" size={25}/>:"Request Appointment"}
                </Button>
         

        </DialogActions>
</Dialog>
{/* request appointment  end dialog*/}
</div>
  );

}

export default Premier;
