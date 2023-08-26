export const doctorColumns = [
    { field: "id", headerName: "ID", width: 30 },
    {
      field: "Doctor Names",
      headerName: "Doctor Names",
      width:170,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
           
            {params.row.firstName+" "+ params.row.lastName}
          </div>
        );
      },
    },
    {
        field: "Department",
        headerName: "Department",
        width:120,
        renderCell: (params) => {
            return (
              <div className="cellWithImg">
                {params.row.department.name}
              </div>
            );
          },
      },
      {
        field: "Gender",
        headerName: "Gender",
        width:80,
        renderCell: (params) => {
            return (
              <div className="cellWithImg">
                {params.row.gender}
              </div>
            );
          },
      },
    {
      field: "Age",
      headerName: "Age",
      width: 90,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
           
            {params.row.age}
          </div>
        );
      },
    },
    {
        field: "Email",
        headerName: "Email",
        width:180,
        renderCell: (params) => {
            return (
              <div className="cellWithImg">
               
                {params.row.email}
              </div>
            );
          },
      },
      {
        field: "Phone Number",
        headerName: "Phone Number",
        width:150,
        renderCell: (params) => {
            return (
              <div className="cellWithImg">
               
                {params.row.phoneNumber}
              </div>
            );
          },
      },
      {
        field: "Starting Hour",
        headerName: "Starting Hour",
        width: 80,
        renderCell: (params) => {
            return (
              <div className="cellWithImg">
               
                {params.row.startHour}
              </div>
            );
          },
      },
      {
        field: "Ending Hour",
        headerName: "Ending Hour",
        width: 80,
        renderCell: (params) => {
            return (
              <div className="cellWithImg">
               
                {params.row.endHour}
              </div>
            );
          },
      },
  ];