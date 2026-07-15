import React, { useEffect, useState } from "react";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";


export default function ReturnRequest() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const url = Server_URL + "librarian/returnrequest"
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

    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
        const url = Server_URL + "librarian/approvereturnrequest/" + id;
      const response = await axios.put(url , {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      showSuccessToast(response.data.message || "Book Return successfully!");
      setRequests(prev => prev.filter(req => req._id !== id));
    } catch (err) {
      console.error("Error approving request", err);
      showErrorToast("Failed to approve request");
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
            &#128218; Return Book Requests
          </h2>

          <p className="mb-0">
            Pending return requests from users
          </p>
        </div>

        <div className="card-body">

          {requests.length === 0 ? (

            <div className="alert alert-info text-center">
              No Pending Requests.
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
                    <th>Fine</th>
                    <th>Status</th>
                    <th>Action</th>
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

                        <span className="badge bg-danger rounded-pill px-3 py-2">
                          ₹ {req.fine}
                        </span>

                      </td>

                      <td>

                        <span
                          className={`badge rounded-pill px-3 py-2 fw-bold ${
                            req.status.toLowerCase() === "pending"
                              ? "bg-warning text-dark"
                              : req.status.toLowerCase() === "returned"
                              ? "bg-success text-dark"
                              : "bg-secondary text-white"
                          }`}
                        >
                          {req.status}
                        </span>

                      </td>

                      <td>

                        <button
                          className="btn btn-success btn-sm rounded-pill px-3"
                          onClick={() => approveRequest(req._id)}
                        >
                          &#9989; Approve
                        </button>

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
