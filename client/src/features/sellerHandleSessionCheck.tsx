import { toast } from "react-hot-toast";
import api from "./axios";
import { FaExclamationTriangle } from "react-icons/fa";
import { navigateTo } from "./navigation";
import { logout } from "@/redux/authSlice";
import { store } from "@/redux/store";

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const code = err.response?.data?.code;
    const message = err.response?.data?.message;
    
    if (!code) return Promise.reject(err);

    toast.dismiss();

    if (code === "ACCOUNT_NOT_ACTIVE") {
      toast.error("Your subscription is expired", {
        icon: <FaExclamationTriangle className="text-red-500" />,
        style: {
          borderRadius: "12px",
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
        },
        duration: 3500,
      });
      navigateTo("/seller/subscription");
    }

    if (code === "NO_TOKEN" || code === "TOKEN_EXPIRED") {
      toast.error("Session expired. Please login again", {
        icon: <FaExclamationTriangle className="text-red-500" />,
        style: {
          borderRadius: "12px",
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
        },
        duration: 3500,
      });
      store.dispatch(logout());
      navigateTo("/seller/login");
    }

    if (code === "USER_NOT_FOUND") {
      toast.error("User not found. Please login again", {
        icon: <FaExclamationTriangle className="text-red-500" />,
        style: {
          borderRadius: "12px",
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
        },
        duration: 3500,
      });
      store.dispatch(logout());
      navigateTo("/seller/login");
    }

    if (code === "SERVER_ERROR") {
      toast.error(message, {
        icon: <FaExclamationTriangle className="text-red-500" />,
        style: {
          borderRadius: "12px",
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
        },
        duration: 3500,
      });
      store.dispatch(logout());
      navigateTo("/seller/login");
    }

    return Promise.reject(err);
  },
);
