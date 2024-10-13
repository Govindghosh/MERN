import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import toastConfig from "../../utils/toast";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const logoutUser = async () => {
    setLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_LOGOUT_API);
      toast.success(
        response.data.message || "Logged out successfully",
        toastConfig
      );
      dispatch(logout());
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to log out",
        toastConfig
      );
    } finally {
      setLoading(false);
    }
  };

  return { logoutUser, loading };
};

export default useLogout;
