import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPass, setReEnterPass] = useState("");
  const [userName, setUserName] = useState("");

  // const [errors, setErrors] = useState({
  //   minValueValidation: false,
  //   numberValidation: false,
  //   capitalLetterValidation: false,
  //   specialCharacterValidation: false,
  // });

  // const handlePasswordChange = (event) => {
  //   const newPassword = event.target.value;
  //   setPassword(newPassword);
  //   validatePassword(newPassword);
  // };

  // const validatePassword = (password) => {
  //   setErrors({
  //     minValueValidation: password.length >= 8,
  //     numberValidation: /\d/.test(password),
  //     capitalLetterValidation: /[A-Z]/.test(password),
  //     specialCharacterValidation: /[^A-Za-z0-9]/.test(password),
  //   });
  // };

  const handleRegis = (e) => {
    e.preventDefault();

    if (password !== reEnterPass) {
      toast.error("Passwords do not match");
      return;
    }

    const url = "https://localhost:7088/api/Accounts/Register";
    const data = {
      fullName: fullName,
      phoneNum: phoneNum,
      email: email,
      password: password,
      reEnterPass: reEnterPass,
      userName: userName,
    };

    console.log("API URL:", url);
    console.log("Data to be sent:", data);

    axios
      .post(url, data)
      .then((result) => {
        console.log("Registration success:", result.data); // Log the result data
        clear();
        toast.success("Registered successfully");
      })
      .catch((error) => {
        console.log("Registration error:", error); // Log the error
        toast.error("Registration failed");
      });
  };

  const clear = () => {
    setFullName("");
    setPassword("");
    setPhoneNum("");
    setEmail("");
    setReEnterPass("");
    setUserName("");
  };

  useEffect(() => {
    document.title = "Đăng ký";
  }, []);

  return (
    <div className="loginN">
      <ToastContainer />
      <div className="container-fluid">
        <div className="row justify-content-center mt-3">
          <div className="text-center">
            <p className="lead login">Đăng ký</p>
          </div>
          <div className="text-center" style={{ width: "auto" }}>
            <p className="lead re">Vui lòng nhập thông tin</p>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <form
          className="col-md-8 mt-3 pt-3 pb-3"
          style={{ width: "auto", height: "auto" }}
          onSubmit={handleRegis}
        >
          <div className="form-floating mb-3">
            <input
              id="signupFullName"
              type="text"
              className="form-control"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <label htmlFor="signupFullName" className="form-label">
              Nhập họ tên
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              id="signupUserName"
              type="text"
              className="form-control"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <label htmlFor="signupUserName" className="form-label">
              Nhập tên người dùng
            </label>
          </div>
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
              Nhập email
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              id="signupTel"
              type="text"
              className="form-control"
              placeholder="0989898989"
              value={phoneNum}
              onChange={(e) => setPhoneNum(e.target.value)}
              required
            />
            <label htmlFor="signupTel" className="form-label">
              Nhập số điện thoại
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              id="signupPassword"
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="signupPassword" className="form-label">
              Nhập password
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              id="reEnterPass"
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={reEnterPass}
              onChange={(e) => setReEnterPass(e.target.value)}
              required
            />
            <label htmlFor="reEnterPass" className="form-label">
              Xác nhận mật khẩu
            </label>
          </div>
          {/* {Object.entries(errors).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center gap-4 my-6"
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              {value ? (
                <CorrectIcon wrapperClass="w-4 h-auto text-white text-green-500" />
              ) : (
                <WrongIcon wrapperClass="w-4 h-auto text-white text-red-500" />
              )}
              <p
                className={`text-base font-medium ${
                  value ? "text-green-500" : "text-red-500"
                }`}
              >
                {key === "minValueValidation" &&
                  "Password must be at least 8 characters"}
                {key === "numberValidation" &&
                  "Password must have at least one number"}
                {key === "capitalLetterValidation" &&
                  "Password must have at least one capital letter"}
                {key === "specialCharacterValidation" &&
                  "Password must have at least one special character"}
              </p>
            </div>
          ))} */}
          <div className="d-grid" style={{ margin: "1rem 0" }}>
            <button type="submit" className="btn btn-primary pt-3 pb-3">
              Đăng ký
            </button>
          </div>
          <div className="mt-3 text-center">
            <span>
              Đã có tài khoản? <Link to="/Login">Đăng nhập</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
