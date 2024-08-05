import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Register";
import Profile from "./components/Profile";
import Sidebar from "./components/SideBar";
import SidebarM from "./components/SideBarM";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Home from "./components/Home";
import Footer from "./components/Footer";
import CheckIn from "./components/CheckIn";
import Users from "./components/User";
import Court from "./components/Court";
import Area from "./components/Area";
import About from "./components/AboutUS";
import "./css/App.css";
import Role from "./components/Role";
import Post from "./components/Post";
import "./css/StyleHome.css";
import { UserProvider } from "./UserContext";
import ComPay from "./components/ComPay";
import Verify from "./components/EmailVerify";
import OtpInputWithValidation from "./components/OTPVerify";
import NewPass from "./components/NewPassword";
import Book from "./components/BookPlay";
import BookInfor from "./components/BookInfor";
import BookingType from "./components/BookingType";
import DashboardManager from "./components/DashboardManager";
import Amenity from "./components/Amenity";
import AmenityCourt from "./components/AmenityCourt";
import UserBooking from "./components/UserBooking";
import "@progress/kendo-theme-default/dist/all.css";
import FixedSchedule from "./components/FixedSchedule";
import OneTimeSchedule from "./components/OneTimeSchedule";
import FlexibleSchedule from "./components/FlexibleSchedule";
import News from "./components/New";
import NewsDetail from "./components/NewDetail";

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Home />
                <Footer />
              </>
            }
          />
          <Route path="Login" element={<Login />}></Route>
          <Route
            path="Dashboard"
            element={
              <>
                <Sidebar />
                <Dashboard />
              </>
            }
          />
          <Route
            path="User"
            element={
              <>
                <Sidebar />
                <Users />
              </>
            }
          />
          <Route
            path="Role"
            element={
              <>
                <Sidebar />
                <Role />
              </>
            }
          />
          <Route
            path="Post"
            element={
              <>
                <SidebarM />
                <Post />
              </>
            }
          />
          <Route
            path="Court"
            element={
              <>
                <Sidebar />
                <Court />
              </>
            }
          />
          <Route
            path="Area"
            element={
              <>
                <Sidebar />
                <Area />
              </>
            }
          />
          <Route
            path="BookingType"
            element={
              <>
                <Sidebar />
                <BookingType />
              </>
            }
          />
          <Route
            path="Home"
            element={
              <>
                <Header />
                <Home />
                <Footer />
              </>
            }
          />
          <Route
            path="New"
            element={
              <>
                <Header />
                <News />
                <Footer />
              </>
            }
          />
          <Route
            path="AboutUS"
            element={
              <>
                <Header />
                <About />
                <Footer />
              </>
            }
          />
          <Route
            path="ComPay"
            element={
              <>
                <Header />
                <ComPay />
                <Footer />
              </>
            }
          />
          <Route
            path="BookPlay"
            element={
              <>
                <Header />
                <Book />
                <Footer />
              </>
            }
          />
          <Route
            path="BookInfor/:courtId"
            element={
              <>
                <Header />
                <BookInfor />
                <Footer />
              </>
            }
          />
          <Route
            path="NewDetail/:postId"
            element={
              <>
                <Header />
                <NewsDetail />
                <Footer />
              </>
            }
          />
          <Route
            path="UserBooking"
            element={
              <>
                <Header />
                <UserBooking />
                <Footer />
              </>
            }
          />
          <Route
            path="FixedSchedule"
            element={
              <>
                <Header />
                <FixedSchedule />
                <Footer />
              </>
            }
          />
          <Route
            path="OneTimeSchedule"
            element={
              <>
                <Header />
                <OneTimeSchedule />
                <Footer />
              </>
            }
          />
          <Route
            path="FlexibleSchedule"
            element={
              <>
                <Header />
                <FlexibleSchedule />
                <Footer />
              </>
            }
          />
          <Route
            path="CheckIn"
            element={
              <>
                <Header />
                <CheckIn />
                <Footer />
              </>
            }
          />
          <Route
            path="DashboardManager"
            element={
              <>
                <SidebarM />
                <DashboardManager />
              </>
            }
          />
          <Route
            path="Amenity"
            element={
              <>
                <SidebarM />
                <Amenity />
              </>
            }
          />
          <Route
            path="AmenityCourt"
            element={
              <>
                <SidebarM />
                <AmenityCourt />
              </>
            }
          />
          <Route path="EmailVerify" element={<Verify />} />
          <Route
            path="OTPVerify"
            element={<OtpInputWithValidation numberOfDigits={6} />}
          ></Route>
          <Route path="NewPassword" element={<NewPass />}></Route>
          <Route path="Profile/:accountId" element={<Profile />}></Route>
          <Route path="Register" element={<Signup />}></Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
