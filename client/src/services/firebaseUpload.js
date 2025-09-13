import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Upload a file to Firebase Storage
 * @param {File} file - File object to upload
 * @param {string} folder - Folder name in storage bucket
 * @returns {Promise<string>} - Public URL of uploaded file
 */
export const uploadToFirebase = async (file, folder = "issues") => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.round(Math.random() * 1e9);
    const fileExtension = file.name.split(".").pop();
    const fileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`;

    // Create a reference to the file
    const storageRef = ref(storage, fileName);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading to Firebase:", error);
    throw error;
  }
};

/**
 * Upload multiple files to Firebase Storage
 * @param {Array} files - Array of File objects
 * @param {string} folder - Folder name in storage bucket
 * @returns {Promise<Array>} - Array of public URLs
 */
export const uploadMultipleToFirebase = async (files, folder = "issues") => {
  try {
    const uploadPromises = files.map((file) => uploadToFirebase(file, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error uploading multiple files to Firebase:", error);
    throw error;
  }
};
