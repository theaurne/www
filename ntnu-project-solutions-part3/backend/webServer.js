const express = require('express');
const cors = require('cors');
const async = require('async');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/prog2053-part3', {useNewUrlParser: true, useUnifiedTopology: true});

const SchemaInfo = require('./schema/schemaInfo');
const User = require('./schema/user');
const Photo = require('./schema/photo');
const Database = require('./utils/queries');

const portno = 3001;

const app = express();
app.use(cors());

app.use(express.static(__dirname));

app.get('/', function (_, response) {
	response.send(`Simple web server of files from ${__dirname}`);
});

app.get('/test/:p1', function (request, response) {
	// Express parses the ":p1" from the URL and returns it in the request.params objects.
	console.log('/test called with param1 = ', request.params.p1);

	const param = request.params.p1 || 'info';

	if (param === 'info') {
		// Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
		SchemaInfo.find({}, function (err, info) {
			if (err) {
				// Query returned an error.  We pass it back to the browser with an Internal Service
				// Error (500) error code.
				console.error('Doing /user/info error:', err);
				response.status(500).send(JSON.stringify(err));
				return;
			}
			if (info.length === 0) {
				// Query didn't return an error but didn't find the SchemaInfo object - This
				// is also an internal error return.
				response.status(500).send('Missing SchemaInfo');
				return;
			}

			// We got the object - return it in JSON format.
			console.log('SchemaInfo', info[0]);
			response.end(JSON.stringify(info[0]));
		});
	} else if (param === 'counts') {
		// In order to return the counts of all the collections we need to do an async
		// call to each collections. That is tricky to do so we use the async package
		// do the work.  We put the collections into array and use async.each to
		// do each .count() query.
		const collections = [
			{name: 'user', collection: User},
			{name: 'photo', collection: Photo},
			{name: 'schemaInfo', collection: SchemaInfo}
		];
		async.each(collections, function (col, doneCallback) {
			col.collection.countDocuments({}, function (err, count) {
				col.count = count;
				doneCallback(err);
			});
		}, function (err) {
			if (err) {
				response.status(500).send(JSON.stringify(err));
			} else {
				const obj = {};
				for (let i = 0; i < collections.length; i++) {
					obj[collections[i].name] = collections[i].count;
				}
				response.end(JSON.stringify(obj));
			}
		});
	} else {
		// If we know understand the parameter we return a (Bad Parameter) (400) status.
		response.status(400).send(`Bad param ${param}`);
	}
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', async function (_, response) {
	try {
		const users = await Database.getAllUsers();
		response.status(200).send(users);
	} catch (error) {
		response.status(500).send('Database error');
	}
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', async function (request, response) {
	try {
		const id = request.params.id;
		const user = await Database.getUserByID(id);
		if (user === null) {
			response.status(404).send('Not found');
			return;
		}
		response.status(200).send(user);
	} catch (error) {
		response.status(400).send('Invalid userID');
	}
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', async function (request, response) {
	/*
		There are multiple ways of solving this one
		If we were using a relational DB (MySQL for example) we'd use joins
		Since it's mongo we can either:
		- do a $lookup, which has complicated syntax
		- make a database request for each comment user (could take a long time)
		- get all users and set the user for each comment in JS (could also take a long time)
		The preferred approach depends on the situation and amount of data
	*/

	try {
		const id = request.params.id;
		const photos = await Database.getPhotosByUserID(id);
		if (photos === null || photos.length === 0) {
			response.status(404).send('Not found');
			return;
		}

		const users = await Database.getAllUsers();
		for (const photo of photos) {
			for (const comment of photo.comments) {
				comment.user = users.find((user) => user._id.equals(comment.user_id)); // need to use equals here because user._id's are ObjectID objects (http://mongodb.github.io/node-mongodb-native/api-bson-generated/objectid.html#equals)
				delete comment.user_id; // remove unnecessary field
			}
		}

		response.status(200).send(photos);
	} catch (error) {
		response.status(400).send('Invalid userID');
	}
});


const server = app.listen(portno, function () {
	const port = server.address().port;
	console.log(`Listening at http://localhost:${port} exporting the directory ${__dirname}`);
});
