import React, { useState, useContext, useEffect } from "react";
import "../css/StyleDashboardManager.css";
import { UserContext } from "../UserContext";
import axios from "axios";

const DashboardManager = () => {
  const [user, setUser] = useState(0);
  const [court, setCourt] = useState(0);
  const [post, setPost] = useState(0);
  const [venue, setVenue] = useState(0);
  const { loginMessage, setLoginMessage } = useContext(UserContext);
  const [noticeVisible, setNoticeVisible] = useState(false);

  React.useEffect(() => {
    let sidebar = document.querySelector(".sidebarM");
    let sidebarBtn = document.querySelector(".sidebarBtn");
    sidebarBtn.onclick = function () {
      sidebar.classList.toggle("active");
      if (sidebar.classList.contains("active")) {
        sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right");
      } else {
        sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
      }
    };
    if (loginMessage) {
      setTimeout(() => {
        setLoginMessage("Login successfully");
      }, 5000);
    }
  }, [loginMessage, setLoginMessage]);

  const handleCloseNotice = () => {
    setNoticeVisible(false);
  };

  useEffect(() => {
    getData();
    document.title = "Manager Dashboard";
  }, []);

  const getData = () => {
    axios
      .get("https://localhost:7088/api/Reports/total-accounts")
      .then((result) => {
        setUser(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDataC();
  }, []);

  const getDataC = () => {
    axios
      .get("https://localhost:7088/api/Reports/Total-Courts")
      .then((result) => {
        setCourt(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDataP();
  }, []);

  const getDataP = () => {
    axios
      .get("https://localhost:7088/api/Reports/total-posts")
      .then((result) => {
        setPost(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDataV();
  }, []);

  const getDataV = () => {
    axios
      .get("https://localhost:7088/api/Reports/Total-Revenue")
      .then((result) => {
        setVenue(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <section className="home-section-M">
      <nav>
        <div className="sidebar-button">
          <i className="bx bx-menu sidebarBtn"></i>
          <span className="dashboard">Dashboard</span>
        </div>
      </nav>

      <div className="home-content-M">
        <div className="overview-boxes">
          <div className="box">
            <div className="right-side">
              <div className="box-topic">Total Users</div>
              <div className="number">{user}</div>
            </div>
            <i className="bx bx-cart-alt cart"></i>
          </div>
          <div className="box">
            <div className="right-side">
              <div className="box-topic">Total Badminton Court</div>
              <div className="number">{court}</div>
            </div>
            <i className="bx bxs-cart-add cart two"></i>
          </div>
          <div className="box">
            <div className="right-side">
              <div className="box-topic">Total Post</div>
              <div className="number">{post}</div>
            </div>
            <i className="bx bx-cart cart three"></i>
          </div>
          <div className="box">
            <div className="right-side">
              <div className="box-topic">Total Venue</div>
              <div className="number">{venue}</div>
            </div>
            <i className="bx bxs-cart-download cart four"></i>
          </div>
          {loginMessage && (
            <div className={`success ${noticeVisible ? "" : "hide"}`}>
              <span className="check">
                <i className="fa fa-check-circle"></i>
              </span>
              <span className="msg">{loginMessage}</span>
              <span className="crose" onClick={handleCloseNotice}>
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardManager;
