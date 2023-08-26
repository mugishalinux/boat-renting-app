import axios from "axios";
import { useNavigate } from "react-router-dom";

export const userColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "Departmet Name",
    headerName: "Departmet Name",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },

  {
    field: "age",
    headerName: "Age",
    width: 100,
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];

//temporary data
export const userRows = [
  {
    id: 1,
    username: "Snow",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    status: "active",
    email: "1snow@gmail.com",
    age: 35,
  },
  {
    id: 2,
    username: "Jamie Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "2snow@gmail.com",
    status: "passive",
    age: 42,
  },
  {
    id: 3,
    username: "Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "3snow@gmail.com",
    status: "pending",
    age: 45,
  },
  {
    id: 4,
    username: "Stark",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "4snow@gmail.com",
    status: "active",
    age: 16,
  },
  {
    id: 5,
    username: "Targaryen",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "5snow@gmail.com",
    status: "passive",
    age: 22,
  },
  {
    id: 6,
    username: "Melisandre",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "6snow@gmail.com",
    status: "active",
    age: 15,
  },
  {
    id: 7,
    username: "Clifford",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "7snow@gmail.com",
    status: "passive",
    age: 44,
  },
  {
    id: 8,
    username: "Frances",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "8snow@gmail.com",
    status: "active",
    age: 36,
  },
  {
    id: 9,
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "snow@gmail.com",
    status: "pending",
    age: 65,
  },
  {
    id: 10,
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "snow@gmail.com",
    status: "active",
    age: 65,
  },
];

export const skippersColumn = [
  {
    field: "id",
    headerName: "ID",
    width: 40,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.id}</div>;
    },
  },
  {
    field: "Names",
    headerName: "Names",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.firstName + " " + params.row.lastName}
        </div>
      );
    },
  },
  {
    field: "dob",
    headerName: "dob",
    width: 100,
    renderCell: (params) => {
      const dob = new Date(params.row.dob);
      const formattedDate = dob.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return <div className="cellWithImg">{formattedDate}</div>;
    },
  },
  {
    field: "phone",
    headerName: "phone",
    width: 130,
    renderCell: (params) => {
      const phoneNumber = params.row.primaryPhone;
      const reformattedPhone = phoneNumber.substring(2);

      return <div className="cellWithImg">{reformattedPhone}</div>;
    },
  },
  // {
  //   field: "NID",
  //   headerName: "NID",
  //   width: 150,
  //   renderCell: (params) => {
  //     const nationalIdUrl = params.row.supportingDoc.nationalId;
  //     return (
  //       <div className="cellWithImg">
  //         <img
  //           src={nationalIdUrl}
  //           alt="NID"
  //           style={{ padding: "10px", maxWidth: "100px" }}
  //         />
  //       </div>
  //     );
  //   },
  // },
  // {
  //   field: "RDB Certificate",
  //   headerName: "RDB Certificate",
  //   width: 150,
  //   renderCell: (params) => {
  //     const rdbCertificateUrl = params.row.supportingDoc.rdbCertificate;
  //     return (
  //       <div className="cellWithImg">
  //         <img
  //           src={rdbCertificateUrl}
  //           alt="RDB Certificate"
  //           style={{ padding: "10px", maxWidth: "100px" }}
  //         />
  //       </div>
  //     );
  //   },
  // },

  // {
  //   field: "status",
  //   headerName: "status",
  //   width: 100,
  //   renderCell: (params) => {
  //     return <div className="cellWithImg">{params.row.status}</div>;
  //   },
  // },
];

export const boatColumn = [
  {
    field: "id",
    headerName: "ID",
    width: 40,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.id}</div>;
    },
  },
  {
    field: "price",
    headerName: "Price",
    width: 80,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.price}</div>;
    },
  },
  {
    field: "max people",
    headerName: "Max People",
    width: 110,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.maxNumber}</div>;
    },
  },

  {
    field: "Boat Location",
    headerName: "Boat Location",
    width: 110,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">{params.row.location.locationName}</div>
      );
    },
  },
];

export const depColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 40,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.id}</div>;
    },
  },
  {
    field: "Departmet Name",
    headerName: "Departmet Name",
    width: 230,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.name}</div>;
    },
  },
];

