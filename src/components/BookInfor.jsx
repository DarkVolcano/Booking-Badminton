import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar } from "@progress/kendo-react-dateinputs";
import { UserContext } from "../UserContext";
import { format } from "date-fns";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";

const BookInfor = (props) => {
  const [bookingDate, setBookingDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingTimes, setBookingTimes] = useState([]);
  const timeSlotCacheRef = useRef(new Map());
  const [slotTimes, setSlotTimes] = useState([]);
  const { courtId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [context, setContext] = useState("");
  const [image, setImage] = useState("");

  const [selectedSubCourtId, setSelectedSubCourtId] = useState(null);

  const [court, setCourt] = useState({
    courtName: "",
    openTime: "",
    closeTime: "",
    rules: "",
    image: "",
    title: "",
    priceAvr: "",
    number: "",
    startTime: "",
    endTime: "",
    amenityId: "",
    // subCourts: [],
  });

  const [courtImage, setCourtImage] = useState("");
  const [userImage, setUserImage] = useState("");

  useEffect(() => {
    axios
      .get(`https://localhost:7088/api/Courts/${courtId}`)
      .then((response) => {
        const data = response.data;
        setCourt({
          courtName: data.courtName,
          openTime: data.openTime,
          closeTime: data.closeTime,
          rules: data.rules,
          image: data.image,
          title: data.title,
          priceAvr: data.priceAvr,
          number: data.number,
          startTime: data.startTime,
          endTime: data.endTime,
          amenityId: data.amenityId,
        });
        const subCourtSlotTimes = data.subCourts.flatMap((subCourt) =>
          subCourt.slotTimes.map((slot) => ({
            slotId: slot.slotId,
            startTime: slot.startTime.trim(),
            endTime: slot.endTime.trim(),
          }))
        );
        setSlotTimes(subCourtSlotTimes);
      })
      .catch((error) => {
        console.error("Error fetching court data:", error);
      });
  }, [courtId]);
  // useEffect(() => {
  //   axios
  //     .get(`https://localhost:7088/api/Courts/${courtId}`)
  //     .then((response) => {
  //       const data = response.data;
  //       setCourt({
  //         courtName: data.courtName,
  //         openTime: data.openTime,
  //         closeTime: data.closeTime,
  //         rules: data.rules,
  //         image: data.image,
  //         title: data.title,
  //         priceAvr: data.priceAvr,
  //         number: data.number,
  //         startTime: data.startTime,
  //         endTime: data.endTime,
  //         amenityId: data.amenityId,
  //         subCourts: data.subCourts,
  //       });
  //       if (response.data.subCourts.length > 0) {
  //         setSelectedSubCourtId(response.data.subCourts[0].subCourtId);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching court data:", error);
  //     });
  // }, [courtId]);

  useEffect(() => {
    axios
      .get(`https://localhost:7088/api/Courts/${courtId}/Image`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        setCourtImage(url);
      })
      .catch((error) => {
        console.error("Error fetching court image:", error);
      });
  }, [courtId]);

  useEffect(() => {
    axios
      .get(`https://localhost:7088/api/Accounts/${user.accountId}/Image`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        setUserImage(url);
      })
      .catch((error) => {
        console.error("Error fetching court image:", error);
      });
  }, [user.accountId]);

  useEffect(() => {
    // Bail out if there is no date selected
    if (!bookingDate) return;

    // Get time slots from cache
    let newBookingTimes = timeSlotCacheRef.current.get(
      bookingDate.toDateString()
    );

    // If we have no cached time slots then pick new ones
    if (!newBookingTimes) {
      newBookingTimes = slotTimes.map((slot) => ({
        slotId: slot.slotId,
        time: `${slot.startTime} - ${slot.endTime}`,
      }));
      // Update cache with new time slots for the selected date
      timeSlotCacheRef.current.set(bookingDate.toDateString(), newBookingTimes);
    }

    setBookingTimes(newBookingTimes);
  }, [bookingDate, slotTimes]);
  // useEffect(() => {
  //   if (selectedSubCourtId && bookingDate) {
  //     axios
  //       .get(
  //         `https://localhost:7088/api/Courts/${courtId}/SlotTimes?date=${format(
  //           bookingDate,
  //           "dd/MM/yyyy"
  //         )}&subCourtId=${selectedSubCourtId}`
  //       )
  //       .then((response) => {
  //         setSlotTimes(response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching slot times:", error);
  //       });
  //   }
  // }, [courtId, bookingDate, selectedSubCourtId]);

  const onDateChange = (e) => {
    setSelectedTimeSlot(null);
    setBookingDate(e.value);
  };

  const handleTimeSlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    handleUserBooking(timeSlot);
  };

  // const onDateChange = (e) => {
  //   setSelectedTimeSlot(null);
  //   setBookingDate(new Date(e.target.value));
  //   setSelectedTimeSlot(null);
  // };

  // const handleSubCourtChange = (subCourtId) => {
  //   setSelectedSubCourtId(subCourtId);
  // };

  // const handleTimeSlotClick = (timeSlot) => {
  //   setSelectedTimeSlot(timeSlot);
  //   navigate(`/UserBooking`, {
  //     state: {
  //       courtId,
  //       accountId: user.accountId,
  //       bookingDate: format(bookingDate, "dd/MM/yyyy"),
  //       selectedTimeSlot: `${timeSlot.startTime.trim()} - ${timeSlot.endTime.trim()}`,
  //       priceAvr: court.priceAvr,
  //       slotId: timeSlot.slotId,
  //     },
  //   });
  // };

  // const isSlotBooked = (timeSlot) => {
  //   return timeSlot.isBooked;
  // };

  const handleUserBooking = (timeSlot) => {
    if (user && timeSlot) {
      console.log("bookingDate:", format(bookingDate, "yyyy-MM-dd"));

      navigate(`/UserBooking`, {
        state: {
          courtId,
          accountId: user.accountId,
          bookingDate: format(bookingDate, "yyyy-MM-dd"),
          selectedTimeSlot: timeSlot.time,
          priceAvr: court.priceAvr,
          slotId: timeSlot.slotId,
        },
      });
    }
  };

  const getComments = () => {
    axios
      .get(`https://localhost:7088/api/Comments/by-court/${courtId}`)
      .then((result) => {
        setComments(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSave = () => {
    const url = "https://localhost:7088/api/Comments";
    const commentData = {
      userId: user.accountId,
      context: context,
      image: image,
      courtId: courtId,
    };

    axios
      .post(url, commentData)
      .then((response) => {
        getComments();
        clearCourt();
        toast.success("Comment successfully added");
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
        toast.error("Failed to add comment");
      });
  };

  const clearCourt = () => {
    setContext("");
    setImage("");
  };

  const clear = () => {
    setContext("");
    setImage(""); // Optionally clear image state if needed
  };

  useEffect(() => {
    document.title = "Thông tin sân chi tiết";
  }, []);

  const formattedBookingDate = bookingDate
    ? format(bookingDate, "dd/MM/yyyy")
    : "";

  return (
    <>
      <ToastContainer />
      <div className="court-name">{court.courtName}</div>
      <div
        style={{
          display: "grid",
          justifyContent: "center",
          gridTemplateColumns: "50% 50%",
          margin: "0 112px",
        }}
      >
        <div className="book-image">
          {courtImage ? (
            <img src={courtImage} alt="court" />
          ) : (
            <div>Loading image...</div>
          )}
        </div>
        <div className="full-infor">
          <div className="court-con">THÔNG TIN SÂN</div>
          <div className="time">
            Thời gian: {court.openTime + " - " + court.closeTime}
          </div>
          <div className="priceavr">Giá: {court.priceAvr}VND</div>
        </div>
        <div className="choose-slot"></div>
        <div className="amenity"></div>
      </div>
      <div className="tooltip-container">
        <span className="tooltip">
          <span style={{ display: "flex", margin: "3px" }}>
            <strong className="available"></strong> : Available
            <strong className="unavailable"></strong> : Unavailable
          </span>
        </span>
        <span className="text">?</span>
      </div>
      <div>
        <div className="k-my-8">
          <div className="k-mb-4 k-font-weight-bold">Choose slot</div>

          <div className="k-flex k-display-flex k-mb-4">
            <Calendar value={bookingDate} onChange={onDateChange} />
            <div
              className="k-ml-4 k-display-flex k-flex-col"
              style={{ display: "block", width: "475px" }}
            >
              {bookingTimes.map((timeSlot) => (
                <button
                  key={timeSlot.slotId}
                  className="k-button k-mb-4 col-md-3"
                  onClick={() => handleTimeSlotClick(timeSlot)}
                >
                  {timeSlot.time}
                </button>
              ))}
            </div>
            {/* <div className="subcourt-buttons">
              {court.subCourts.map((subCourt) => (
                <Button
                  key={subCourt.subCourtId}
                  variant={
                    selectedSubCourtId === subCourt.subCourtId
                      ? "success"
                      : "warning"
                  }
                  onClick={() => handleSubCourtChange(subCourt.subCourtId)}
                >
                  {subCourt.number}
                </Button>
              ))}
            </div>
            <div className="timeslots-container">
              {slotTimes.map((timeSlot) => (
                <Button
                  key={timeSlot.slotId}
                  className="timeslot-button"
                  variant={isSlotBooked(timeSlot) ? "secondary" : "primary"}
                  onClick={() => handleTimeSlotClick(timeSlot)}
                  disabled={isSlotBooked(timeSlot)}
                >
                  {`${timeSlot.startTime} - ${timeSlot.endTime}`}
                </Button>
              ))}
            </div>*/}
          </div>

          {bookingDate && selectedTimeSlot ? (
            <div>
              Selected slot: {formattedBookingDate} at {selectedTimeSlot.time}
            </div>
          ) : null}
        </div>
      </div>
      <div className="full-infor" style={{ margin: "63px 138px" }}>
        <div className="court-con">Quy định</div>
        <div className="rule" style={{ marginTop: "11px" }}>
          {court.rules}
        </div>
      </div>
      <InputGroup style={{ justifyContent: "center", marginBottom: "40px" }}>
        <InputGroup.Text>
          {userImage ? (
            <img
              src={userImage}
              alt="User"
              style={{ width: "30px", height: "30px" }}
            />
          ) : (
            <div
              style={{ width: "30px", height: "30px", backgroundColor: "gray" }}
            ></div>
          )}
        </InputGroup.Text>
        <div className="col-sm-9">
          <Form.Control
            as="textarea"
            aria-label="With textarea"
            rows={4}
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
          <Button variant="primary float-end mt-2" onClick={handleSave}>
            Bình luận
          </Button>
        </div>
      </InputGroup>

      <div className="comments-section">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <InputGroup
              style={{ justifyContent: "center", marginBottom: "40px" }}
            >
              <InputGroup.Text>
                {userImage ? (
                  <img
                    src={userImage}
                    alt="User"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "20px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "gray",
                    }}
                  ></div>
                )}
              </InputGroup.Text>
              <div className="col-sm-9">
                <div className="col-sm-9 fw-bold fst-italic">
                  {user.accountName}
                </div>
              </div>
              <div className="col-sm-9">{comment.context}</div>
            </InputGroup>
          ))
        ) : (
          <p>No comments available</p>
        )}
      </div>
    </>
  );
};

export default BookInfor;
