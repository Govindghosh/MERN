import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import toastConfig from "../../utils/toast"; 
import { useDispatch } from "react-redux";
import { uploadVideo as uploadVideoReducer } from "../../store/videoSlice";
const useUploadVideo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const uploadVideo = async (videoData) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", videoData.title);
      formData.append("description", videoData.description);
      formData.append("isPublished", videoData.isPublished);
      formData.append("videoFile", videoData.videoFile);
      formData.append("thumbnail", videoData.thumbnail); 

      const response = await axios.post(
        import.meta.env.VITE_UPLOADVIDEO_API,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(uploadVideoReducer(response.data.video));
      toast.success(response.data.message, toastConfig);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to upload video", toastConfig
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadVideo, isLoading };
};

export default useUploadVideo;
