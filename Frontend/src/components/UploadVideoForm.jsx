import useUploadVideo from "../hooks/video/useUploadVideo";

const UploadVideoForm = () => {
  const { uploadVideo, isLoading } = useUploadVideo();

  const handleSubmit = (e) => {
    e.preventDefault();
    const videoData = {
      title: e.target.title.value,
      description: e.target.description.value,
      isPublished: e.target.isPublished.checked,
      videoFile: e.target.videoFile.files[0],
      thumbnail: e.target.thumbnail.files[0],
    };
    uploadVideo(videoData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Title" required />
      <textarea name="description" placeholder="Description" required />
      <input type="checkbox" name="isPublished" /> Published
      <input type="file" name="videoFile" required />
      <input type="file" name="thumbnail" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Uploading..." : "Upload Video"}
      </button>
    </form>
  );
};

export default UploadVideoForm;
