import { NavLink, Link } from "react-router-dom";
import "../css/StyleDashboardManager.css";
import React, { useContext } from "react";
import { UserContext } from "../UserContext";

const SidebarM = () => {
  const { user, logout } = useContext(UserContext);

  React.useEffect(() => {
    let sidebar = document.querySelector(".sidebarM");
    let sidebarBtn = document.querySelector(".sidebarBtn");
    sidebarBtn.onclick = function () {
      sidebar.classList.toggle("active");
      if (sidebar.classList.contains("active")) {
        sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right");
      } else {
        sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
      }
    };
  }, []);

  return (
    <div className="sidebarM">
      <div className="logo-details">
        <i className="bx bxl-c-plus-plus"></i>
        <span className="logo_name">RacketUp</span>
      </div>
      <div className="logo-details">
        <img
          src="https://i.postimg.cc/cCh8vxk4/minion.png"
          width="28"
          height="28"
          style={{ margin: "0 16px 0 31px" }}
          alt="Minion logo"
        />
        <div style={{ display: "grid" }}>
          <span className="logo_name" style={{ fontSize: "12px" }}>
            Manager
          </span>
          <span className="logo_name" style={{ fontSize: "17px" }}>
            {user ? user.accountName : "Minion"}
          </span>
        </div>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/DashboardManager">
            <i className="bx bx-grid-alt"></i>
            <span className="links_name">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Amenity">
            <i className="bx bx-box"></i>
            <span className="links_name">Amenity</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/AmenityCourt">
            <i className="bx bx-box"></i>
            <span className="links_name">Amenity Court</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Post">
            <i className="bx bx-box"></i>
            <span className="links_name">Post</span>
          </NavLink>
        </li>
        <li className="log_out">
          <Link to="/Login" onClick={logout}>
            <i className="bx bx-log-out"></i>
            <span className="links_name">Log out</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarM;
