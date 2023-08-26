import SkipperSidebar from "../../components/sidebar/SkipperSidebar";
import Navbar from "../../components/navbar/Navbar";
import BookList from "../../components/datatable/BookList";

const BookingList = () => {
  return (
    <div className="list">
      <SkipperSidebar />
      <div className="listContainer">
        <Navbar />
        <BookList />
      </div>
    </div>
  );
};

export default BookingList;
