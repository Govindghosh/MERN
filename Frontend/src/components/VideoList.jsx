import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useGetAllVideo from "../hooks/video/useGetVideo";

const VideoList = () => {
  const { videos, loading, error } = useSelector((state) => state.video);
  const { getAllVideos, isLoading } = useGetAllVideo();

  const [page, setPage] = useState(1);
  const [limit] = useState(10); // You can modify the limit as needed
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      await getAllVideos({ page, limit, query });
    };

    fetchVideos();
  }, [getAllVideos, page, limit, query]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Video List</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading || loading ? (
        <p className="text-lg">Loading videos...</p>
      ) : (
        <>
          {error && <p className="text-red-500">{error}</p>}
          <ul className="space-y-4">
            {videos.map((video) => (
              <li key={video._id} className="border rounded-lg p-4 shadow-md">
                <h3 className="text-xl font-semibold">{video.title}</h3>
                <p className="text-gray-600">{video.description}</p>
                <video controls className="mt-2" src={video.videoFile} />
                <div className="flex justify-between mt-4">
                  <span className="text-sm text-gray-500">
                    Duration: {video.duration} minutes
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-lg">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoList;
