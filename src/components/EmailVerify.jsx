import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Verify = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubEmail = (e) => {
    e.preventDefault();

    const url = `https://localhost:7088/api/Accounts/SendMail?toEmail=${email}`;
    const data = { email: email };

    console.log("API URL:", url);
    console.log("Data to be sent:", data);

    axios
      .post(url, data)
      .then((result) => {
        console.log("Email sent response:", result);
        clear();
        toast.success("Send successfully");
        navigate("/OTPVerify", { state: { email } });
      })
      .catch((error) => {
        console.log(
          "Email send error:",
          error.response ? error.response.data : error.message
        );
        toast.error("Send failed");
      });
  };

  const clear = () => {
    setEmail("");
  };

  useEffect(() => {
    document.title = "Xác thực email";
  }, []);

  return (
    <div className="loginN">
      <ToastContainer />
      <div className="container-fluid">
        <div className="row justify-content-center mt-3">
          <div className="text-center">
            <p className="lead login">Xác thực email</p>
          </div>
          <div className="text-center" style={{ width: "auto" }}>
            <p className="lead re">Vui lòng nhập email</p>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <form
          className="col-md-7 mt-3 pt-3 pb-3"
          style={{ width: "auto", height: "auto" }}
          onSubmit={handleSubEmail}
        >
          <div className="form-floating mb-3">
            <input
              id="signupEmail"
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="signupEmail" className="form-label">
              Email
            </label>
          </div>
          <div className="d-grid" style={{ margin: "1rem 0" }}>
            <button type="submit" className="btn btn-primary pt-3 pb-3">
              Tiếp tục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verify;
