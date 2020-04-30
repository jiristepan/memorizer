const { google } = require("googleapis");

module.exports = {
    getListOfLessons: getListOfLessons,
    getLesson : getLesson
}

function getLesson(ssheetId, code){
    return new Promise((resolve, reject) => {
        var jwt = getJwt();
        var apiKey = getApiKey();
        var spreadsheetId = ssheetId;
        var range = code+"!A1:D100";
    
        readSheet(jwt, apiKey, spreadsheetId, range).then((data) => {
          var lesson = [];
          if (data.length > 1) {
            for (var i = 1; i < data.length; i++) {
              var row = data[i];
              lesson.push({
                q: row[0],
                a: row[1],
              });
            }
          }
          resolve(lesson)
        });
      });
}

function getListOfLessons(ssheetId) {
  return new Promise((resolve, reject) => {
    var jwt = getJwt();
    var apiKey = getApiKey();
    var spreadsheetId = ssheetId;
    var range = "LESSONS!A1:D100";

    readSheet(jwt, apiKey, spreadsheetId, range).then((data) => {
      var lessons = [];
      if (data.length > 1) {
        for (var i = 1; i < data.length; i++) {
          var row = data[i];
          lessons.push({
            code: row[0],
            name: row[1],
            groupSize: parseInt(row[2]),
            minTries: parseInt(row[3]),
            dataDange: `${row[0]}!A2:B200`,
          });
        }
      }
      resolve(lessons)
    });
  });
}

function getJwt() {
  var credentials = require("./credentials.json");
  return new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
}

function getApiKey() {
  var apiKeyFile = require("./api_key.json");
  return apiKeyFile.key;
}

function readSheet(jwt, apiKey, spreadsheetId, range) {
  return new Promise((resolve, rejecty) => {
    const sheets = google.sheets({ version: "v4" });
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: spreadsheetId,
        range: range,
        auth: jwt,
        key: apiKey,
      },
      (err, res) => {
        if (err) return console.log("The API returned an error: " + err);
        resolve(res.data.values);
      }
    );
  });
}

//getListOfLessons("1R4wRIPwQEtOmxDEeMW6u3Tm7WS1C7BuGrs5hUgdZeV4").then(data=>console.log(data));
// getLesson("1R4wRIPwQEtOmxDEeMW6u3Tm7WS1C7BuGrs5hUgdZeV4","fr1").then(data=>console.log(data));