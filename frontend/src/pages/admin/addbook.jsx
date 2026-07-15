import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import {
  showErrorToast,
  showSuccessToast,
} from "../../utils/toasthelper";

const AddBookForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== "coverImage") {
          formData.append(key, data[key]);
        }
      });

      if (data.coverImage && data.coverImage[0]) {
        formData.append(
          "coverImage",
          data.coverImage[0]
        );
      }

      const authToken =
        localStorage.getItem("authToken");

      const response = await axios.post(
        Server_URL + "books/add",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const { error, message } =
        response.data;

      if (error) {
        showErrorToast(message);
      } else {
        showSuccessToast(message);
        reset();
      }
    } catch (error) {
      console.log(error);

      showErrorToast(
        "Failed to Add Book!"
      );
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
  <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-lg-10 col-xl-9">

          <div
  className="card border-0 rounded-4 shadow-lg"
  style={{
    background: "rgba(255,255,255,.95)",
    backdropFilter: "blur(12px)",
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
                &#128218; Add New Book
              </h2>

              <p className="mb-0">
                Fill all details to add a new
                book to the library.
              </p>

            </div>

            <div className="card-body p-4">

              <form
                onSubmit={handleSubmit(
                  onSubmit
                )}
              >

                <div className="row">

                                    {/* Book Title */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-semibold">
                      Book Title
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg shadow-sm"
                      placeholder="Enter Book Title"
                      {...register("title", {
                        required: "Title is required",
                      })}
                    />

                    {errors.title && (
                      <small className="text-danger">
                        {errors.title.message}
                      </small>
                    )}
                  </div>

                  {/* Author */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-semibold">
                      Author
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg shadow-sm"
                      placeholder="Enter Author Name"
                      {...register("author", {
                        required: "Author is required",
                      })}
                    />

                    {errors.author && (
                      <small className="text-danger">
                        {errors.author.message}
                      </small>
                    )}
                  </div>

                  {/* Category */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-semibold">
                      Category
                    </label>

                    <select
                      className="form-select form-select-lg shadow-sm"
                      {...register("category", {
                        required: "Category is required",
                      })}
                    >
                      <option value="">
                        Select Category
                      </option>

                      <option value="Fiction">
                        Fiction
                      </option>

                      <option value="Non-fiction">
                        Non-fiction
                      </option>

                      <option value="Science">
                        Science
                      </option>

                      <option value="History">
                        History
                      </option>
                    </select>

                    {errors.category && (
                      <small className="text-danger">
                        {errors.category.message}
                      </small>
                    )}
                  </div>

                  {/* ISBN */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-semibold">
                      ISBN
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg shadow-sm"
                      placeholder="Enter ISBN"
                      {...register("isbn", {
                        required: "ISBN is required",
                      })}
                    />

                    {errors.isbn && (
                      <small className="text-danger">
                        {errors.isbn.message}
                      </small>
                    )}
                  </div>

                  {/* Cover Image */}
                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold">
                      Book Cover Image
                    </label>

                    <input
                      type="file"
                      className="form-control form-control-lg shadow-sm"
                      {...register("coverImage")}
                    />
                  </div>
                                    {/* Total Copies */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-semibold">
                      Total Copies
                    </label>

                    <input
                      type="number"
                      className="form-control form-control-lg shadow-sm"
                      placeholder="Enter Total Copies"
                      {...register("totalCopies", {
                        required: true,
                        min: 1,
                      })}
                    />
                  </div>

                  {/* Price */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-semibold">
                      Price
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      className="form-control form-control-lg shadow-sm"
                      placeholder="Enter Book Price"
                      {...register("price", {
                        required: true,
                      })}
                    />
                  </div>

                  {/* Description */}
                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold">
                      Description
                    </label>

                    <textarea
                      rows="5"
                      className="form-control form-control-lg shadow-sm"
                      placeholder="Enter Book Description"
                      {...register("description", {
                        required: "Description is required",
                      })}
                    ></textarea>

                    {errors.description && (
                      <small className="text-danger">
                        {errors.description.message}
                      </small>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="col-12">

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 rounded-pill shadow"
                    >
                      &#128218; Add Book
                    </button>

                  </div>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  </div>

  );
};

export default AddBookForm;