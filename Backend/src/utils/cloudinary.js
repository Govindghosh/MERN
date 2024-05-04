import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteOnCloudinary = async (url) => {
  try {
    if (!url) {
      return null;
    }

    // Extract public ID from the URL
    const publicId = url.split("/").pop().split(".")[0];
    console.log("public ID:", publicId);

    // Determine the resource type based on the file extension
    const fileType = url.split(".").pop(); // Get the file extension
    let resourceType;
    if (fileType === "mp4" || fileType === "mov" || fileType === "avi") {
      resourceType = "video";
    } else {
      resourceType = "image";
    }

    // Delete the file on Cloudinary
    const response = await cloudinary.uploader.destroy(publicId, {
      type: "upload",
      resource_type: resourceType,
    });

    console.log("Cloudinary response for delete:", response);
    return response;
  } catch (error) {
    console.log("Error in deleting file on Cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
// cloudinary.uploader.upload(
//   "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" },
//   function (error, result) {
//     console.log(result);
//   }
// );

// cloudinary.v2.api
//   .delete_resources(['wuwherm4nxg056mtdhed'],
//     { type: 'upload', resource_type: 'image' })
//   .then(console.log);
