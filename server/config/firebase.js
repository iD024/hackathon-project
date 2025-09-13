const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

let serviceAccount;
try {
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
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${serviceAccount.project_id}.appspot.com`,
  });
}

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };
