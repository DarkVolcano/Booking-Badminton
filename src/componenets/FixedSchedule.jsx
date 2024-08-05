import React, { useState, useContext, Fragment, useEffect } from "react";
import "../css/StyleDashboardAdmin.css";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../UserContext";

const FixedSchedule = () => {
  const [userId, setUserId] = useState("");
  const [slotTimeId, setSlotTimeId] = useState("");
  const [months, setMonths] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const { user } = useContext(UserContext);
  const location = useLocation();
  const { slotId, bookingDate } = location.state || {};

  useEffect(() => {
    if (slotId) {
      setSlotTimeId(slotId);
    }
    if (bookingDate) {
      setDate(bookingDate); // Set bookingDate to date state
    }
  }, [slotId, bookingDate]);

  const handleSave = () => {
    console.log("userId: ", user.accountId);
    console.log("slotTimeId: ", slotTimeId);
    console.log("months: ", months);
    console.log("note: ", note);
    console.log("date: ", date);

    const url = "https://localhost:7088/api/Bookings/Fixed";
    const data = {
      userId: user.accountId,
      slotTimeId: slotTimeId,
      months: parseInt(months),
      note: note,
      date: date,
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
        if (error.response) {
          toast.error(error.response.data.message); // Display backend error message
          console.log(error.response.data); // Log detailed error response from backend
        } else {
          toast.error("Failed to make booking"); // Fallback error message
          console.log(error);
        }
      });
  };

  const clear = () => {
    setUserId("");
    setSlotTimeId("");
    setMonths("");
    setNote("");
    setDate("");
  };

  useEffect(() => {
    document.title = "Fixed Schedule";
  }, []);

  const handlePayment = (bookingId) => {
    const url = `https://localhost:7088/api/Payments/create-payment?bookingId=${bookingId}`;

    axios
      .post(url)
      .then((response) => {
        const paymentUri = response.data.data.uri;
        toast.success("Payment initiated successfully");
        if (paymentUri) {
          window.open(paymentUri, "_blank");
        } else {
          console.error("Payment URI not found in the response");
          toast.error("Payment URI not found");
        }
      })
      .catch((error) => {
        console.error("Error initiating payment:", error);
        toast.error("Failed to initiate payment");
      });
  };

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
              value={user.accountId}
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
              placeholder="Enter slottimeid"
              id="slotTimeId"
              value={slotTimeId}
              onChange={(e) => setSlotTimeId(e.target.value)}
            />
            <label htmlFor="slotTimeId" className="form-label">
              Nhập slottimeid
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter months"
              id="month"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            />
            <label htmlFor="month" className="form-label">
              Số tháng chơi
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter note"
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <label htmlFor="note" className="form-label">
              Ghi chú
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="date"
              className="form-control mb-3"
              placeholder="yyyy-MM-dd"
              id="date"
              dateformat="yyyy-MM-dd"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <label htmlFor="date" className="form-label">
              Ngày chơi
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

export default FixedSchedule;
