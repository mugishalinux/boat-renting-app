import Home from "./pages/home/Home";
import Index from "./pages/HomeIndex/Index";
import Doctor from "./pages/Doctor/ListOfDoctors";
import Landing from "./pages/Landing/Landing";
import Register from "./pages/Register/Register";
// import FullScreenLoader "./components/loader/FullScreenLoader";
import Destination from "./pages/destinations/DestinationList";
import SchedulesList from "./pages/Schedules/Schedules";
import Appoint from "./pages/HomeIndex/Appoint";
import AppointmentList from "./pages/Appointment/AppointmentList";
import Login from "./pages/login/Login";
import NewDoctor from "./pages/New_doctor/NewDoctor";
import NewSchedule from "./pages/new_schedule/New";
import List from "./pages/List_Appointment/List";
import ListOfDoctors from "./pages/Doctor/ListOfDoctors";
import Single from "./pages/single/Single";
import New from "./pages/new_department/New";
import NewLocation from "./pages/New_location/New";
import NewDestination from "./pages/new_destionation/New";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import BookingList from "./pages/booking/BookingList";
import { RequireAuth } from "react-auth-kit";
import Skipper from "./pages/skippers/Skipper";
import Location from "./pages/Locations/Location";
import Boat from "./pages/Boat/Boat";
import NewBoat from "./pages/new_boat/New";
import Payment from "./pages/payments/Payment";
function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route
              path="home"
              element={
                <RequireAuth loginPath="/">
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="payment"
              element={
                <RequireAuth loginPath="/">
                  <Payment />
                </RequireAuth>
              }
            />
            <Route
              path="bookings"
              element={
                <RequireAuth loginPath="/">
                  <BookingList />
                </RequireAuth>
              }
            />
            {/* FullScreenLoader */}
            <Route index element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="appointment" element={<AppointmentList />} />
            <Route path="appoint" element={<Appoint />} />
            <Route
              path="skipper"
              element={
                <RequireAuth loginPath="/">
                  <Skipper />
                </RequireAuth>
              }
            />

            <Route path="location">
              <Route
                index
                element={
                  <RequireAuth loginPath="/">
                    <Location />
                  </RequireAuth>
                }
              />
              <Route
                path=":locationId"
                element={
                  <RequireAuth loginPath="/">
                    <Single />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth loginPath="/">
                    <NewLocation inputs={userInputs} title="Add New User" />
                  </RequireAuth>
                }
              />
            </Route>

            <Route path="boat">
              <Route
                index
                element={
                  <RequireAuth loginPath="/">
                    <Boat />
                  </RequireAuth>
                }
              />
              <Route
                path=":boatId"
                element={
                  <RequireAuth loginPath="/">
                    <Single />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth loginPath="/">
                    <NewBoat inputs={userInputs} title="Add New Boat" />
                  </RequireAuth>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
