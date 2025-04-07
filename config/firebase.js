const admin = require("firebase-admin");
const serviceAccount = require("./travel.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://travel-tinder-755m35-default-rtdb.firebaseio.com"
});

module.exports=admin.database();