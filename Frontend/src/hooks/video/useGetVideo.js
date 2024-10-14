import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import toastConfig from "../../utils/toast";
import { useDispatch } from "react-redux";
import { setVideos } from "../../store/videoSlice";

const useGetAllVideo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const getAllVideos = async ({
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  }) => {
    setIsLoading(true);

    try {
      const response = await axios.get(import.meta.env.VITE_GETALLVIDEO_API, {
        params: { page, limit, query, sortBy, sortType, userId },
      });

      const fetchedVideos = response.data.data.videos;
      console.log("fetchedVideos from hook", fetchedVideos)
      dispatch(setVideos(fetchedVideos)); // Dispatch videos to Redux store
      toast.success(response.data.message, toastConfig);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to retrieve videos",
        toastConfig
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { getAllVideos, isLoading };
};

export default useGetAllVideo;
