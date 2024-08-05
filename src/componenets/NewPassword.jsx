import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const NewPass = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user } = useContext(UserContext);

  const handlePassword = () => {
    const url = `https://localhost:7088/api/Accounts/UpdatePass/${email}`;
    const data = {
      email: email,
      newPassword: password,
      reEnterPassword: confirmPassword,
    };

    axios
      .put(url, data)
      .then((response) => {
        console.log("New Password", response);
        toast.success("Password updated successfully");
        navigate("/Login");
      })
      .catch((error) => {
        console.error("Password error:", error);
        if (error.response) {
          console.error("Response Data:", error.response.data);
        }
        toast.error("Failed to update password. Please try again.");
      });
  };

  useEffect(() => {
    document.title = "Đặt lại mật khẩu mới";
  }, []);

  return (
    <div className="loginN">
      <ToastContainer />
      <div className="container-fluid">
        <div className="row justify-content-center mt-3">
          <div className="text-center">
            <p className="lead login">Enter new password</p>
          </div>
          <div className="text-center" style={{ width: "auto" }}>
            <p className="lead re">Please enter new password</p>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <form
          className="col-md-7 mt-3 pt-3 pb-3"
          style={{ width: "auto", height: "auto" }}
        >
          <div className="form-floating mb-3">
            <input
              id="signupPassword"
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <label htmlFor="signupPassword" className="form-label">
              Password
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              id="confirmPassword"
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
          </div>
          <div className="d-grid" style={{ margin: "1rem 0" }}>
            <button
              type="button"
              className="btn btn-primary pt-3 pb-3"
              onClick={handlePassword}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPass;
