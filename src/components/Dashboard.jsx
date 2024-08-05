import React, { useState, useContext, useEffect, useRef } from "react";
import "../css/Admin.css";
import { UserContext } from "../context/UserContext";
import Chart from "chart.js/auto";
import axios from "axios";
import { Row } from "react-bootstrap";

const Dashboard = () => {
  const [user, setUser] = useState(0);
  const [court, setCourt] = useState(0);
  const [post, setPost] = useState(0);
  const [venue, setVenue] = useState(0);
  const { loginMessage, setLoginMessage } = useContext(UserContext);
  const [noticeVisible, setNoticeVisible] = useState(false);

  const [totalBookings, setTotalBookings] = useState(0);
  const [successfulBookingRate, setSuccessfulBookingRate] = useState(0);
  const [revenueData, setRevenueData] = useState([]);

  const bookingRateChartRef = useRef(null);
  const revenueChartRef = useRef(null);

  React.useEffect(() => {
    let sidebar = document.querySelector(".sidebarA");
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
    fetchData();
    document.title = "Admin Dashboard";
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

  useEffect(() => {
    if (bookingRateChartRef.current && revenueChartRef.current) {
      renderCharts();
    }
  }, [totalBookings, successfulBookingRate, revenueData]);

  const fetchData = () => {
    axios
      .get("https://localhost:7088/api/Reports/total-bookings")
      .then((response) => setTotalBookings(response.data || 0))
      .catch((error) => console.error("Error fetching Total Bookings:", error));

    axios
      .get("https://localhost:7088/api/Reports/successful-booking-rate")
      .then((response) => setSuccessfulBookingRate(response.data || 0))
      .catch((error) =>
        console.error("Error fetching Successful Booking Rate:", error)
      );

    fetchRevenueData();
  };

  const fetchRevenueData = () => {
    axios
      .get("https://localhost:7088/api/Reports/total-revenue-by-month-year")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRevenueData(response.data);
        } else {
          setRevenueData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching Revenue Data:", error);
        setRevenueData([]);
      });
  };

  const renderCharts = () => {
    renderBookingRateChart();
    renderRevenueChart();
  };

  const renderBookingRateChart = () => {
    const ctx = bookingRateChartRef.current.getContext("2d");
    if (ctx) {
      if (bookingRateChartRef.current.chart) {
        bookingRateChartRef.current.chart.destroy();
      }

      bookingRateChartRef.current.chart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Successful Bookings", "Failed Bookings"],
          datasets: [
            {
              label: "Booking Rate",
              data: [successfulBookingRate, 1 - successfulBookingRate],
              backgroundColor: [
                "rgba(54, 162, 235, 0.5)",
                "rgba(255, 99, 132, 0.5)",
              ],
              Color: ["rgb(255,255,255) !important"],
              borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "right",
              labels: {
                boxWidth: 10,
              },
            },
            tooltip: {
              padding: 8,
            },
          },
          layout: {
            padding: {
              left: 0,
              right: -50,
            },
          },
          elements: {
            arc: {
              borderWidth: 0,
            },
          },
        },
      });
    }
  };

  const renderRevenueChart = () => {
    const ctx = revenueChartRef.current.getContext("2d");
    if (ctx) {
      if (revenueChartRef.current.chart) {
        revenueChartRef.current.chart.destroy();
      }

      const labels = revenueData.map((data) => data.monthYear);
      const dataPoints = revenueData.map((data) => data.totalAmount);

      revenueChartRef.current.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Total Revenue",
              data: dataPoints,
              fill: false,
              borderColor: "rgba(54, 162, 235, 0.7)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(54, 162, 235, 1)",
              pointBorderColor: "rgba(54, 162, 235, 1)",
              pointBorderWidth: 1,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
              labels: {
                boxWidth: 12,
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `Revenue: $${tooltipItem.raw}`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                font: {
                  size: 14,
                },
              },
              ticks: {
                font: {
                  size: 14,
                },
              },
            },
            y: {
              title: {
                display: true,
                font: {
                  size: 14,
                },
              },
              ticks: {
                font: {
                  size: 10,
                },
                stepSize: 200000,
                beginAtZero: true,
              },
            },
          },
        },
      });
    }
  };

  return (
    <section className="home-section" style={{ overflow: "hidden" }}>
      <nav>
        <div className="sidebar-button">
          <i className="bx bx-menu sidebarBtn"></i>
          <span className="dashboard">Dashboard</span>
        </div>
      </nav>

      <div className="home-content">
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
          <div className="box">
            <div className="right-side">
              <div className="box-topic">Total Bookings</div>
              <div className="number">{totalBookings}</div>
            </div>
            <i className="bx bxs-cart-download cart four"></i>
          </div>
          <div className="box">
            <div className="right-side">
              <div className="box-topic">Successful Booking Rate</div>
              <div className="number">
                {(successfulBookingRate * 100).toFixed(2)}%
              </div>
              <div className="box-topic">Cancel Booking Rate</div>
              <div className="number">
                {((1 - successfulBookingRate) * 100).toFixed(2)}%
              </div>
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
      <Row className="align-items-center" style={{ padding: "0 20px" }}>
        <div className="chart-container col-sm-5">
          <canvas ref={bookingRateChartRef} id="bookingRateChart"></canvas>
        </div>
        <div
          className="chart-Line col-sm-5 justify-content-end"
          style={{
            padding: "0 20px",
            backgroundColor: "white",
            borderRadius: "15px",
          }}
        >
          <canvas ref={revenueChartRef} id="revenueChart"></canvas>
        </div>
      </Row>
    </section>
  );
};

export default Dashboard;
