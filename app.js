const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const User = require('./models/user.js')
const Triad = require('./models/triad.js')
const app = express();
const url = 'mongodb://admin:kyteadmin@ds231070.mlab.com:31070/kyte-slack';
const axios = require('axios');

// For cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// For parsing application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));

// For parsing JSON
app.use(bodyParser.json()); 


//====ROOT DIRECTORY===//
app.get('/', function(req, res) {
  res.json('you are at the kyte-slackbot server!');
  console.log('A GET request was made');
});

// Here we get all activity. Need to parse by the event type and change the database
app.post('/activity', function(req, res) {
	console.log(req.body);
	res.json({'challenge': req.body.challenge});
 });

function newChannel(body) {
	// Add new users and traid to the database
	// Initialize everything to 0
}

function handleMessage(body) {
	User.findOne({'name': body.user}, (err, user) => {
		if (err) {
			console.log("Error in finding User", err)
		}
		if (user) {
			user.totalMessages = user.totalMessages + 1;
			user.messages = user.messages + 1;
			user.save((err) => {
				if (err) {
			  		console.log("Error adding messagge info to mongo", err);
			  	}
			});

			Triad.findOne({'channel': body.channel}, (err, triad) => {
				if (err) {
					console.log("Error in finding Triad", err)
				}
				if (triad) {
					// Add the stats to the triad for the mentor/mentee
				}
			});
		}
		else {
			// Couldn't find the user. Add the user to the database
		}
	});
}


// Look up a user by email: https://api.slack.com/methods/users.lookupByEmail

// Look up a user by ID: https://api.slack.com/methods/users.profile.get


// For next dev slice:
// app.post('/visualize', function(req, res) {

//  });

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