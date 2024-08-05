import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";
import { Rating } from "@aws-amplify/ui-react";

const Book = () => {
  const [data, setData] = useState([]);
  const [areas, setAreas] = useState([]);
  const [search, setSearch] = useState("");
  const { setCourt } = useContext(UserContext);
  const [courtImages, setCourtImages] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    getData();
    fetchArea();
    document.title = "Đặt lịch";
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
    const url = `https://localhost:7088/api/Courts/Search-Court?searchTerm=${search}`;

    axios
      .get(url)
      .then((response) => {
        setData(response.data.items);
        toast.success("Search successfully");
        response.data.items.forEach((court) => {
          fetchCourtImage(court.courtId);
        });
        setCurrentPage(1); // Reset to first page on search
      })
      .catch((error) => {
        console.error("Error searching:", error);
        toast.error("Failed to search courts");
        setData([]);
      });
  };

  const handleBookingClick = (court) => {
    setCourt(court);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the items to be displayed on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="body-book">
      <ToastContainer />
      <form
        className="col-md-4"
        style={{
          width: "auto",
          height: "auto",
          display: "flex",
          justifyContent: "center",
          maxWidth: "100%",
          marginTop: "60px",
        }}
        onSubmit={handleSearch}
      >
        <div className="form-floating col-md-5">
          <input
            id="searchTerm"
            type="search"
            className="form-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
            placeholder="Search court name"
          />
        </div>
        <div className="d-grid" style={{ margin: "0 12px" }}>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>
      {currentItems && currentItems.length > 0 ? (
        currentItems.map((item, index) => {
          const area = areas.find((area) => area.areaId === item.areaId);
          return (
            <div className="book-box" key={index}>
              <div className="book-infor">
                <div className="book-text">
                  <div className="book-place">{item.courtName}</div>
                  <div className="book-slot">
                    {item.openTime} - {item.closeTime}
                    <NavLink
                      to={`/BookInfor/${item.courtId}`}
                      onClick={() => handleBookingClick(item)}
                    >
                      Đặt ngay
                    </NavLink>
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
                  <Rating
                    value={item.totalRate}
                    maxValue={5}
                    readOnly
                    fillColor="#FFCE00"
                    emptyColor="hsl(210, 5%, 94%)"
                  />
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
        <p>No court available</p>
      )}

      {data.length > itemsPerPage && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Book;
