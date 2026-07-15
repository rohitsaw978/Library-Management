import React, { useEffect, useState } from "react";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";


export default function LibrarianRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const url = Server_URL + "librarian/issuerequest"
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
  
      
      showSuccessToast(response.data.message || "Book issued successfully!");
      fetchRequests();
    } catch (err) {
      if (err.response) {
        const message = err.response.data?.error || "Something went wrong";
        showErrorToast( message);
      } else {
        
        showErrorToast("Network error: " + err.message);
      }
      console.error("Error approving request:", err);
    }
  };

  const rejectRequest = async (id) => {
  try {

    const url =
  Server_URL + "librarian/rejectrequest/" + id;

    const response = await axios.put(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "authToken"
          )}`,
        },
      }
    );

    showSuccessToast(
      response.data.message || "Request Rejected"
    );

    fetchRequests();

  } catch (err) {

    if (err.response) {
      showErrorToast(
        err.response.data.error || "Reject Failed"
      );
    } else {
      showErrorToast(err.message);
    }

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
            &#128218; Pending Book Requests
          </h2>

          <p className="mb-0">
            Review and approve pending issue requests
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
                    <th className="text-center">User Name</th>
                    <th className="text-center">Book</th>
                    <th className="text-center">Issue Date</th>
                    <th className="text-center">Due Date</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>

                  {requests.map((req) => (

                    <tr key={req._id}>

                      <td className="fw-semibold text-center">
                        {req.userId?.name || "N/A"}
                      </td>

                      <td className="text-center">
                        {req.bookId?.title || "N/A"}
                      </td>

                      <td className="text-center">
                        {new Date(req.issueDate).toLocaleDateString()}
                      </td>

                      <td className="text-center">
                        {new Date(req.dueDate).toLocaleDateString()}
                      </td>

                      <td className="text-center">

                        <span
                          className={`badge rounded-pill px-3 py-2 fw-bold ${
                            req.status.toLowerCase() === "pending"
                              ? "bg-warning text-dark"
                              : req.status.toLowerCase() === "issued"
                              ? "bg-success text-dark"
                              : "bg-secondary text-white"
                          }`}
                        >
                          {req.status}
                        </span>

                      </td>

                      <td className="text-center">

  <div className="d-flex justify-content-center align-items-center gap-2">

    <button
      className="btn btn-success btn-sm rounded-pill px-3"
      onClick={() => approveRequest(req._id)}
    >
      &#9989; Approve
    </button>

    <button
      className="btn btn-danger btn-sm rounded-pill px-3"
      onClick={() => rejectRequest(req._id)}
    >
      &#10060; Reject
    </button>

  </div>

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
