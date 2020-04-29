const functions = require('firebase-functions');
const gsheet = require("./gsheet.js");
const config = require("./config.js")
var cors = require('cors')
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.listLectures = functions.https.onRequest((request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    if (request.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      response.set('Access-Control-Allow-Methods', 'GET');
      response.set('Access-Control-Allow-Headers', 'Content-Type');
      response.set('Access-Control-Max-Age', '3600');
      response.status(204).send('');
    } else {
        gsheet
        .getListOfLessons(config.spreadsheetId)
        .then(data=>{
            response.send(data)
        })
    }
});
