import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./adminnavbar.css";
import logo from "../assets/axlib-logo.png";

export default function AdminNavbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (

    <nav className="navbar">

      <div className="navbar-container">

        {/* Logo */}

        <Link
          className="navbar-brand"
          to="/admin"
          onClick={closeMenu}
        >

          <img
            src={logo}
            alt="AXLIB"
            className="navbar-logo"
          />

          <div className="brand-text">
            <h2>
              <span className="logo-a">A</span>XLIB
            </h2>
          </div>

        </Link>

        {/* Mobile Toggle */}

        <button
          className={`navbar-toggle ${
            menuOpen ? "open" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >

          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>

        </button>

        {/* Navigation */}

        <div
          className={`navbar-links ${
            menuOpen ? "show" : ""
          }`}
        >

          <Link
            className="nav-link"
            to="/admin"
            onClick={closeMenu}
          >
            Dashboard
          </Link>
                    {/* Books Dropdown */}

          <div className="admin-dropdown">

            <button className="admin-dropdown-btn">
              Books ▾
            </button>

            <div className="admin-dropdown-content">

              <Link
                to="/admin/addbook"
                onClick={closeMenu}
              >
                ➕ Add Book
              </Link>

              <Link
                to="/admin/viewbook"
                onClick={closeMenu}
              >
                📚 View Books
              </Link>

            </div>

          </div>

          {/* Librarian Menu */}

          {role === "librarian" && (

            <>

              <Link
                className="nav-link"
                to="/admin/issuerequest"
                onClick={closeMenu}
              >
                Issue Request
              </Link>

              <Link
                className="nav-link"
                to="/admin/returnrequest"
                onClick={closeMenu}
              >
                Return Request
              </Link>

            </>

          )}

          <Link
            className="nav-link"
            to="/admin/issued"
            onClick={closeMenu}
          >
            Books Borrowed
          </Link>

          {role === "admin" && (

            <Link
              className="nav-link"
              to="/admin/addlibrarian"
              onClick={closeMenu}
            >
              Add Librarian
            </Link>

          )}
                    {/* Right Side */}

          <div className="auth-section">

            {token ? (

              <>

                <Link
                  className="login-btn"
                  to="/admin"
                  onClick={closeMenu}
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

              <Link
                className="login-btn"
                to="/login"
                onClick={closeMenu}
              >
                Login
              </Link>

            )}

          </div>

        </div>

      </div>

    </nav>

  );
}