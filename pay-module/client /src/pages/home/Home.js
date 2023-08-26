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
  const cardStyles = {
    backgroundColor: "black",
    color: "white",
    width: "300px",
    height: "180px",
    padding: "20px",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const cardNumberStyles = {
    fontSize: "1.2em",
    letterSpacing: "2px",
  };

  const cvvAndExpirationStyles = {
    display: "flex",
    justifyContent: "space-between",
  };

  const auth = useAuthUser();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalBoats, setTotalBoats] = useState(0);
  const [todayIncomes, setTodayIncomes] = useState(0);
  const [todayIncomesPer, setTodayIncomesPer] = useState(0);
  const [datas, setDatas] = useState([]);
  const [rows, setRows] = useState([]);
  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        // Fetch user information using auth()
        const userInformation = await auth();

        // Set the user object in component state
        setUser(userInformation);

        const transactions = await axios.get(
          `${BASE_URL}/user/transaction/list/${auth().id}`
        );
        setRows(transactions.data);

        const userInfo = await axios.get(`${BASE_URL}/user/info/${auth().id}`);
        setUserInfo(userInfo.data);

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
      <div className="homeContainer">
        <Navbar imageUrl={user.profile} style={{ marginBottom: "50px" }} />
        <div style={{ display: "flex" }}>
          <div style={{ marginLeft: "100px" }}>
            <div style={cardStyles}>
              <div>
                <div style={cardNumberStyles}>{userInfo.accountNumber}</div>
                <div style={cvvAndExpirationStyles}>
                  <div>
                    <div>CVV</div>
                    <div>{userInfo.cvv}</div>
                  </div>
                  <div>
                    <div>Exp</div>
                    <div>{userInfo.expirationCode}</div>
                  </div>
                </div>
              </div>
              <div>{userInfo.lastName + " " + userInfo.firstName}</div>
            </div>
          </div>
          <div style={{ marginLeft: "30px" }}>
            <h1>Card Balance</h1>
            <h1>RWF {userInfo.balance}</h1>
          </div>
        </div>

        <div className="charts">
          {/* <Featured todayIncome={10} percentage={40} /> */}
          {/* <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} data={datas} /> */}
        </div>

        <div style={{ backgroundColor: "white", padding: "60px" }} className="">
          <div className="listTitle">Latest Transactions</div>
          <Table rows={rows} />
        </div>
      </div>
    </div>
  );
};

export default Home;
