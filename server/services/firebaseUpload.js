const { bucket } = require("../config/firebase");
const path = require("path");

/**
 * Upload a file to Firebase Storage
 * @param {Object} file - Multer file object
 * @param {string} folder - Folder name in storage bucket
 * @returns {Promise<string>} - Public URL of uploaded file
 */
const uploadToFirebase = async (file, folder = "issues") => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${timestamp}-${randomString}${fileExtension}`;

    // Create a reference to the file
    const fileRef = bucket.file(fileName);

    // Upload the file
    const stream = fileRef.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      public: true, // Make the file publicly accessible
    });

    return new Promise((resolve, reject) => {
      stream.on("error", (error) => {
        console.error("Error uploading to Firebase:", error);
        reject(error);
      });

      stream.on("finish", async () => {
        try {
          // Make the file public
          await fileRef.makePublic();

          // Get the public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          resolve(publicUrl);
        } catch (error) {
          console.error("Error making file public:", error);
          reject(error);
        }
      });

      // Write the file buffer to the stream
      stream.end(file.buffer);
    });
  } catch (error) {
    console.error("Error in uploadToFirebase:", error);
    throw error;
  }
};

/**
 * Upload multiple files to Firebase Storage
 * @param {Array} files - Array of Multer file objects
 * @param {string} folder - Folder name in storage bucket
 * @returns {Promise<Array>} - Array of public URLs
 */
const uploadMultipleToFirebase = async (files, folder = "issues") => {
  try {
    const uploadPromises = files.map((file) => uploadToFirebase(file, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error uploading multiple files to Firebase:", error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * @param {string} url - Public URL of the file to delete
 * @returns {Promise<boolean>} - Success status
 */
const deleteFromFirebase = async (url) => {
  try {
    // Extract file path from URL
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];
    const filePath = `${folder}/${fileName}`;

    // Delete the file
    await bucket.file(filePath).delete();
    return true;
  } catch (error) {
    console.error("Error deleting from Firebase:", error);
    return false;
  }
};

module.exports = {
  uploadToFirebase,
  uploadMultipleToFirebase,
  deleteFromFirebase,
};
