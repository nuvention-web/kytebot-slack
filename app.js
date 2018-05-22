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


// Look up a user by email: https://api.slack.com/methods/users.lookupByEmail

// Look up a user by ID: https://api.slack.com/methods/users.profile.get




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