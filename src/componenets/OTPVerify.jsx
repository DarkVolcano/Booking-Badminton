import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function OtpInputWithValidation({ numberOfDigits }) {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const [otpError, setOtpError] = useState(null);
  const otpBoxReference = useRef([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOtpError(null); // Reset error message on OTP change
  }, [otp]);

  useEffect(() => {
    document.title = "Xác thực OTP";
  }, []);

  function handleChange(value, index) {
    if (!isNaN(value) && value.length === 1) {
      let newArr = [...otp];
      newArr[index] = value;
      setOtp(newArr);

      if (index < numberOfDigits - 1) {
        otpBoxReference.current[index + 1].focus();
      }
    } else if (value.length === 0) {
      let newArr = [...otp];
      newArr[index] = "";
      setOtp(newArr);
    }
  }

  function handleBackspaceAndEnter(e, index) {
    if (e.key === "Backspace" && index > 0) {
      otpBoxReference.current[index - 1].focus();
    }
    if (e.key === "Enter") {
      handleSubOTP();
    }
  }

  const handleSubOTP = () => {
    const enteredOTP = otp.join("");
    const url = "https://localhost:7088/api/Accounts/VerifyOtp";
    const data = {
      email: email,
      otp: enteredOTP,
    };

    setLoading(true);

    axios
      .post(url, data)
      .then((response) => {
        console.log("OTP Verification Response:", response);
        setLoading(false);
        toast.success("OTP verified successfully");
        navigate("/NewPassword", { state: { email } });
      })
      .catch((error) => {
        console.error("OTP Verification Error:", error);
        setLoading(false);
        if (error.response) {
          console.error("Response Data:", error.response.data);
        }
        toast.error("Failed to verify OTP. Please try again.");
      });
  };

  return (
    <div className="loginN">
      <ToastContainer />
      <div className="container-fluid">
        <div className="row justify-content-center mt-3">
          <div className="text-center">
            <p className="lead login">Xác thưc OTP</p>
          </div>
          <div className="text-center" style={{ width: "auto" }}>
            <p className="lead re">Nhập OTP đã gửi đến điện thoại</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            value={digit}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
            ref={(ref) => (otpBoxReference.current[index] = ref)}
            className="border w-20 h-auto text-black p-3 rounded-md block bg-white focus:border-2 focus:outline-none appearance-none"
          />
        ))}
      </div>
      <p className={`text-lg text-black mt-4 ${otpError ? "error-show" : ""}`}>
        {otpError}
      </p>
      <div className="d-grid" style={{ margin: "1rem 0" }}>
        <button
          onClick={handleSubOTP}
          className={`btn btn-primary pt-3 pb-3 ${loading ? "disabled" : ""}`}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default OtpInputWithValidation;
