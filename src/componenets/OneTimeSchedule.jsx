import React, { useState, useContext, Fragment, useEffect } from "react";
import "../css/StyleDashboardAdmin.css";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../UserContext";

const OneTimeSchedule = () => {
  const [userId, setUserId] = useState("");
  const [playerQuantity, setPlayerQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [slotTimeId, setSlotTimeId] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const { user } = useContext(UserContext);
  const location = useLocation();
  const { slotId, priceAvr } = location.state || {};

  useEffect(() => {
    if (slotId) {
      setSlotTimeId(slotId);
    }
    if (priceAvr) {
      setTotalPrice(priceAvr);
    }
  }, [slotId, priceAvr]);

  useEffect(() => {
    document.title = "Đặt 1 lần chơi";
  }, []);

  const handleSave = () => {
    const url = "https://localhost:7088/api/Bookings/OneTime";
    const data = {
      userId: user.accountId,
      playerQuantity: playerQuantity,
      totalPrice: totalPrice,
      slotTimeId: slotTimeId,
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
        toast.error(error);
        console.log(error);
      });
  };

  const clear = () => {
    setUserId("");
    setSlotTimeId("");
    setPlayerQuantity("");
    setTotalPrice("");
    setNote("");
    setDate("");
  };

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
              placeholder="Enter player quantity"
              id="quantity"
              value={playerQuantity}
              onChange={(e) => setPlayerQuantity(e.target.value)}
            />
            <label htmlFor="quantity" className="form-label">
              Số lượng
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter total price"
              id="price"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
            />
            <label htmlFor="price" className="form-label">
              Tổng tiền
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
              placeholder="Enter date"
              id="date"
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

export default OneTimeSchedule;
