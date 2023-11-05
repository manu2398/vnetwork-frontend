import React from "react";

import { useLocation, Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import { logout } from "../../store/reducers/authReducer";

import Avatar from "../Avatar";
import NotifyModal from "../NotifyModal";

const Menu = () => {
  const dispatch = useDispatch();
  const { auth, notify } = useSelector((state) => state);

  const navLinks = [
    { label: "Home", icon: "home", path: "/" },
    { label: "Message", icon: "near_me", path: "/message" },
    { label: "Discover", icon: "explore", path: "/discover" },
  ];

  const { pathname } = useLocation();
  const isActive = (pn) => {
    if (pn === pathname) return "active";
  };
  return (
    <div className="menu">
      <ul className="navbar-nav flex-row align-item-center">
        {navLinks.map((link, index) => (
          <li className={`nav-item ${isActive(link.path)}`} key={index}>
            <Link className="nav-link" to={link.path}>
              <span className="material-icons">{link.icon}</span>
            </Link>
          </li>
        ))}

        <li className="nav-item dropdown">
          <span
            className="nav-link position-relative"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span
              className="material-icons"
              style={{ color: notify.data.length > 0 ? "crimson" : "" }}
            >
              favorite
            </span>
            <span className="notify_length">{notify.data.length}</span>
          </span>

          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <NotifyModal />
          </div>
        </li>

        <li className="nav-item dropdown">
          <span
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <Avatar src={auth.user.avatar} size="medium_avatar" />
          </span>

          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link
              className="dropdown-item"
              to={`/profile/${auth.user.username}`}
            >
              {auth.user.username}
            </Link>
            <Link
              className="dropdown-item"
              to={`/profile/${auth.user.username}`}
            >
              Edit Profile
            </Link>

            <div className="dropdown-divider"></div>
            <Link
              className="dropdown-item"
              to="/"
              onClick={() => dispatch(logout())}
            >
              Logout
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
