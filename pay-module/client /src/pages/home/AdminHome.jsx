import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import { useAuthUser } from "react-auth-kit";
import React, { useState, useEffect } from "react";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import AdminSidebar from "../../components/sidebar/AdminSidebar";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import SkipperSidebar from "../../components/sidebar/SkipperSidebar";

const AdminHome = () => {
  const auth = useAuthUser();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        // Fetch user information using auth()
        const userInformation = await auth();

        // Set the user object in component state
        setUser(userInformation);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch user information:", error);
        setIsLoading(false); // Set
      }
    };
    fetchUserInformation();
  }, []);
  if (isLoading) {
    return <FullScreenLoader />;
  }
  return (
    <div className="home">
      {user && user.access_level == "admin" ? (
        <AdminSidebar />
      ) : (
        <SkipperSidebar />
      )}
      <div className="homeContainer">
        <Navbar imageUrl={user.profile} style={{ marginBottom: "50px" }} />
        <div className="widgets">
          <Widget type="booking" amount="100" />
          <Widget type="payments" amount="100" />
          <Widget type="boats" amount="100" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
