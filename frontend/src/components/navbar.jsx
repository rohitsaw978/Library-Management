import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "./navbar.css";
import logo from "../assets/axlib-logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [token, setToken] = useState(
    localStorage.getItem("authToken")
  );

  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("authToken"));
    };

    window.addEventListener("storage", syncAuth);

    window.addEventListener("focus", syncAuth);

    syncAuth();

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("focus", syncAuth);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleNavClick = () => {
    closeMenu();

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");

    setToken(null);

    closeMenu();

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* ================= LOGO ================= */}

        <NavLink
          to="/"
          className="navbar-brand"
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
        </NavLink>

        {/* ================= MOBILE TOGGLE ================= */}

        <button
          className={`navbar-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </button>

        {/* ================= NAVIGATION ================= */}

        <div
          className={`navbar-links ${
            menuOpen ? "show" : ""
          }`}
        >
          <NavLink
            to="/"
            end
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/books"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Books
          </NavLink>

          <NavLink
            to="/category"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Category
          </NavLink>

          <NavLink
            to="/aboutus"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contactus"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Contact
          </NavLink>

          {/* ================= AUTH ================= */}

          <div className="auth-section">
            {token ? (
              <>
                <NavLink
                  to="/user"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    isActive
                      ? "login-btn active-btn"
                      : "login-btn"
                  }
                >
                  👤 Profile
                </NavLink>

                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    isActive
                      ? "login-btn active-btn"
                      : "login-btn"
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    isActive
                      ? "signup-btn active-btn"
                      : "signup-btn"
                  }
                >
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}