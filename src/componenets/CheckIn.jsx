import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckIn = () => {
  const [bookingDetailId, setBookingDetailId] = useState("");
  const [subCourtId, setSubCourtId] = useState("");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showInputForm, setShowInputForm] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    const url = "https://localhost:7088/api/Bookings/CheckIn";
    const data = {
      bookingDetailId: bookingDetailId,
      subCourtId: subCourtId,
    };

    axios
      .put(url, data)
      .then((result) => {
        clear();
        toast.success("Check in successfully");
        setBookingDetails(result.data);
        setShowInputForm(false);
      })
      .catch((error) => {
        toast.error("Error checking in");
        console.log(error);
      });
  };

  const clear = () => {
    setBookingDetailId("");
    setSubCourtId("");
  };

  useEffect(() => {
    document.title = "Thủ tục Check In";
  }, []);

  return (
    <div className="body-staff">
      <ToastContainer />
      <div className="check-in">THỦ TỤC CHECK IN</div>
      {showInputForm && (
        <form className="check-input" onSubmit={handleSave}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="outputCourtid"
              placeholder="Court id"
              value={bookingDetailId}
              onChange={(e) => setBookingDetailId(e.target.value)}
            ></input>
            <label htmlFor="outputCourtid" className="form-label">
              Booking id
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="outputBookingid"
              placeholder="Booking id"
              value={subCourtId}
              onChange={(e) => setSubCourtId(e.target.value)}
            ></input>
            <label htmlFor="outputBookingid" className="form-label">
              Subcourt id
            </label>
          </div>
          <button className="btn btn-primary" type="submit">
            Tiếp tục
          </button>
        </form>
      )}
      {bookingDetails && !showInputForm && (
        <form className="check-input">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="outputCourtid"
              placeholder="Court id"
              value={bookingDetails.customerName}
              disabled
            ></input>
            <label htmlFor="outputCourtid" className="form-label">
              Tên khách hàng
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="outputCourtid"
              placeholder="Court id"
              value={bookingDetails.fullName}
              disabled
            ></input>
            <label htmlFor="outputCourtid" className="form-label">
              Họ & Tên
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="outputCourtid"
              placeholder="Court id"
              value={bookingDetails.courtName.trim()}
              disabled
            ></input>
            <label htmlFor="outputCourtid" className="form-label">
              Sân
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="outputBookingid"
              placeholder="Booking id"
              value={bookingDetails.subCourtName.trim()}
              disabled
            ></input>
            <label htmlFor="outputBookingid" className="form-label">
              Sân nhỏ
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="outputBookingid"
              placeholder="Booking id"
              value={bookingDetails.slotTimeStart.trim()}
              disabled
            ></input>
            <label htmlFor="outputBookingid" className="form-label">
              Thời gian bắt đầu
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="outputBookingid"
              placeholder="Booking id"
              value={bookingDetails.slotTimeEnd.trim()}
              disabled
            ></input>
            <label htmlFor="outputBookingid" className="form-label">
              Thời gian kết thúc
            </label>
          </div>
        </form>
      )}
    </div>
  );
};

export default CheckIn;
