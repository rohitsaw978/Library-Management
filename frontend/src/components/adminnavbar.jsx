import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import {
  FaUserCircle,
  FaPlusCircle,
  FaBookOpen,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";

import "./adminnavbar.css";
import logo from "../assets/axlib-logo.png";

export default function AdminNavbar() {

  // ==========================
  // HOOKS
  // ==========================

  const navigate = useNavigate();
  const location = useLocation();

  // ==========================
  // STATES
  // ==========================

  const [menuOpen, setMenuOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [auth, setAuth] = useState({
    token: localStorage.getItem("authToken"),
    role: localStorage.getItem("role"),
  });

  // ==========================
  // SYNC AUTH
  // ==========================

  useEffect(() => {

    const syncAuth = () => {

      setAuth({
        token: localStorage.getItem("authToken"),
        role: localStorage.getItem("role"),
      });

    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("focus", syncAuth);

    syncAuth();

    return () => {

      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("focus", syncAuth);

    };

  }, []);

  // ==========================
  // CLOSE MENU ON ROUTE CHANGE
  // ==========================

  useEffect(() => {

    setMenuOpen(false);

    setDropdownOpen(false);

  }, [location.pathname]);

  // ==========================
  // HELPERS
  // ==========================

  const closeMenu = () => {

    setMenuOpen(false);

    setDropdownOpen(false);

  };

  const toggleMenu = () => {

    setMenuOpen((prev) => !prev);

  };

  const toggleDropdown = () => {

    setDropdownOpen((prev) => !prev);

  };

  // ==========================
  // LOGOUT
  // ==========================

  const handleLogout = () => {

    localStorage.removeItem("authToken");
    localStorage.removeItem("role");

    setAuth({
      token: null,
      role: null,
    });

    closeMenu();

    navigate("/login", {
      replace: true,
    });

  };

  // ==========================
  // JSX
  // ==========================

  return (

    <nav className="navbar">

      <div className="navbar-container">

        {/* ==========================
            LOGO
        ========================== */}

        <NavLink
          to="/admin"
          end
          className="navbar-brand"
          onClick={closeMenu}
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

        </NavLink>

        {/* ==========================
            MOBILE TOGGLE
        ========================== */}

        <button
          className={`navbar-toggle ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle Navigation"
        >

          {menuOpen ? (
            <FaTimes size={22} />
          ) : (
            <FaBars size={22} />
          )}

        </button>

        {/* ==========================
            NAVIGATION
        ========================== */}

        <div
          className={`navbar-links ${menuOpen ? "show" : ""}`}
        >

          {/* Dashboard */}

          <NavLink
            to="/admin"
            end
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          {/* ==========================
              BOOKS DROPDOWN
          ========================== */}

          <div className="admin-dropdown">

            <button
              className="admin-dropdown-btn"
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >

              Books

              <FaChevronDown
                className={`dropdown-arrow ${dropdownOpen ? "rotate" : ""
                  }`}
              />

            </button>

            <div
              className={`admin-dropdown-content ${dropdownOpen ? "show-dropdown" : ""
                }`}
            >

              <NavLink
                to="/admin/addbook"
                onClick={closeMenu}
              >
                <FaPlusCircle className="menu-icon" />
                Add Book
              </NavLink>

              <NavLink
                to="/admin/viewbook"
                onClick={closeMenu}
              >
                <FaBookOpen className="menu-icon" />
                View Books
              </NavLink>

            </div>

          </div>

          {/* ==========================
              LIBRARIAN MENU
          ========================== */}

          {auth.role === "librarian" && (
            <>
              <NavLink
                to="/admin/issuerequest"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Issue Request
              </NavLink>

              <NavLink
                to="/admin/returnrequest"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Return Request
              </NavLink>
            </>
          )}

          {/* ==========================
              BORROWED BOOKS
          ========================== */}

          <NavLink
            to="/admin/issued"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Books Borrowed
          </NavLink>

          {/* ==========================
              ADMIN MENU
          ========================== */}

          {auth.role === "admin" && (
            <NavLink
              to="/admin/addlibrarian"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Add Librarian
            </NavLink>
          )}

          {/* ==========================
              AUTH SECTION
          ========================== */}

          <div className="auth-section">

            {auth.token ? (
              <>

                <NavLink
                  to="/admin"
                  end
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive
                      ? "login-btn active-btn"
                      : "login-btn"
                  }
                >
                  <FaUserCircle className="menu-icon" />
                  Profile
                </NavLink>

                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </>
            ) : (

              <NavLink
                to="/login"
                onClick={closeMenu}
                className="login-btn"
              >
                Login
              </NavLink>

            )}

          </div>

        </div>

      </div>

    </nav>

  );
}