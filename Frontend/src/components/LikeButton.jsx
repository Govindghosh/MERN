import { useState } from "react";
import useToggleLike from "../hooks/like/useToggleLike";

const LikeButton = ({ type, _id, initialLiked = false }) => {
  const { toggleLike, loading } = useToggleLike();
  const [liked, setLiked] = useState(initialLiked);

  const handleToggleLike = async () => {
    const response = await toggleLike(type, _id);
    if (response) {
      setLiked(!liked);
      console.log("from like button", _id);
      console.log("liked", response);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={loading}
      className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 
        ${loading ? "cursor-not-allowed" : "cursor-pointer"} 
        ${liked ? "bg-red-500 text-white" : "bg-gray-300 text-gray-800"} 
        ${!loading ? "hover:bg-opacity-80" : ""}`}
    >
      {loading ? "Processing..." : liked ? "Unlike" : "Like"}
    </button>
  );
};

export default LikeButton;
