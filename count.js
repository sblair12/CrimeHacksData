//====LIST DEPENDENCIES===//
const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose').set('debug', true);
const app = express();
const url = 'mongodb+srv://crimedb:wTEBNvklC8J5yFNC@crimedb-um97o.mongodb.net/crimeDB?retryWrites=true';
const dotenv = require("dotenv").config();
const fetch = require('fetch-retry');
var dateFormat = require('dateformat');
//=========================//

const port = process.env.PORT || 5000;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

mongoose.connect(url);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Crime = require('./models/crime.js');
//ENDPOINTS

let re = /\d{6}/;
var ObjectId = require('mongodb').ObjectID;
let crimeStrings = ["burglary", "theft", "assault", "carjacking", "sexual", "nonviolent"];
let keywords = [
	["burglar", "property", "damaged"],
	["theft", "rob", "armed", "abduction", "telephone", "stolen", "lost"],
	["assault", "shoot", "missing", "protection", "bomb", "warrant", "vandal", "fugitive", "hazing", "resisting"],
	["car", "motor", "vehicle"],
	["sexual", "abuse", "misconduct", "article", "harassment", "harass", "exposing", "stalking", "lewd", "violence"],
	["college", "phishing", "disturbance", "accident", "medical", "fire", "trespassing", "judicial", "drug", "fraud", "alarm", "tamper", "hazard", "suspicious", "incident", "forgery", "investigation", "admin", "traffic", "information", "sick", "spill", "maintenance", "peace", "counterfeit", "liquor", "chemical", "solicitors", "noise", "possession", "porn", "parking", "alcohol", "non", "noncriminal", "shoplift"]
];

	let count = 0;
	Crime.find({},
	(err, crimes) => {
	  crimes.forEach((crime) => {
	  	count++;
	  	// var done = false;
	  	// for (var i = 0; i < keywords.length; i++) {
	  	// 	for (var j = 0; j < keywords[i].length; j++) {
		// 		if (crime.type.toLowerCase().includes(keywords[i][j]) || crime.description.toLowerCase().includes(keywords[i][j])) {
		// 			crime.category = crimeStrings[i];
		// 			crime.save();
		// 			done = true;
		// 			break;
		// 		}
		// 	}
		// 	if (done) break;
		// }
	  });
	  console.log(count++);
    });