import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

const clientId =
  "242000824863-hdrd5enmg6b0hg1pbn1pe0asvset9r14.apps.googleusercontent.com";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

  const navigate = useNavigate();

  const loginWithUsernameAndPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `https://localhost:7088/api/Accounts/Login?email=${email}&pass=${password}`
      );
      const user = response.data;

      if (user) {
        setUser(user);
        if (user.roleId === 1) {
          navigate("/Dashboard");
        } else if (user.roleId === 4) {
          navigate("/DashboardManager");
        } else {
          navigate("/Home");
        }
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };

  const handleCallbackResponse = async (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    const userObject = jwtDecode(response.credential);
    console.log(userObject);

    try {
      const googleLoginResponse = await axios.post(
        `https://localhost:7088/api/Accounts/GoogleLogin`,
        {
          token: response.credential,
        }
      );

      const user = googleLoginResponse.data;

      if (user) {
        setUser(user);
        navigate("/Home");
      } else {
        toast.error("Failed to log in with Google");
      }
    } catch (error) {
      toast.error("Failed to log in with Google");
    }
  };

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });

    google.accounts.id.prompt();
  }, []);

  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  return (
    <div className="loginN">
      <ToastContainer />
      <div className="container-fluid">
        <div className="row justify-content-center mt-3">
          <div className="text-center">
            <p className="lead login">Đăng nhập</p>
          </div>
          <div className="text-center" style={{ width: "auto" }}>
            <p className="lead re">Vui lòng nhập email và mật khẩu</p>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <form
          className="col-md-8 mt-3 pt-3 pb-3"
          onSubmit={loginWithUsernameAndPassword}
          style={{ width: "auto", height: "auto" }}
        >
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email
            </label>
          </div>
          <div className="form-floating mb-3 flex" style={{ display: "flex" }}>
            <input
              type={type}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <span
              class="flex justify-around items-center"
              onClick={handleToggle}
              style={{ position: "absolute", right: 0, margin: "16px" }}
            >
              <Icon class="absolute mr-10" icon={icon} size={25} />
            </span>
            <label htmlFor="exampleInputPassword1" className="form-label">
              Mật khẩu
            </label>
          </div>
          <div className="mt-3" style={{ textAlign: "right" }}>
            <span>
              <Link to="/EmailVerify" className="forgot">
                Quên mật khẩu?
              </Link>
            </span>
          </div>
          <div className="d-grid" style={{ margin: "1rem 0" }}>
            <button type="submit" className="btn btn-primary pt-3 pb-3">
              Đăng nhập
            </button>
          </div>
          <div className="or">Hoặc</div>
          <div id="signInDiv"></div>
          <div className="mt-3 text-center">
            <span>
              Đăng ký tài khoản? <Link to="/Register">Đăng ký</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
