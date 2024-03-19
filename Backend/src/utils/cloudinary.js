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
      console.log("Could not find the old Image");
      return null;
    }

    //delete the file on cloudinary
    await cloudinary.uploader.destroy(
      url.split("/").pop().split(".")[0],
      (error) => {
        if (error) {
          throw new ApiError(402, error, "Image Not Found");
        }
      }
    );
  } catch (error) {
    console.log("Error in deleting image on clodinary", error);

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
