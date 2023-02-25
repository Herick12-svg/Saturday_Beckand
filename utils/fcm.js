
var admin = require("firebase-admin");
var serviceAccount = require("../config/firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function sendMessaging(deviceToken, message) {
    const payload = {
        data: {
            text: message
        },
        token: deviceToken

    }

    const response = await admin.messaging().send(payload)

    console.log("send response:" , response)
}

module.exports = {
    sendMessaging
}