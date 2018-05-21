const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const Game = require('./models/game.js')
const Team = require('./models/team.js')
const app = express();
const url = 'mongodb://nu-worldcupadmin:2018@ds257579.mlab.com:57579/nu-worldcup';
const axios = require('axios');

// For cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// For parsing application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));


//====ROOT DIRECTORY===//
app.get('/', function(req, res) {
  res.json('you are at the nu world cup server!');
  console.log('A GET request was made');
});

app.post('/', function(req, res) {
	console.log(req)
	res.json('challenge key')
 });

// EXAMPLES

// FOR A TEAM
// {
//     "_id": {
//         "$oid": "5ae78652734d1d133184096f"
//     },
//     "name": "Australia",
//     "flag": "au",
//     "points": 0,
//     "tournament": "women",
//     "abb": "AUS"
// }


// FOR A GAME
// {
//     "_id": {
//         "$oid": "5ae8aeb9734d1d1331848a12"
//     },
//     "team1": "Tm 1",
//     "score1": 0,
//     "team2": "Tm 2",
//     "score2": 0,
//     "type": "knockout",
//     "tournament": "co-rec",
//     "game": 19
// }


// KNOCKOUT GAME

// Find that game and update the teams



// Body sent like this from Slack:

// token=gIkuvaNzQIHg97ATvDxqgjtO
// team_id=T0001
// team_domain=example
// enterprise_id=E0001
// enterprise_name=Globular%20Construct%20Inc
// channel_id=C2147483705
// channel_name=test
// user_id=U2147483697
// user_name=Steve
// command=/addscore
// text=Mexico 2 Mozambique 2 co-rec group
// response_url=https://hooks.slack.com/commands/1234/5678
// trigger_id=13345224609.738474920.8088930838d88f008e0



//====MONGOOSE CONNECT===//
mongoose.connect(url, function (err, db) {
	if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
	} else {
		console.log('Connection established to', url);
	}
});

app.listen(process.env.PORT || 4000);
console.log('starting the application');