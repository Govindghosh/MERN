import axios from "axios";
import { toast } from "react-toastify";
import toastConfig from "../../utils/toast";
import { useState } from "react";

const useGetLikeVideo = () => {
  const [loading, setLoading] = useState(false);

  const getLikeVideo = async () => {
    setLoading(true);

    try {
      const apiEndpoint = import.meta.env.VITE_GETLIKESVIDEO_API;
      if (!apiEndpoint) {
        toast.error("API endpoint is not set");
      }

      const response = await axios.get(apiEndpoint, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
       });

      if (response && response.data) {
        toast.success(
          response.data.message || "All likes Fetched",
          toastConfig
        );
        return response.data;
      } else {
        toast.error("Failed to fetch likes", toastConfig);
      }
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "An error occurred",
        toastConfig
      );
    } finally {
      setLoading(false);
    }
  };

  return { getLikeVideo, loading };
};

export default useGetLikeVideo;
