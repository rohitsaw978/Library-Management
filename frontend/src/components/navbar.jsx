import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./navbar.css";
import logo from "../assets/axlib-logo.png";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("authToken");

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("authToken");
    localStorage.removeItem("role");

    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleNavClick = () => {

    closeMenu();

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  };

  return (

    <nav className="navbar">

      <div className="navbar-container">

        {/* LOGO */}

        <Link
          className="navbar-brand"
          to="/"
          onClick={handleNavClick}
        >

          <img
            src={logo}
            alt="AXLIB Logo"
            className="navbar-logo"
          />

          <div className="brand-text">
            <h2>
              <span className="logo-a">A</span>XLIB
            </h2>
          </div>

        </Link>

        {/* MOBILE TOGGLE */}

        <button
          className={`navbar-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >

          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>

        </button>

        {/* NAVIGATION */}

        <div
          className={`navbar-links ${
            menuOpen ? "show" : ""
          }`}
        >

          <Link
            className="nav-link"
            to="/"
            onClick={handleNavClick}
          >
            Home
          </Link>

          <Link
            className="nav-link"
            to="/books"
            onClick={handleNavClick}
          >
            Books
          </Link>

          <Link
            className="nav-link"
            to="/category"
            onClick={handleNavClick}
          >
            Category
          </Link>

          <Link
            className="nav-link"
            to="/aboutus"
            onClick={handleNavClick}
          >
            About
          </Link>

          <Link
            className="nav-link"
            to="/contactus"
            onClick={handleNavClick}
          >
            Contact
          </Link>

          {/* AUTH BUTTONS */}

          <div className="auth-section">

            {token ? (
              <>

                <Link
                  className="login-btn"
                  to="/user"
                  onClick={handleNavClick}
                >
                  👤 Profile
                </Link>

                <button
                  className="logout-btn"
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                >
                  Logout
                </button>

              </>
            ) : (
              <>

                <Link
                  className="login-btn"
                  to="/login"
                  onClick={handleNavClick}
                >
                  Login
                </Link>

                <Link
                  className="signup-btn"
                  to="/register"
                  onClick={handleNavClick}
                >
                  Signup
                </Link>

              </>
            )}

          </div>

        </div>

      </div>

    </nav>

  );
}