const admin = require("firebase-admin");
const path = require("path");

// This points to your Firebase service account key file.
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error(
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n" +
      "!!! ERROR: Could not find 'serviceAccountKey.json'                 !!!\n" +
      "!!! Please ensure it is in the 'server/config/' directory.         !!!\n" +
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  );
  process.exit(1); // Stop the server if the key is missing
}

// Initialize Firebase Admin with the CORRECT storage bucket
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // ❗️ This is the crucial correction ❗️
    storageBucket: "civic-pulse-67313.appspot.com",
  });
}

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };
