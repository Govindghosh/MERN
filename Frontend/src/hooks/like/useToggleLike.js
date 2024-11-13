import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import toastConfig from "../../utils/toast";

const useToggleLike = () => {
  const [loading, setLoading] = useState(false);
  
  const toggleLike = async (type, _id) => {
    setLoading(true);
    try {
      const apiEndPoint = import.meta.env.VITE_TOGGLELIKE_API
        .replace(":type", type)
        .replace(":id", _id);
      const response = await axios.patch(apiEndPoint, null, {
       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success(response.data.message, toastConfig);
      return response.data;
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "An error occurred",
        toastConfig
      );
    } finally {
      setLoading(false);
    }
  };

  return { toggleLike, loading };
};

export default useToggleLike;
