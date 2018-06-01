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
// const messages = require('./messages');

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
	switch(req.body.event.type) {
		case 'channel_created':
			newChannel(req.body);
			break;
		case 'message':
			if (req.body.event.hasOwnProperty('subtype') && req.body.event.subtype == 'channel_join') {
				joinChannel(req.body);
			}
			else if (req.body.event.hasOwnProperty('subtype') && req.body.event.subtype == 'team_join') {
				// Not sure this is the right key for new_user being added to the slack
				// addUser(req.body);
				console.log('A new member joined the team');
			}
			else if (req.body.event.hasOwnProperty('subtype') && req.body.event.subtype == 'file_share') {
				addFile(req.body);
			}
			else {
				handleMessage(req.body);
			}
			break;
		default:
			console.log('The action is not something we are storing in the database')
	}
	res.json({'challenge': req.body.challenge});
 });

app.post('/action-endpoint', function(req, res) { 
	// Will receive a POST request when the button has been responded to
	// if the callback is mentor_or_mentee then addUser() for whatever they responded with
});

app.post('/options-load-endpoint', function(req, res) { 

});

function newChannel(body) {
	var new_triad = new Triad({ triadName: body.event.channel.name,
								channel: body.event.channel.id,
								mentor1: '',
								mentor2: '',
								mentee: '',
								mentor1Messages: 0,
								mentor2Messages: 0,
								menteeMessages: 0});

	User.findOne({'user': body.event.channel.creator}, (err, user) => {
		if (err) {
			console.log("Error in finding User for new channel", err)
		}
		if (user) {
			if (user.type === "Industry") {
				new_triad.mentor1 = user.user;
			}
			else if (user.type === "College") {
				new_triad.mentor2 = user.user;
			}
			else {
				// It was the mentee
				new_triad.mentee = user.user;
			}
		}
		new_triad.save(function (err) {
			if (err) {
				console.log("Error in saving new triad to db", err);
			}
		});
	});

	
}

function addFile(body) {
	console.log('Not implemented yet - addFile');
}

function joinChannel(body) {
	Triad.findOne({'channel': body.event.channel}, (err, triad) => {
		if (err) {
			console.log("Error in finding Triad for adding a new member to a triad", err)
		}
		if (triad) {
			// Look at user id and add to the correct mentor/mentee
			User.findOne({'user': body.event.user}, (err, user) => {
				if (err) {
					console.log("Error in finding User for new channel", err)
				}
				if (user) {
					if (user.type === "Industry" && triad.mentor1 !== "") {
						triad.mentor1 = user.user;
					}
					else if (user.type === "College" && triad.mentor2 !== "") {
						triad.mentor2 = user.user;
					}
					else if (triad.mentee !== "") {
						// It was the mentee
						triad.mentee = user.user;
					}
				}
				triad.save(function (err) {
					if (err) {
						console.log("Error in saving triad to db for new user", err);
					}
				});
			});
		}
	});
}

// Someone new is added to slack
function addUser(body) {
	// Need to dm the user and ask if they are a mentor (industry professional/college) or mentee (high school)
	console.log('Not implemented yet - addMember');
}


// Function that checks the time on the message at 9 and 9??? And then reminds them to send a message if they haven't yet.
// Do this to all users. Need to look into sending push notifications in this way

function triadMessage(body) {
	Triad.findOne({'channel': body.event.channel}, (err, triad) => {
		if (err) {
			console.log("Error in finding Triad", err)
		}
		if (triad) {
			// Look at user id and add to the correct mentor/mentee
			if (body.event.user = triad.mentor1) {
				triad.mentor1Messages = triad.mentor1Messages + 1;
			}
			else if (body.event.user = triad.mentor2) {
				triad.mentor2Messages = triad.mentor2Messages + 1;
			}
			else {
				// It was the mentee
				triad.menteeMessages = triad.menteeMessages + 1;
			}
			triad.save((err) => {
				if (err) {
					console.log("Error adding message to mlab in triad for user")
				}
			});
		}
	});
}

function handleMessage(body) {
	User.findOne({'user': body.event.user}, (err, user) => {
		if (err) {
			console.log("Error in finding User", err)
		}
		if (user) {
			console.log('there was a user');
			user.totalMessages = user.totalMessages + 1;
			user.messages = user.messages + 1;
			user.save((err) => {
				if (err) {
			  		console.log("Error adding messagge info to mlab", err);
			  	}
			});
			triadMessage(body);
		}
	});
}


// Look up a user by email: https://api.slack.com/methods/users.lookupByEmail

// Look up a user by ID: https://api.slack.com/methods/users.profile.get


// For next dev slice:
app.post('/report', function(req, res) {
	// The one parameter we have is the triad name

	// Visualize the data

 });

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