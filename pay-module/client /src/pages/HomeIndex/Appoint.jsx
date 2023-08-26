import React from "react";
import { useNavigate } from 'react-router-dom';
import { useState , useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const Appoint = (props) => {

    
  const [doctorId , setDoctorId] = useState(localStorage.getItem('doctorId'))

  const [hour , setHour] = useState(localStorage.getItem('hour'))
  

    const [availableAppointment , setAvailableAppointment] = useState([
        {date:"20-02-2022" , hour:"17:00"},
        {date:"20-02-2022" , hour:"18:00"},
        {date:"20-02-2022" , hour:"19:00"},
        {date:"20-02-2022" , hour:"20:00"},
        {date:"20-02-2022" , hour:"21:00"},
        {date:"20-02-2022" , hour:"22:00"},
        {date:"20-02-2022" , hour:"23:00"},
        {date:"20-02-2022" , hour:"00:00"}
      ])
    
 
  return (
    <>
  
         <h1>the appointment hour is {props.location.state} </h1>
    </>
  
  );
};

export default Appoint;