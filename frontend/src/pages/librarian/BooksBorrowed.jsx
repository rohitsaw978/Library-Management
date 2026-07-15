import React, { useEffect, useState } from "react";
import axios from "axios";
import { Server_URL } from "../../utils/config";

export default function BooksBorrowed() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const url = Server_URL + "librarian/bookissued"
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      console.log(res);
      setRequests(res.data.requests);
    } catch (err) {
      console.error("Error fetching requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      const url = Server_URL + "librarian/approverequest/" + id;
      const response = await axios.put(url, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });
  
      
      alert(response.data.message || "Book issued successfully!");
      fetchRequests();
    } catch (err) {
      if (err.response) {
        const message = err.response.data?.error || "Something went wrong";
        alert( message);
      } else {
       
        alert("Network error: " + err.message);
      }
      console.error("Error approving request:", err);
    }
  };
  

  return (
  <div
    style={{
      
      padding: "40px 0",
      background: `
      radial-gradient(circle at top left, rgba(124,58,237,.22), transparent 35%),
      radial-gradient(circle at bottom right, rgba(37,99,235,.18), transparent 40%),
      #020617
      `,
    }}
  >
    <div className="container">

      <div className="card border-0 shadow-lg rounded-4">

        <div
          className="card-header text-white py-4"
          style={{
            background:
              "linear-gradient(90deg,#7c3aed,#2563eb)",
          }}
        >
          <h2 className="fw-bold mb-1">
            &#128218; Books Issued
          </h2>

          <p className="mb-0">
            List of all issued books
          </p>
        </div>

        <div className="card-body">

          {requests.length === 0 ? (

            <div className="alert alert-info text-center">
              No Books Issued.
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead className="table-dark">

                  <tr>

                    <th>User Name</th>

                    <th>Book</th>

                    <th>Issue Date</th>

                    <th>Due Date</th>

                    <th>Status</th>

                  </tr>

                </thead>

                <tbody>

                  {requests.map((req) => (

                    <tr key={req._id}>

                      <td className="fw-semibold">
                        {req.userId?.name || "N/A"}
                      </td>

                      <td>
                        {req.bookId?.title || "N/A"}
                      </td>

                      <td>
                        {new Date(req.issueDate).toLocaleDateString()}
                      </td>

                      <td>
                        {new Date(req.dueDate).toLocaleDateString()}
                      </td>

                      <td>

                        <span
  className={`badge rounded-pill px-3 py-2 fw-bold ${
    req.status.toLowerCase() === "issued"
      ? "bg-success text-white"
      : req.status.toLowerCase() === "pending"
      ? "bg-warning text-dark"
      : "bg-secondary text-white"
  }`}
>
  {req.status}
</span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>

  </div>
);
}
