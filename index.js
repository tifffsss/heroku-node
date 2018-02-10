const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');

//const app = express();
const cors = require('cors')({origin: true});

const applicationPublicKey = 'BJC4zRwE6quCzu5qSHudnbOG8S72X84mAcPINfUV0iV3dydC6IuxvchQq3kSBz7G2nIvHYOUEZ-5h8h6gaYP04c';
const applicationPrivateKey = 'lhIvgeko3qBrIgwF26D897pvt95Siirurmr6gBv9Ql4';

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.notification = functions.https.onRequest((req, res) => {
// [END trigger]
  // [START sendError]
  // Forbidding PUT requests.
  const options = {
    vapidDetails: {
      subject: 'https://developers.google.com/web/fundamentals/',
      publicKey: applicationPublicKey, //req.body.applicationKeys.public,
      privateKey: applicationPrivateKey, //req.body.applicationKeys.private
    },
    // 1 hour in seconds.
    TTL: 60 * 43200
  };
    
  if (req.method === 'PUT') {
    res.status(403).send('Forbidden!');
  }
  // [END sendError]

  // [START usingMiddleware]
  // Enable CORS using the `cors` express middleware.
  cors(req, res, () => {
  // [END usingMiddleware]
    // Reading date format from URL query parameter.
    // [START readQueryParam]
    let subscription = req.query.subscription;
    // [END readQueryParam]
    // Reading date format from request body query parameter
    if (!subscription) {
      // [START readBodyParam]
      subscription = req.body.subscription;
      // [END readBodyParam]
    }
      
    subscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/edR2v7SQxQQ:APA91bFW7SAeLKTrvx0dWGVzkqb_RLAqYVsTUnLqxe_BRvbJNLY0iF2LSdXn2WXTl1P4iMGu7lQY4vmJS6FIF_BWchVyHEc_dWeQlwfgPx-5c3d7-x6QYAXUIobFwVGSeyeIaLPJrBXu","expirationTime":null,"keys":{"p256dh":"BEA-2K_NhZFKe2PsW-jy7ufuzU_uaCxCw4jJ9vCy-ILiQX8qZbVjVu64u6F-LZQIEzkFhp1-roxlv4NLR2DX6us=","auth":"BbOPBwXxHDEvGToYTpM_ig=="}};
    // [START sendResponse]
    console.log('subscription', subscription);
    webpush.sendNotification(
        subscription,//req.body.subscription,
        req.body.data,
        options
      )
      .then((response) => {
        return res.status(200).send({success: true});
      })
      .catch((err) => {
        if (err.statusCode) {
          res.status(err.statusCode).send(err.body);
        } else {
          res.status(400).send(err.message);
        }
    });
    // [END sendResponse]
  });
});