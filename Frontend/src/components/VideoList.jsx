import { useEffect, useState } from "react";
import useGetAllVideo from "../hooks/video/useGetVideo";
import { useSelector } from "react-redux";
import VideoLoader from "./VideoLoader";
import VideoCain from "./VideoCain";
const VideoList = () => {
  const { getAllVideos, isLoading } = useGetAllVideo();
  const videos = useSelector((state) => state.video.videos); // Assuming videos are stored in Redux
  const [page, setPage] = useState(1);
  console.log("from VIdeoList videos", videos)

  useEffect(() => {
    getAllVideos({ page });
  }, [page]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Videos</h1>
      {isLoading ? <VideoLoader /> : <VideoCain videos={videos} />}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePreviousPage}
          className="bg-gray-200 px-4 py-2 rounded"
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VideoList;
