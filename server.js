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
	
	Crime.find({}, 
	(err, crimes) => {
	  console.log(crimes);
      crimes.forEach((crime) => {
		if (!crime.gotLocation) {
			let location = crime.location.toLowerCase()
				.replace("blk", "")
				.replace("block", "")
				.replace("of", "")
				.replace("block of", "")
				.replace("centennial walkway", "centennial greenway")
				.replace("greenway walkway", "centennial greenway");
			if (location.includes("@") || location.includes("/") || location.includes(" at ") || location.includes(" near ")) {
				let index = 0;
				if (location.includes("@")) {
					index = location.indexOf("@");
				}
				else if (location.includes("/")) {
					index = location.indexOf("/");
				}
				else if (location.includes("near")) {
					index = location.indexOf("near");
				}
				else {
					index = location.indexOf("at");
				}
				location = location.substring(0, index);
			}
			let query = `https://nominatim.openstreetmap.org/search?street=${location}&postalcode=63112&format=json`;
			let queryBroad = `https://nominatim.openstreetmap.org/search?q=${location}&postalcode=63112&format=json`;
			fetch(query, {
				retries: 3,
				retryDelay: 1000
			  },{
			  method: 'POST'
			}).then(res => res.json())
			  .then(json => {
				console.log(query);
				if (json[0] === undefined) {
					fetch(queryBroad, {
					  method: 'POST'
					}).then(res => res.json())
					  .then(json => {
						console.log(queryBroad);
						if (json[0] !== undefined) {
							crime.lat = json[0].lat;
							crime.lon = json[0].lon;
							crime.gotLocation = true;
							crime.save();
						}
					});
				}
				else {
					crime.lat = json[0].lat;
					crime.lon = json[0].lon;
					crime.gotLocation = true;
					crime.save();
				}
			});
		}
	  });
    });


app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));