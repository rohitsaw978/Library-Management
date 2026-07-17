import {
  FaTachometerAlt,
  FaUsers,
  FaBook,
  FaComments,
  FaClipboardList,
  FaUserTie,
} from "react-icons/fa";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

import { Server_URL } from "../../utils/config";
import "./AdminDashboard.css";

const AdminDashboard = () => {

  // ===============================
  // STATES
  // ===============================

  const [selectedSection, setSelectedSection] = useState("dashboard");

  const [user, setUser] = useState([]);
  const [lib, setLib] = useState([]);
  const [books, setBooks] = useState([]);
  const [latestBooks, setLatestBooks] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const [loading, setLoading] = useState(false);

  const [totalUser, setTotalUser] = useState(0);
  const [totalLib, setTotalLib] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState(0);
  const [occupancyPercent, setOccupancyPercent] = useState(0);

  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  // ===============================
  // PIE CHART DATA
  // ===============================

  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#4F46E5",
          "#06B6D4",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#EC4899",
          "#14B8A6",
        ],
        borderWidth: 0,
      },
    ],
  });

  // ===============================
  // FEEDBACK
  // ===============================

  const getFeedback = async () => {
    try {
      const res = await axios.get(Server_URL + "contact");

      setFeedback(res.data.feedback || []);

    } catch (error) {
      console.error("Feedback Error :", error);
      setFeedback([]);
    }
  };

  // ===============================
  // GET USERS
  // ===============================

  const getUsers = async () => {
    try {
      const res = await axios.get(Server_URL + "users");

      if (res.data.error) {
        console.log(res.data.message);
        return;
      }

      const users = res.data.user || [];

      const students = users.filter(
        (item) => item.role === "user"
      );

      const librarians = users.filter(
        (item) => item.role === "librarian"
      );

      setUser(students);
      setLib(librarians);

      setTotalUser(students.length);
      setTotalLib(librarians.length);

    } catch (error) {
      console.error("Users Error :", error);
    }
  };

  // ===============================
  // DELETE USER
  // ===============================

  const deleteUser = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to remove this user?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(`${Server_URL}users/${id}`);

      getUsers();

      alert("User Removed Successfully");

    } catch (error) {

      console.error(error);

      alert("Failed to remove user");
    }
  };

  // ===============================
  // DELETE LIBRARIAN
  // ===============================

  const deleteLibrarian = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to remove this librarian?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(`${Server_URL}users/${id}`);

      getUsers();

      alert("Librarian Removed Successfully");

    } catch (error) {

      console.error(error);

      alert("Failed to remove librarian");
    }
  };

  // ===============================
  // GET BOOKS
  // ===============================

  const getBooks = async () => {

    try {

      const res = await axios.get(Server_URL + "books");

      if (res.data.error) {
        console.log(res.data.message);
        return;
      }

      const allBooks = res.data.books || [];

      setBooks(allBooks);
      setTotalBooks(res.data.totalBooks || 0);

      const categoryCount = allBooks.reduce((acc, book) => {

        acc[book.category] = (acc[book.category] || 0) + 1;

        return acc;

      }, {});

      setCategoryData({
        labels: Object.keys(categoryCount),

        datasets: [
          {
            data: Object.values(categoryCount),

            backgroundColor: [
              "#4F46E5",
              "#06B6D4",
              "#10B981",
              "#F59E0B",
              "#EF4444",
              "#8B5CF6",
              "#EC4899",
              "#14B8A6",
            ],

            borderWidth: 0,
          },
        ],
      });

      const borrowed = allBooks.reduce((total, book) => {

        return (
          total +
          (book.totalCopies - book.availableCopies)
        );

      }, 0);

      setBorrowedBooks(borrowed);

      const totalCopies = allBooks.reduce((total, book) => {

        return total + book.totalCopies;

      }, 0);

      setOccupancyPercent(
        totalCopies
          ? Math.round((borrowed / totalCopies) * 100)
          : 0
      );

    } catch (error) {

      console.error("Books Error :", error);
    }
  };

  // ===============================
  // GET LATEST BOOKS
  // ===============================

  const getLatestBooks = async () => {
    try {

      const res = await axios.get(Server_URL + "books/new");

      if (res.data.error) {
        console.log(res.data.message);
        return;
      }

      setLatestBooks(res.data.books || []);

    } catch (error) {

      console.error("Latest Books Error :", error);

      setLatestBooks([]);
    }
  };

  // ===============================
  // CHANGE SECTION
  // ===============================

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  // ===============================
  // LOAD DASHBOARD
  // ===============================

  const loadDashboard = async () => {

    try {

      await Promise.all([
        getUsers(),
        getBooks(),
        getLatestBooks(),
        getFeedback(),
      ]);

    } catch (error) {

      console.error(error);

    }
  };

  // ===============================
  // USE EFFECT
  // ===============================

  useEffect(() => {

    loadDashboard();

  }, []);


  // ===============================
  // JSX
  // ===============================

  return (
    <div className="admin-dashboard">

      <div className="row g-0">

        {/* =======================
            SIDEBAR
        ======================== */}

        <nav className="col-md-3 col-lg-2 admin-sidebar">

          <h4 className="admin-sidebar-title">

            <FaClipboardList />

            {role === "admin"
              ? " Admin Panel"
              : " Librarian Panel"}

          </h4>

          <ul className="admin-nav">

            <li className="admin-nav-item">

              <button
                className={`admin-nav-btn ${selectedSection === "dashboard"
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  handleSectionChange("dashboard")
                }
              >
                <FaTachometerAlt />
                Dashboard
              </button>

            </li>

            <li className="admin-nav-item">

              <button
                className={`admin-nav-btn ${selectedSection === "users"
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  handleSectionChange("users")
                }
              >
                <FaUsers />
                Users
              </button>

            </li>

            {role === "admin" && (

              <li className="admin-nav-item">

                <button
                  className={`admin-nav-btn ${selectedSection === "librarians"
                      ? "active"
                      : ""
                    }`}
                  onClick={() =>
                    handleSectionChange("librarians")
                  }
                >
                  <FaUserTie />
                  Librarians
                </button>

              </li>

            )}

            <li className="admin-nav-item">

              <button
                className={`admin-nav-btn ${selectedSection === "books"
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  handleSectionChange("books")
                }
              >
                <FaBook />
                Books
              </button>

            </li>

            <li className="admin-nav-item">

              <button
                className={`admin-nav-btn ${selectedSection === "feedback"
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  handleSectionChange("feedback")
                }
              >
                <FaComments />
                Feedback
              </button>

            </li>

          </ul>

        </nav>

        {/* =======================
            MAIN START
        ======================== */}

        <main className="col-md-9 col-lg-10 admin-main">

          {/* ======================================
                  DASHBOARD
          ======================================= */}

          {selectedSection === "dashboard" && (
            <>

              <h2 className="admin-section-title">
                <FaTachometerAlt />
                {" "}Dashboard Overview
              </h2>

              {/* =========================
                    STATS
              ========================== */}

              <div className="stats-grid">

                <div className="stat-card books">
                  <h3>Total Books</h3>
                  <p>{totalBooks}</p>
                </div>

                <div className="stat-card users">
                  <h3>Total Users</h3>
                  <p>{totalUser}</p>
                </div>

                {role === "admin" && (
                  <div className="stat-card librarians">
                    <h3>Total Librarians</h3>
                    <p>{totalLib}</p>
                  </div>
                )}

                <div className="stat-card borrowed">
                  <h3>Books Borrowed</h3>
                  <p>{borrowedBooks}</p>
                </div>

              </div>

              {/* =========================
                    PROGRESS
              ========================== */}

              <div className="progress-grid">

                <div className="progress-card">

                  <h3>Books Issued</h3>

                  <div className="progress-container">

                    <div
                      className="progress-bar"
                      style={{
                        width: `${occupancyPercent}%`,
                      }}
                    >
                      {occupancyPercent}%
                    </div>

                  </div>

                </div>

              </div>

              {/* =========================
                    CHART + RECENT
              ========================== */}

              <div className="chart-activity-grid">

                <div className="chart-card">

                  <h3>Category Distribution</h3>

                  <div
                    style={{
                      height: "300px",
                      width: "100%",
                    }}
                  >
                    <Pie
                      data={categoryData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,

                        plugins: {

                          legend: {

                            position: "bottom",

                            labels: {

                              color: "#ffffff",

                              padding: 20,

                              usePointStyle: true,

                              font: {
                                size: 13,
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>

                </div>

                {/* =========================
                      RECENT BOOKS
                ========================== */}

                <div className="activity-card">

                  <h3>Recent Added Books</h3>

                  <div className="activity-list">

                    {latestBooks.length > 0 ? (

                      latestBooks
                        .slice(0, 5)
                        .map((book, index) => (

                          <div
                            key={book._id || index}
                            className="activity-item"
                          >

                            <div className="activity-icon">
                              <FaBook />
                            </div>

                            <div className="activity-text">

                              <strong>
                                {book.title}
                              </strong>

                              <br />

                              <small>
                                Added By :{" "}
                                {book.addedBy?.name ||
                                  "Unknown"}
                              </small>

                            </div>

                          </div>

                        ))

                    ) : (

                      <p
                        style={{
                          color: "#ccc",
                          textAlign: "center",
                          padding: "20px",
                        }}
                      >
                        No Recent Books Found
                      </p>

                    )}

                  </div>

                </div>

              </div>

            </>
          )}

          {/* ======================================
                  USERS MANAGEMENT
          ======================================= */}

          {selectedSection === "users" && (
            <>

              <h2 className="admin-section-title">
                <FaUsers /> Users Management
              </h2>

              <div className="admin-table-container">

                <table className="admin-table">

                  <thead>

                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Stream</th>
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {user.length > 0 ? (

                      user.map((data, index) => (

                        <tr key={data._id}>

                          <td>{index + 1}</td>

                          <td>{data.name}</td>

                          <td>{data.email}</td>

                          <td>{data.stream}</td>

                          <td>

                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() =>
                                deleteUser(data._id)
                              }
                            >
                              Remove
                            </button>

                          </td>

                        </tr>

                      ))

                    ) : (

                      <tr>

                        <td colSpan="5" align="center">
                          No Users Found
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </>
          )}

          {/* ======================================
                LIBRARIANS MANAGEMENT
          ======================================= */}

          {selectedSection === "librarians" && role === "admin" && (
            <>

              <h2 className="admin-section-title">
                <FaUserTie /> Librarians Management
              </h2>

              <div className="admin-table-container">

                <table className="admin-table">

                  <thead>

                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {lib.length > 0 ? (

                      lib.map((data, index) => (

                        <tr key={data._id}>

                          <td>{index + 1}</td>

                          <td>{data.name}</td>

                          <td>{data.email}</td>

                          <td>{data.role}</td>

                          <td>

                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() =>
                                deleteLibrarian(data._id)
                              }
                            >
                              Remove
                            </button>

                          </td>

                        </tr>

                      ))

                    ) : (

                      <tr>

                        <td colSpan="5" align="center">
                          No Librarians Found
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </>
          )}

          {/* ======================================
                    BOOKS INVENTORY
          ======================================= */}

          {selectedSection === "books" && (
            <>

              <h2 className="admin-section-title">
                <FaBook /> Books Inventory
              </h2>

              <div className="admin-table-container">

                <table className="admin-table">

                  <thead>

                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Total Copies</th>
                      <th>Available</th>
                    </tr>

                  </thead>

                  <tbody>

                    {books.length > 0 ? (

                      books.map((data, index) => (

                        <tr key={data._id}>

                          <td>{index + 1}</td>

                          <td>{data.title}</td>

                          <td>{data.author}</td>

                          <td>{data.category}</td>

                          <td>{data.totalCopies}</td>

                          <td>{data.availableCopies}</td>

                        </tr>

                      ))

                    ) : (

                      <tr>

                        <td colSpan="6" align="center">
                          No Books Available
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </>
          )}

          {/* ======================================
                  FEEDBACK SECTION
          ======================================= */}

          {selectedSection === "feedback" && (
            <>

              <h2 className="admin-section-title">
                <FaComments /> Feedback Messages
              </h2>

              <div className="admin-table-container">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Message</th>
                    </tr>
                  </thead>

                  <tbody>

                    {feedback.length > 0 ? (

                      feedback.map((item, index) => (

                        <tr key={item._id || index}>

                          <td>{index + 1}</td>

                          <td>{item.name}</td>

                          <td>{item.email}</td>

                          <td>{item.subject}</td>

                          <td>{item.message}</td>

                        </tr>

                      ))

                    ) : (

                      <tr>

                        <td
                          colSpan="5"
                          style={{
                            textAlign: "center",
                            padding: "30px",
                          }}
                        >
                          No Feedback Available
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </>
          )}

        </main>

      </div>

    </div>
  );
};

export default AdminDashboard;