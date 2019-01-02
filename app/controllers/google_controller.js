import axios from 'axios';
import querystring from 'querystring';
import Admin from '../models/admin';
// import Review from '../models/review';

const { google } = require('googleapis');
// import dotenv from 'dotenv';
const YOUR_CLIENT_ID = '38722714684-55v0i5qrm0sgual3kt15gcog4chgiubk.apps.googleusercontent.com';
const YOUR_REDIRECT_URL = 'http://localhost:8080';
const YOUR_CLIENT_SECRET = 'gZn3pGxt1QJdxmOQZV2Y6d4f';

export async function fetchGoogleTokens(req, res) {
  console.log('in fetchGoogleTokens');
  console.log(req.body);
  const oauth2Client = new google.auth.OAuth2(
    YOUR_CLIENT_ID,
    YOUR_CLIENT_SECRET,
    YOUR_REDIRECT_URL,
  );

  const { tokens } = await oauth2Client.getToken(req.body.code);
  console.log('tokens', tokens);
  oauth2Client.setCredentials(tokens);
  const accessToken = tokens.access_token;
  const admin = new Admin();
  admin.UserName = 'ACP';
  admin.GoogleAccessToken = tokens.access_token;
  admin.GoogleRefreshToken = tokens.refresh_token;
  admin.save().then((result) => {
    console.log('saved admin token', result);
  }).catch((err) => {
    console.log('error', err);
  });
  await axios.post('http://localhost:5000/google/', { accessToken })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

setInterval(async (req, res) => {
  console.log('in refreshData');
  Admin.find({ UserName: 'ACP' }, (err, admin) => {
    if (err) console.log('error finding ACP');
    else {
      console.log('finding ACP response', admin[0]);
      console.log('refresh token', admin[0].GoogleRefreshToken);
      axios.post(
        'https://www.googleapis.com/oauth2/v4/token',
        querystring.stringify({
          grant_type: 'refresh_token',
          refresh_token: admin[0].GoogleRefreshToken,
          client_id: YOUR_CLIENT_ID,
          client_secret: YOUR_CLIENT_SECRET,
        }),
      ).then((response) => {
        console.log('trying to fetch access token');
        console.log(response.data);
        axios.post('http://localhost:5000/google/', { accessToken: response.data.access_token })
          .then((reviews) => {
            console.log(reviews.data);
            // for (let i = 0; i < reviews.data.length; i += 1) {
            //   Review.find(
            //     { Content: reviews.data[i].Content },
            //     { Date: reviews.data[i].Date },
            //     { Rating: reviews.data[i].Rating },
            //     { Location: reviews.data[i].Location },
            //     (error, review) => {
            //       if (error) console.log('error finding review', reviews.data[i]);
            //       else {
            //         console.log('found review');
            //       }
            //     },
            //   );
            // }
          })
          .catch((error) => {
            console.log(error);
          });
      })
        .catch((error) => {
          console.log(error);
        });
    }
  });
  // await axios.post('http://localhost:5000/google/', { accessToken: req.body.accessToken })
  //   .then((response) => {
  //     console.log(response.data);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
}, 21600000);

export const saveAccessToken = (req, res) => {
  console.log('in fetchGoogleReviews');
};
