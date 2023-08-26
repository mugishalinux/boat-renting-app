import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import { useAuthUser } from "react-auth-kit";
import React, { useState, useEffect } from "react";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import AdminSidebar from "../../components/sidebar/AdminSidebar";
import SkipperSidebar from "../../components/sidebar/SkipperSidebar";
import Datatable from "../../components/datatable/BoatList";

const Boat = () => {
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
      {user && user.access_level == "admin" ? <AdminSidebar /> : <SkipperSidebar />}
      <div className="homeContainer">
        <Navbar imageUrl={user.profile} style={{ marginBottom: "50px" }} />
        <Datatable />
      </div>
    </div>
  );
};

export default Boat;
