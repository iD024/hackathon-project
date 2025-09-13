const admin = require("firebase-admin");
const path = require("path");

// --- Step 1: Point directly to your service account key file ---
// This is the most reliable way to load your credentials on the server.
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

console.log("Vite Env Variables:", import.meta.env);

let serviceAccount;
try {
  // --- Step 2: Load the entire JSON file ---
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error(
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n" +
      "!!! ERROR: Could not find 'serviceAccountKey.json'                 !!!\n" +
      "!!!                                                                    !!!\n" +
      "!!! Please download your service account key from the Firebase console,!!!\n" +
      "!!! rename it to 'serviceAccountKey.json', and place it in the         !!!\n" +
      "!!! 'server/config/' directory.                                        !!!\n" +
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  );
  process.exit(1); // Stop the server if the key is missing
}

// --- Step 3: Initialize Firebase Admin with the loaded credentials ---
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // FIX: Construct the storage bucket URL directly from the service account's project_id
    // This avoids issues with .env loading order.
    storageBucket: `${serviceAccount.project_id}.appspot.com`,
  });
}

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };
