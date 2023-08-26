import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import { useAuthUser } from "react-auth-kit";

import FullScreenLoader from "../../components/loader/FullScreenLoader";
import AdminSidebar from "../../components/sidebar/AdminSidebar";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import SkipperSidebar from "../../components/sidebar/SkipperSidebar";
import { BASE_URL } from "../../config/baseUrl";

const Home = () => {
  const auth = useAuthUser();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalBoats, setTotalBoats] = useState(0);
  const [todayIncomes, setTodayIncomes] = useState(0);
  const [todayIncomesPer, setTodayIncomesPer] = useState(0);
  const [datas, setDatas] = useState([]);
  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        // Fetch user information using auth()
        const userInformation = await auth();

        // Set the user object in component state
        setUser(userInformation);

        // Fetch total amount
        const amountResponse = await axios.get(
          `${BASE_URL}/paymentReports/calculate`,
          {
            headers: {
              Authorization: `Bearer ${auth().jwtToken}`,
            },
          }
        );
        //total_amount":null
        setTotalAmount(amountResponse.data);

        // Fetch total bookings
        const bookingsResponse = await axios.get(
          `${BASE_URL}/bookingReports/count`,
          {
            headers: {
              Authorization: `Bearer ${auth().jwtToken}`,
            },
          }
        );
        setTotalBookings(bookingsResponse.data);

        // Fetch total boats
        const boatsResponse = await axios.get(`${BASE_URL}/boatReports/count`, {
          headers: {
            Authorization: `Bearer ${auth().jwtToken}`,
          },
        });
        setTotalBoats(boatsResponse.data);

        const todaysTotalIncomeResponse = await axios.get(
          `${BASE_URL}/paymentReports/calculateTodayIncome`,
          {
            headers: {
              Authorization: `Bearer ${auth().jwtToken}`,
            },
          }
        );
        setTodayIncomes(todaysTotalIncomeResponse.data);

        const todaysTotalIncomePercentategResponse = await axios.get(
          `${BASE_URL}/paymentReports/calculateTodayPercentage`,
          {
            headers: {
              Authorization: `Bearer ${auth().jwtToken}`,
            },
          }
        );
        setTodayIncomesPer(todaysTotalIncomePercentategResponse.data);

        // const sixMonthReportResponse = await axios.get(
        //   `${BASE_URL}/paymentReports/sixMonthsAgo`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${auth().jwtToken}`,
        //     },
        //   }
        // );
        // setDatas(sixMonthReportResponse.data);

        const response = await axios.get(
          `${BASE_URL}/paymentReports/sixMonthsAgo`,
          {
            headers: {
              Authorization: `Bearer ${auth().jwtToken}`,
            },
          }
        );

        setDatas(response.data);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch user information:", error);
        setIsLoading(false);
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
          <Widget type="booking" amount={totalBookings} />

          <Widget type="payments" amount={totalAmount[0].total_amount} />
          <Widget type="boats" amount={totalBoats} />
        </div>
        <div className="charts">
          <Featured todayIncome={todayIncomes} percentage={todayIncomesPer} />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} data={datas} />
        </div>

        {/* <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div> */}
      </div>
    </div>
  );
};

export default Home;
