import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/TripList"

const DestionationList = () => {
    return (
      <div className="list">
        <Sidebar/>
        <div className="listContainer">
          <Navbar/>
           <Datatable/> 
        </div>
      </div>
    )
  }
  
  export default DestionationList