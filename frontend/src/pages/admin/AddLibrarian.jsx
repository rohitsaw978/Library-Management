import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";


export default function AddLibrarian() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = { ...data, role: "librarian" };
      const url = Server_URL + "admin/addlibrarian";
      const authToken = localStorage.getItem("authToken");
      console.log(authToken);

      const response = await axios.post(
        url,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("Response:", response.data);
      showSuccessToast("Registration Successful!");
      reset();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      showErrorToast("Registration Failed!");
    }
   
  };
  return (
  <div
    style={{
      minHeight: "100vh",
      padding: "40px 0",
      background: `
        radial-gradient(circle at top left, rgba(124,58,237,.22), transparent 35%),
        radial-gradient(circle at bottom right, rgba(37,99,235,.18), transparent 40%),
        #020617
      `,
    }}
  >
    <div className="container">

      <div className="row justify-content-center">

        <div className="col-lg-8 col-xl-6">

          <div
            className="card border-0 shadow-lg rounded-4"
            style={{
              background: "rgba(255,255,255,.95)",
              backdropFilter: "blur(10px)",
            }}
          >

            <div
              className="card-header text-white text-center py-4"
              style={{
                background:
                  "linear-gradient(90deg,#7c3aed,#2563eb)",
              }}
            >
              <h2 className="fw-bold mb-1">
                &#128104;&#8205;&#128188; Add Librarian
              </h2>

              <p className="mb-0">
                Register a new librarian account
              </p>
            </div>

            <div className="card-body p-4">

              <form onSubmit={handleSubmit(onSubmit)}>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Name
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-lg shadow-sm"
                    placeholder="Enter Full Name"
                    {...register("name", {
                      required: "Name is required",
                    })}
                  />

                  {errors.name && (
                    <small className="text-danger">
                      {errors.name.message}
                    </small>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control form-control-lg shadow-sm"
                    placeholder="Enter Email Address"
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />

                  {errors.email && (
                    <small className="text-danger">
                      {errors.email.message}
                    </small>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control form-control-lg shadow-sm"
                    placeholder="Enter Password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />

                  {errors.password && (
                    <small className="text-danger">
                      {errors.password.message}
                    </small>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 rounded-pill shadow"
                >
                  &#10133; Add Librarian
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  </div>
);
}
