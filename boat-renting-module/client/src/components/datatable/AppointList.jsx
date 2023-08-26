import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import {
  userColumns,
  appointColumns,
  depColumns,
  userRows,
} from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AppointList = () => {
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState([]);

  const [appointmentPending, setAppointmentPending] = useState([]);

  useEffect(() => {
    axios
      .get("https://hospital-appointment-com.herokuapp.com/api/v1/apt/all")
      .then((response) => {
        setAppointment(response.data);
        // console.log(response.data)
        let datas = response.data.filter(
          (app) => app.appointmentStatus === "PENDING"
        );

        // console.log(" type of datas " +typeof datas)

        // console.log(" type of response.datas " + typeof response.data)

        setAppointmentPending(datas);
      });
  }, []);

  // console.log("   appointments pending " + appointmentPending)

  const [data, setData] = useState(userRows);

  const approveRequest = (id) => {
    axios
      .put(`http://localhost:8080/api/v1/apt/${id}/status/${1}`)
      .then((res) => {
        alert("Appointment have been successfull approved");
        axios.get("http://localhost:8080/api/v1/apt/all").then((response) => {
          setAppointment(response.data);

          let datas = response.data.filter(
            (app) => app.appointmentStatus === "PENDING"
          );

          setAppointmentPending(datas);
        });
      });
  };
  const rejectRequest = (id) => {
    axios
      .put(`http://localhost:8080/api/v1/apt/${id}/status/${0}`)
      .then((res) => {
        alert("Appointment have been successfull rejected");

        axios.get("http://localhost:8080/api/v1/apt/all").then((response) => {
          setAppointment(response.data);
          // console.log(response.data)
          let datas = response.data.filter(
            (app) => app.appointmentStatus === "PENDING"
          );

          setAppointmentPending(datas);
        });
      });
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => approveRequest(params.row.id)}
            >
              Approve
            </div>
            <div
              className="viewButton"
              onClick={() => rejectRequest(params.row.id)}
            >
              Reject
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="datatable">
        <div className="datatableTitle">List Of Appointments Requested</div>
        <DataGrid
          className="datagrid"
          rows={appointmentPending}
          columns={appointColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      </div>
    </>
  );
};

export default AppointList;