export const appointColumns = [
  { field: "id", headerName: "ID", width: 40 },
  {
    field: "Patient Names",
    headerName: "Departmet Name",
    width: 140,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.patientName}</div>;
    },
  },
  {
    field: "Patient Email",
    headerName: "Patient Email",
    width: 190,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.patientEmail}</div>;
    },
  },
  {
    field: "Sickness Overview",
    headerName: "Sickness Overview",
    width: 170,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">{params.row.patientSicknessDetail}</div>
      );
    },
  },
  {
    field: "Appointment Date & Hour",
    headerName: "Appointment Date & Hour",
    width: 170,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.appointmentDate +
            " | " +
            params.row.appointmentHour +
            ":00"}
        </div>
      );
    },
  },
  {
    field: "App Status",
    headerName: "App Status",
    width: 100,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.appointmentStatus}</div>;
    },
  },

  {
    field: "Doctor Choosen",
    headerName: "Doctor Choosen",
    width: 180,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.doctor.firstName +
            " " +
            params.row.doctor.lastName +
            " " +
            "[" +
            params.row.doctor.department.name +
            "]"}
        </div>
      );
    },
  },
];

export const locationColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 40,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.id}</div>;
    },
  },
  {
    field: "Location Name",
    headerName: "Location Name",
    width: 200,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.locationName}</div>;
    },
  },
];

export const tripColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 40,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.id}</div>;
    },
  },
  {
    field: "Destination Name",
    headerName: "Destination Name",
    width: 230,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.tripName}</div>;
    },
  },
];

export const scheduleColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 40,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.id}</div>;
    },
  },
  {
    field: "Schedule time",
    headerName: "Destination Name",
    width: 230,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.schedule_time}</div>;
    },
  },
];

export const bookingColumns = [
  { field: "id", headerName: "ID", width: 40 },
  {
    field: "id",
    headerName: "id",
    width: 60,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.id}</div>;
    },
  },
  {
    field: "booking ref",
    headerName: "Booking Ref",
    width: 100,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.bookingRef}</div>;
    },
  },
  {
    field: "booking Date",
    headerName: "Booking Date",
    width: 150,
    renderCell: (params) => {
      const date = new Date(params.row.bookingDate);
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

      return <div className="cellWithImg">{formattedDate}</div>;
    },
  },

  {
    field: "from",
    headerName: "From",
    width: 60,
    renderCell: (params) => {
      return (
        <div className="cellWithImg" style={{ marginLeft: "10px" }}>
          {params.row.bookingFrom}
        </div>
      );
    },
  },
  {
    field: "to",
    headerName: "To",
    width: 60,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.bookingTo}</div>;
    },
  },
  {
    field: "names",
    headerName: "names",
    width: 140,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.names}</div>;
    },
  },
  {
    field: "phone Number",
    headerName: "Phone Number",
    width: 130,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.phoneNumber}</div>;
    },
  },

  {
    field: "payment Status",
    headerName: "Payment Status",
    width: 120,
    renderCell: (params) => {
      let color;
      if (params.row.paymentStatus === "pending") {
        color = "red";
      } else if (params.row.paymentStatus === "approved") {
        color = "green";
      } else {
        color = "black";
      }

      return (
        <div className="cellWithImg" style={{ color, fontWeight: "bold" }}>
          {params.row.paymentStatus}
        </div>
      );
    },
  },
];

export const paymentColumn = [
  {
    field: "id",
    headerName: "ID",
    width: 40,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.id}</div>;
    },
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 80,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.amount}</div>;
    },
  },
  {
    field: "paymentStatus",
    headerName: "Payment Status",
    width: 150,
    renderCell: (params) => {
      let color;
      if (params.row.paymentStatus === "pending") {
        color = "red";
      } else if (params.row.paymentStatus === "approved") {
        color = "green";
      } else {
        color = "black";
      }

      return (
        <div className="cellWithImg" style={{ color, fontWeight: "bold" }}>
          {params.row.paymentStatus}
        </div>
      );
    },
  },

  {
    field: "internal payment Ref",
    headerName: "Internal Payment Ref",
    width: 200,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.iniPaymentRef}</div>;
    },
  },
  {
    field: "external payment Ref",
    headerName: "External Payment Ref",
    width: 200,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.extPaymentRef}</div>;
    },
  },
  {
    field: "booking id",
    headerName: "Booking Id",
    width: 110,
    renderCell: (params) => {
      return <div className="cellWithImg">{params.row.bookingId}</div>;
    },
  },
  {
    field: "created_at",
    headerName: "Payment Date",
    width: 150,
    renderCell: (params) => {
      const date = new Date(params.row.created_at);
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

      return <div className="cellWithImg">{formattedDate}</div>;
    },
  },
];
