import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { format } from "date-fns";

const UserBooking = () => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { slotId, bookingDate, priceAvr } = location.state || {};
  const [bookingTypeId, setBookingTypeId] = useState("");

  useEffect(() => {
    getData();
    document.title = "Loại hình đặt lịch";
  }, []);

  const getData = async () => {
    try {
      const result = await axios.get("https://localhost:7088/api/BookingTypes");
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleContinue = () => {
    if (bookingTypeId === "1") {
      navigate("/FixedSchedule", {
        state: {
          slotId: slotId,
          bookingDate: format(bookingDate, "yyyy-MM-dd"),
        },
      });
    } else if (bookingTypeId === "2") {
      navigate("/OneTimeSchedule", {
        state: {
          slotId: slotId,
          priceAvr: priceAvr,
        },
      });
    } else {
      navigate("/FlexibleSchedule");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="body-staff">
      <div className="check-in">VUI LÒNG CHỌN THÔNG TIN</div>
      <form className="check-input">
        <div className="form-floating mb-3">
          <select
            className="form-control mb-3"
            id="selectType"
            value={bookingTypeId}
            onChange={(e) => setBookingTypeId(e.target.value)}
          >
            <option value="">Select bookingType</option>
            {data.map((bookingType) => (
              <option
                key={bookingType.bookingTypeId}
                value={bookingType.bookingTypeId.toString()}
              >
                {bookingType.description}
              </option>
            ))}
          </select>
          <label htmlFor="selectType" className="form-label">
            Loại hình đặt lịch
          </label>
        </div>
        <Button variant="primary" onClick={handleGoBack}>
          Quay lại
        </Button>
        <Button
          variant="primary"
          onClick={handleContinue}
          style={{ float: "right" }}
        >
          Tiếp tục
        </Button>
      </form>
    </div>
  );
};

export default UserBooking;
