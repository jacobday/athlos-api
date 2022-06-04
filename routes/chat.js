const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const url = process.env.CHAT_API_URL;
const chat_headers = {
  "Content-Type": "application/json",
  appid: process.env.APPID,
  apikey: process.env.APIKEY,
};

router.get("/auth", (req, res) => {
  const uid = req.query.uid;
  // if you have your own login method, call it here.
  // then call CometChat for auth token
  requestAuthToken(uid)
    .then((token) => {
      console.log("Success:" + JSON.stringify(token));
      res.json(token);
    })
    .catch((error) => console.error("Error:", error));
});

router.get("/users", (req, res) => {
  axios
    .get(url + `/users`, {
      headers,
    })
    .then((response) => {
      const { data } = response.data;
      const filterAgentData = data.filter((data) => {
        // filter agent out from the list of users
        return data.uid !== AGENTUID;
      });
      res.json(filterAgentData);
    })
    .catch((error) => console.error("Error:", error));
});

router.get("/create", (req, res) => {
  const data = {
    uid: new Date().getTime(),
    name: "Chat Support",
  };

  console.log(url);
  console.log(chat_headers);
  axios
    .post(url + "/users", JSON.stringify(data), {
      chat_headers,
    })
    .then((response) => {
      requestAuthToken(response.data.data.uid)
        .then((token) => {
          console.log("Success " + JSON.stringify(token));
          res.status(200).json(token);
        })
        .catch((error) => {
          console.error("Error", error);
        });
    })
    .catch((err) => {
      console.error(err);
    });
});
// this function will fetch token
const requestAuthToken = (uid) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url + `/users/${uid}/auth_tokens`, null, {
        headers,
      })
      .then((response) => {
        console.log("New Auth Token:", response.data);
        resolve(response.data.data);
      })
      .catch((error) => reject(error));
  });
};

module.exports = router;
