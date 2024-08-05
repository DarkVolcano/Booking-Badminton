import { NavLink, Link } from "react-router-dom";
import "../css/StyleDashboardAdmin.css";
import React, { useContext } from "react";
import { UserContext } from "../UserContext";

const Sidebar = () => {
  const { user, logout } = useContext(UserContext);

  React.useEffect(() => {
    let sidebar = document.querySelector(".sidebarA");
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
    <div className="sidebarA">
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
            Admin
          </span>
          <span className="logo_name" style={{ fontSize: "17px" }}>
            {user ? user.accountName : "Minion"}
          </span>
        </div>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/Dashboard">
            <i className="bx bx-grid-alt"></i>
            <span className="links_name">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/User">
            <i className="bx bx-box"></i>
            <span className="links_name">Users</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Role">
            <i className="bx bx-box"></i>
            <span className="links_name">Role</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Court">
            <i className="bx bx-list-ul"></i>
            <span className="links_name">Court</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Area">
            <i className="bx bx-pie-chart-alt-2"></i>
            <span className="links_name">Area</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/BookingType">
            <i className="bx bx-pie-chart-alt-2"></i>
            <span className="links_name">Booking Type</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Post">
            <i className="bx bx-pie-chart-alt-2"></i>
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

export default Sidebar;
