// src/components/VideoList.js
import VideoCard from "./VideoCard";

const VideoList = ({ videos = [] }) => {
  if (videos.length === 0) {
    return <p className="text-center text-gray-500">No videos found</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default VideoList;
