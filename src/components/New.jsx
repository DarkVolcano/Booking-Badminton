import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Rating } from "@aws-amplify/ui-react";

const News = () => {
  const [data, setData] = useState([]);
  const [courtImages, setCourtImages] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    getData();
    document.title = "Tin tức";
  }, []);

  const getData = () => {
    axios
      .get("https://localhost:7088/api/Posts")
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const url = `https://localhost:7088/api/Posts/Search-Post?searchTerm=${search}`;

    axios
      .get(url)
      .then((response) => {
        setData(response.data.items);
        toast.success("Search successfully");
      })
      .catch((error) => {
        console.error("Error searching:", error);
        toast.error("Failed to search courts");
        setData([]);
      });
  };

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
            placeholder="Tìm tin tức"
          />
        </div>
        <div className="d-grid" style={{ margin: "0 12px" }}>
          <button type="submit" className="btn btn-primary">
            Tìm
          </button>
        </div>
      </form>
      {data && data.length > 0 ? (
        data.map((item, index) => {
          return (
            <div className="book-box" key={index}>
              <div className="book-infor">
                <div className="book-text">
                  <div className="book-image"></div>
                  <div className="book-place">{item.context}</div>
                  <div className="book-slot">
                    <NavLink to={`/NewDetail/${item.postId}`}>Xem thêm</NavLink>
                  </div>
                  <Rating
                    value={item.totalRate}
                    maxValue={5}
                    readOnly
                    fillColor="#FFCE00"
                    emptyColor="hsl(210, 5%, 94%)"
                  />
                  <div className="book-con">Nội dung: {item.title}</div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No court available</p>
      )}
    </div>
  );
};

export default News;
