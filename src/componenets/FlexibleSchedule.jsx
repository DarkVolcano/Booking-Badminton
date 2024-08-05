import React, { useState, useContext, Fragment, useEffect } from "react";
import "../css/StyleDashboardAdmin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../UserContext";

const FlexibleSchedule = () => {
  const { user, court } = useContext(UserContext);
  const [userId, setUserId] = useState("");
  const [courtId, setCourtId] = useState("");
  const [totalHours, setTotalHours] = useState("");

  useEffect(() => {
    if (user) {
      setUserId(user.accountId);
    }
    if (court) {
      setCourtId(court.courtId);
    }
  }, [user, court]);

  const handleSave = () => {
    const url = "https://localhost:7088/api/Bookings/Flexible";
    const data = {
      userId: userId,
      courtId: courtId,
      totalHours: totalHours,
    };

    axios
      .post(url, data)
      .then((result) => {
        const bookingId = result.data.bookingId;
        toast.success("Booking successfully");
        handlePayment(bookingId);
        clear();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setTotalHours("");
  };

  const handlePayment = (bookingId) => {
    const url = `https://localhost:7088/api/Payments/create-payment?bookingId=${bookingId}`;

    axios
      .post(url)
      .then((response) => {
        const paymentUri = response.data.data.uri;
        if (paymentUri) {
          window.open(paymentUri, "_blank");
        } else {
          toast.error("Payment URI not found");
        }
      })
      .catch((error) => {
        toast.error("Failed to initiate payment");
      });
  };

  useEffect(() => {
    document.title = "Flexible Schedule";
  }, []);

  return (
    <>
      <Fragment>
        <ToastContainer />
        <div className="check-in">VUI LÒNG NHẬP THÔNG TIN</div>
        <form className="check-input">
          <div className="form-floating mb-3" style={{ display: "none" }}>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter userid"
              id="userid"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <label htmlFor="userid" className="form-label">
              Nhập userId
            </label>
          </div>
          <div className="form-floating mb-3" style={{ display: "none" }}>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter courtid"
              id="courtid"
              value={courtId}
              onChange={(e) => setCourtId(e.target.value)}
            />
            <label htmlFor="courtid" className="form-label">
              Nhập courtid
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter hours"
              id="hour"
              value={totalHours}
              onChange={(e) => setTotalHours(e.target.value)}
            />
            <label htmlFor="hour" className="form-label">
              Tổng giờ chơi
            </label>
          </div>
          <Button variant="primary" onClick={handleSave}>
            Tiếp tục
          </Button>
        </form>
      </Fragment>
    </>
  );
};

export default FlexibleSchedule;
