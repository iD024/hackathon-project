const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
// You'll need to add your Firebase service account key here
// For now, we'll use a placeholder - you need to replace this with your actual config
const serviceAccount = {
  // Add your Firebase service account configuration here
  // You can get this from Firebase Console > Project Settings > Service Accounts
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID || "your-project-id",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "your-private-key-id",
  private_key:
    process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") ||
    "your-private-key",
  client_email: process.env.FIREBASE_CLIENT_EMAIL || "your-client-email",
  client_id: process.env.FIREBASE_CLIENT_ID || "your-client-id",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    process.env.FIREBASE_CLIENT_CERT_URL || "your-client-cert-url",
};

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET || "your-project-id.appspot.com",
  });
}

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };
