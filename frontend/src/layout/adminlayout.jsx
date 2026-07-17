import { Navigate, Outlet } from "react-router-dom";
import AdminNavbar from "../components/adminnavbar";
import AdminFooter from "../components/AdminFooter";
import { ToastContainer } from "react-toastify";

export default function AdminLayout() {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  const isAuthorized =
    token && (role === "admin" || role === "librarian");

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <AdminNavbar />

      <Outlet />

      <AdminFooter />

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}