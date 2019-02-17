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
var fs = require('fs');
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
var iterator = 0;
let crimes = [];
	
	Crime.find({},
	(err, crimesReturn) => {
	  //console.log(crimes);
	  let crimeSlices = [];
	  let sliceIndex = 0;
	  crimeSlices.push([]);

	  crimesReturn.forEach((elem) => {
	     if (elem.gotLocation == false) crimes.push(elem);
      });
	  forCrimes();

      crimes.forEach((crime) => {

      });
      //console.log(crimeSlices);

		// crimeSlices.forEach((slice) => {
		//     let mapped = slice.map((elem) => { return {"location": elem.location, "postalcode": 63112}; });
        //     fetch("http://open.mapquestapi.com/geocoding/v1/batch?key=AjJ7kIXjgAVYP6iW2YtL4tY7aRlEip9x", {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             locations: mapped
        //         }),
        //     }).then(res => res.json())
        //       .then(json => {
        //     	json.results.forEach((elem) => {
        //     	    if (elem.locations.length !== 0) {
        //                 console.log(elem.locations[0]);
        //             }
        //         });
        //     	// if (json[0] === undefined) {
        //     	// 	fetch(queryBroad, {
        //     	// 	  method: 'POST'
        //     	// 	}).then(res => res.json())
        //     	// 	  .then(json => {
        //     	// 		console.log(queryBroad);
        //     	// 		if (json[0] !== undefined) {
        //     	// 			crime.lat = json[0].lat;
        //     	// 			crime.lon = json[0].lon;
        //     	// 			crime.gotLocation = true;
        //     	// 			crime.save();
        //     	// 		}
        //     	// 	});
        //     	// }
        //     	// else {
        //     	// 	crime.lat = json[0].lat;
        //     	// 	crime.lon = json[0].lon;
        //     	// 	crime.gotLocation = true;
        //     	// 	crime.save();
        //     	// }
        //     });
        // });
    });


	function forCrimes() {
	    //console.log("Run: " + iterator);
	    let crime = crimes[iterator];
	    //console.log(crime);
        let matched = crime.location.match(re);
        if (matched !== null) {
            let numIndex = matched.index;
            crime.location = crime.location.substring(0, numIndex);
            crime.save();
        }
        if (crime.gotLocation == false) {
            // crimeSlices[sliceIndex].push(crime);
            // if (crimeSlices[sliceIndex].length === 100) {
            //     crimeSlices.push([]);
            //     sliceIndex++;
            // }
            let location = crime.location.toLowerCase()
                .replace("#", "")
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
            let query = `http://open.mapquestapi.com/nominatim/v1/search.php?key=vh8ALwgY4YR6ZvX28BJSaCi4yToXkxRP&street=${location}&postalcode=63112&format=json`;
            let queryBroad = `http://open.mapquestapi.com/nominatim/v1/search.php?key=vh8ALwgY4YR6ZvX28BJSaCi4yToXkxRP=${location}&postalcode=63112&format=json`;
            fetch(query, {
                method: 'POST'
            }).then(res => res.json())
                .then(json => {
                    //console.log(query);
                    if (json[0] === undefined) {
                        fetch(queryBroad, {
                            method: 'POST'
                        }).then(res => res.json())
                            .then(json => {
                                //console.log(queryBroad);
                                if (json[0] !== undefined) {
                                    Crime.updateOne({ _id: ObjectId(crime._id) }, { '$set': { gotLocation: true, lat: json[0].lat, lon: json[0].lon } }, (err) => console.log(err));
                                }
                                else {
                                    console.log("FAILED: " + location);
                                }
                            })
                            .catch(function() {
                                console.log("FAILED: " + location);
                            });
                    }
                    else {
                        Crime.updateOne({ _id: ObjectId(crime._id) }, { '$set': { gotLocation: true, lat: json[0].lat, lon: json[0].lon } }, (err) => console.log(err));
                    }
                })
                .catch(function() {
                    console.log("FAILED: " + location);
                });
        }
        iterator++;
        setTimeout(forCrimes, 1000);
    }

app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));