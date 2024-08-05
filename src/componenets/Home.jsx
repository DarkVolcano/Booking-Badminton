import React, { useEffect, useState } from "react";
import "../css/StyleHome.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Home = () => {
  const [data, setData] = useState([]);
  const [areas, setAreas] = useState([]);
  const [search, setSearch] = useState("");
  const [areaId, setAreaId] = useState("");
  const [courtImages, setCourtImages] = useState({});

  useEffect(() => {
    getData();
    fetchArea();
    document.title = "Trang chủ";
  }, []);

  const getData = () => {
    axios
      .get("https://localhost:7088/api/Courts")
      .then((result) => {
        setData(result.data);
        result.data.forEach((court) => {
          fetchCourtImage(court.courtId);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchCourtImage = (courtId) => {
    axios
      .get(`https://localhost:7088/api/Courts/${courtId}/Image`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        setCourtImages((prevImages) => ({
          ...prevImages,
          [courtId]: url,
        }));
      })
      .catch((error) => {
        console.error("Error fetching court image:", error);
      });
  };

  const fetchArea = () => {
    axios
      .get("https://localhost:7088/api/Areas")
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const url = `https://localhost:7088/api/Courts/Search-Court?searchTerm=${search}&areaId=${areaId}`;

    axios
      .get(url)
      .then((response) => {
        setData(response.data.items);
        toast.success("Search successfully");
        response.data.items.forEach((court) => {
          fetchCourtImage(court.courtId);
        });
      })
      .catch((error) => {
        console.error("Error searching:", error);
        toast.error("Failed to search courts");
        setData([]);
      });
  };

  return (
    <div className="allBody">
      <ToastContainer />
      <div className="body">
        <h1>Xin chào !</h1>
        <h3>Đặt lịch thi đấu cầu lông với RacketUp</h3>
        <form style={{ display: "flex" }} onSubmit={handleSearch}>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="inputPlace"
              placeholder="Tìm sân"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            ></input>
            <label htmlFor="inputPlace" className="form-label">
              Tìm sân
            </label>
          </div>
          <div className="form-floating">
            <select
              className="form-control mb-3"
              id="selectType"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
            >
              <option value="">Chọn khu vực</option>
              {areas.map((area) => (
                <option key={area.areaId} value={area.areaId}>
                  {area.location}
                </option>
              ))}
            </select>
            <label htmlFor="selectType" className="form-label">
              Tìm khu vực
            </label>
          </div>
          <button style={{ width: "58px" }} type="submit">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M22 22L20 20"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>

      {data && data.length > 0 ? (
        data.map((item, index) => {
          const area = areas.find((area) => area.areaId === item.areaId);
          return (
            <div className="book-box" key={index}>
              <div className="book-infor">
                <div className="book-text">
                  <div className="book-place">{item.courtName}</div>
                  <div className="book-slot">
                    {item.openTime} - {item.closeTime}
                  </div>
                  <div className="book-price">
                    Giá tham khảo: {item.priceAvr} VND
                  </div>
                  <div className="book-con">
                    Khu vực: {area ? area.location : "Unknown"}
                  </div>
                  <div className="book-con">Địa chỉ: {item.address}</div>
                  <div className="book-con">
                    Tiêu chuẩn sân: Tiêu chuẩn quốc tế
                  </div>
                </div>
                <div className="book-image">
                  {courtImages[item.courtId] ? (
                    <img src={courtImages[item.courtId]} alt="court" />
                  ) : (
                    <div>Loading image...</div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      )}

      <div className="comment">
        <h1
          style={{
            margin: "0 36px",
            color: "white",
            marginBottom: "60px",
            fontSize: "34px",
          }}
        >
          Trải nghiệm khách hàng
        </h1>
        <div className="commentbox" style={{ display: "flex" }}>
          <div className="comment1">
            <h3>Bảo Kha</h3>
            <h5>
              The badminton court is very clean and cool,bringing me many
              interesting experiences
            </h5>
          </div>
          <div className="comment1">
            <h3>Bảo Kha</h3>
            <h5>
              I really love the service at the court...i spent alot òf time
              playing with my family
            </h5>
          </div>
          <div className="comment1">
            <h3>Bảo Kha</h3>
            <h5>
              I love the professionalism of the court booking process and the
              wonderful experiences at the court
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
