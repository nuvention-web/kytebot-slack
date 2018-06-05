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

// SLACK TESTS TOKEN FOR SENDING DMS
// xoxp-210179574949-210004780787-375259193188-8296155003a4cb704a1906f513f6ad0b
// curl --header "Content-Type: application/json" --request POST --data '{"ok": true, "channel": "U6604NYP5", "message": {"text": "Test message for dm", "username": "Kytebot", "type": "message", "subtype": "bot_message", "bot_id": "AAUJH6RK9"}}' https://slack.com/api/chat.postMessage?token=xoxp-210179574949-210004780787-375259193188-8296155003a4cb704a1906f513f6ad0b&channel=U6604NYP5&text=A%20direct%20message&pretty=1
// {
//     "ok": true,
//     "channel": "D66SUUBSB",
//     "ts": "1528143385.000209",
//     "message": {
//         "text": "A direct message",
//         "username": "Slack API Tester",
//         "bot_id": "BB1JA71SR",
//         "type": "message",
//         "subtype": "bot_message",
//         "ts": "1528143385.000209"
//     }
// }

// Different authentication for bot
// xoxb-210179574949-367778535666-Tk3dBc3tjvW9amgQG5gc9UyE

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
	// res.json(req.body)
 });

app.post('/options-load-endpoint', function(req, res) { 

});

let checkActivity = setInterval(checkTimes, 1000 * 10);
// 1000 * 60 * 60 * 24 checks once a day * 2 would be every two days
// let checkActivity = setInterval(checkTimes, 1000 * 60 * 60 * 12);
// Checking every 12 hours

function checkTimes() {
	var currentTime = (new Date).getTime();
	Triad.find({}, (err, triads) => {
		if (err) {
			console.log("Error in finding all triads");
		}
		if (triads) {
			for (var i = 0; i < triads.length; i++) {
				if (currentTime - triads[i].lastMessageMentor1 > 1000 ) {
					// 1000 * 60 * 60 * 12 * 24 * 2
					// Send message to the mentor1 to be more active in their triad
					console.log(triads[i].mentor1 + ' was reminded to send a message to their triad at ' + currentTime);
				}
				if (currentTime - triads[i].lastMessageMentor2 > 1000 ) {
					// 1000 * 60 * 60 * 12 * 24 * 2
					// Send message to the mentor1 to be more active in their triad
					console.log(triads[i].mentor2 + ' was reminded to send a message to their triad at ' + currentTime);
				}
				if (currentTime - triads[i].lastMessageMentee > 1000 ) {
					// 1000 * 60 * 60 * 12 * 24 * 2
					// Send message to the mentor1 to be more active in their triad
					console.log(triads[i].mentee + ' was reminded to send a message to their triad at ' + currentTime);
				}
				
				// Check each member time and compare it to the current epoch time

			}
			// User.find({}, (err, users) => {
			// 	if (err) {
			// 		console.log("Error finding all the users");
			// 	}
			// 	if (users) {
			// 		for (var i = 0; i < users.length; i++) {
			// 			console.log(users[i]);
			// 			// Check each member time and compare it to the current epoch time

			// 		}
			// 	}
			// });
		}
	});

	// MODIFY MESSAGES TO RECORD TIMES
	// check the seconds on every user within a triad
	// Check triad first
	// If have not been active for certain period of time, then send them a personal message from the application reminding them to be more active in their triad. 
	// If they have not been active in triad, add them to array
	// If have been 
}

function newChannel(body) {
	var new_triad = new Triad({ triadName: body.event.channel.name,
								channel: body.event.channel.id,
								mentor1: '',
								mentor2: '',
								mentee: '',
								mentor1Messages: 0,
								mentor2Messages: 0,
								menteeMessages: 0,
								lastMessageMentor1: 0,
								lastMessageMentor2: 0,
								lastMessageMentee: 0});

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
			else if (user.type === "High School") {
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

function joinChannel(body) {
	Triad.findOne({'channel': body.event.channel}, (err, triad) => {
		if (err) {
			console.log("Error in finding Triad for adding a new member to a triad", err)
		}
		if (triad) {
			// Look at user id and add to the correct mentor/mentee
			User.findOne({'user': body.event.user}, (err, user) => {
				if (err) {
					console.log("Error in finding User for new channel", err);
				}
				console.log(user);
				if (user) {
					if (user.type === "Industry" && triad.mentor1 === "") {
						triad.mentor1 = user.user;
					}
					else if (user.type === "College" && triad.mentor2 === "") {
						triad.mentor2 = user.user;
					}
					else if (user.type === "High School" && triad.mentee === "") {
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

app.post('/action-endpoint', function(req, res) { 
	// Will receive a POST request when the button has been responded to
	// if the callback is mentor_or_mentee then addUser() for whatever they responded with
});


// Function that checks the time on the message at 9 and 9??? And then reminds them to send a message if they haven't yet.
// Do this to all users. Need to look into sending push notifications in this way

function triadMessage(body) {
	Triad.findOne({'channel': body.event.channel}, (err, triad) => {
		if (err) {
			console.log("Error in finding Triad", err)
		}
		if (triad) {
			// Look at user id and add to the correct mentor/mentee
			if (body.event.user === triad.mentor1) {
				triad.mentor1Messages = triad.mentor1Messages + 1;
				triad.lastMessageMentor1 = body.event_time;
			}
			else if (body.event.user === triad.mentor2) {
				triad.mentor2Messages = triad.mentor2Messages + 1;
				triad.lastMessageMentor2 = body.event_time;
			}
			else {
				// It was the mentee
				triad.menteeMessages = triad.menteeMessages + 1;
				triad.lastMessageMentee = body.event_time;
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
			user.totalMessages = user.totalMessages + 1;
			user.messages = user.messages + 1;
			user.lastMessage = body.event_time;
			user.save((err) => {
				if (err) {
			  		console.log("Error adding messagge info to mlab", err);
			  	}
			});
			triadMessage(body);
		}
	});
}

function addFile(body) {
	console.log('Not implemented yet - addFile');
}

function addLink(body) {
	console.log('Not implemented yet - addLink');
}


// Look up a user by email: https://api.slack.com/methods/users.lookupByEmail

// Look up a user by ID: https://api.slack.com/methods/users.profile.get


// For next dev slice:
app.post('/report', function(req, res) {
	// The one parameter we have is the triad name

	// Visualize the data
	// Can expect the triad name as an argument - if not then we get all the triads info
	// This webhook is hooked up to slack, we just need to send a response with the right data

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