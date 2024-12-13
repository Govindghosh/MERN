import axios from "axios";
import { toast } from "react-toastify";
import toastConfig from "../../utils/toast";
import { useState } from "react";

const useAddComment = (videoId) => {
  const [loading, setLoading] = useState(false);

  const addComment = async (content) => {
    if (!content || content.trim() === "") {
      toast.error("Comment content cannot be empty.", toastConfig);
      return;
    }

    try {
      setLoading(true);
      const apiEndPoint = (import.meta.env.VITE_ADDCOMMENT_API)
        .replace(":videoId", videoId);

      if (!apiEndPoint) {
        throw new Error("API endpoint is not configured correctly.");
      }

      const response = await axios.post(
        apiEndPoint,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Comment posted successfully.", toastConfig);
      return response.data.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to post the comment.";
      toast.error(errorMessage, toastConfig);

      // Optional: Log unexpected errors for debugging
      if (!err.response) {
        console.error("Unexpected error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return { addComment, loading };
};

export default useAddComment;
