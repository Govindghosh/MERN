import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import useGetLikeVideo from "../hooks/like/useGetLikeVideo"; // Ensure correct path to your hook

const LikedVideos = () => {
  const { getLikeVideo, loading } = useGetLikeVideo();
  const [videos, setVideos] = useState([]);
  const [hasFetched, setHasFetched] = useState(false); // Track if the data has been fetched

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchLikedVideos = useCallback(async () => {
    if (!hasFetched) {
      const data = await getLikeVideo();
      if (data?.data) {
        setVideos(data.data);
        setHasFetched(true); // Mark as fetched
      }
    }
  }, [getLikeVideo, hasFetched]);

  useEffect(() => {
    fetchLikedVideos();
  }, [fetchLikedVideos]); // Only run when `fetchLikedVideos` changes

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  if (!videos.length)
    return (
      <p className="text-center text-gray-500">No liked videos found.</p>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-8">Liked Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((videoData) => {
          const { video, _id } = videoData;
          return (
            <motion.div
              key={_id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src={video.thumbnail || "default-thumbnail.jpg"}
                alt={video.title || "No title available"}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{video.title || "Untitled"}</h2>
                <p className="text-sm text-gray-600">
                  {video.description || "No description available."}
                </p>
                <div className="flex items-center mt-4">
                  <img
                    src={video.owner?.avatar || "default-avatar.jpg"}
                    alt={video.owner?.fullName || "Anonymous"}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {video.owner?.fullName || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {video.owner?.username || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LikedVideos;
