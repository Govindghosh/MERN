import { useState } from "react";
import LikeButton from "./LikeButton";
import CommentForm from "./CommentForm";

const VideoCard = ({ video }) => {
  const { title, description, thumbnail, videoFile, views, duration, updatedAt, _id } = video;
  const [isHovered, setIsHovered] = useState(false); // Track hover state
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
  // Format video duration to "MM:SS"
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  return (
    <>
      {/* Video Card */}
      <div
        className="w-full sm:w-64 border rounded-lg overflow-hidden shadow-md cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
         // Open modal on click
      >
        <div className="relative" onClick={() => setIsModalOpen(true)}>
          {/* Hover to play preview */}
          {isHovered ? (
            <video
              src={videoFile}
              muted
              autoPlay
              loop
              className="w-full h-40 object-cover"
            />
          ) : (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-40 object-cover"
            />
          )}
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
            {formatDuration(duration)}
          </span>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-md truncate">{title}</h3>
          <p className="text-sm text-gray-600 truncate mt-1">{description}</p>
            
          <div className="text-xs text-gray-500 mt-2">
            {views} views • {new Date(updatedAt).toLocaleDateString()}
          </div>
        </div>
        <LikeButton key={_id} type="video" _id={_id}/>
        <CommentForm videoId={_id} />
      </div>

      {/* Modal Video Player */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)} // Close modal on backdrop click
        >
          <div className="relative w-full max-w-2xl p-4">
            <video
              src={videoFile}
              controls
              autoPlay
              className="w-full h-auto rounded-md"
              onClick={(e) => e.stopPropagation()} // Prevent closing on video click
            />
            <button
              className="absolute top-2 right-2 text-white text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;
