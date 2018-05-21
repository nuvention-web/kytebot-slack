const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const User = require('./models/user.js')
const Triad = require('./models/triad.js')
const app = express();
// const url = '';
const axios = require('axios');

// For cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// For parsing application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 


//====ROOT DIRECTORY===//
app.get('/', function(req, res) {
  res.json('you are at the kyte-slackbot server!');
  console.log('A GET request was made');
});

app.post('/', function(req, res) {
	console.log(req)
	res.json({'challenge': 'the token'})
 });

// app.post('/visualize', function(req, res) {

//  });

//====MONGOOSE CONNECT===//
// mongoose.connect(url, function (err, db) {
// 	if (err) {
// 		console.log('Unable to connect to the mongoDB server. Error:', err);
// 	} else {
// 		console.log('Connection established to', url);
// 	}
// });

app.listen(process.env.PORT || 4000);
console.log('starting the application');