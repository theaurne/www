/*
	This code is kinda ugly but I don't have the time or patience to fix it
	Loads modelData into db
*/

const modelData = require('../src/model-data/PhotoApp');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/prog2053-part3', {useNewUrlParser: true, useUnifiedTopology: true});

const User = require('./schema/user.js');
const Photo = require('./schema/photo.js');
const SchemaInfo = require('./schema/schemaInfo.js');

const versionString = '1.0';
const removePromises = [User.deleteMany({}), Photo.deleteMany({}), SchemaInfo.deleteMany({})];

Promise.all(removePromises).then(function () {
	const userModels = modelData.userListModel();
	const mapFakeId2RealId = {};
	const userPromises = userModels.map(function (user) {
		return User.create({
			first_name: user.first_name,
			last_name: user.last_name,
			location: user.location,
			description: user.description,
			occupation: user.occupation
		}).then(function (userObj) {
			userObj.save();
			mapFakeId2RealId[user._id] = userObj._id;
			user.objectID = userObj._id;
			console.log('Adding user:', `${user.first_name} ${user.last_name}`, ' with ID ',
				user.objectID);
		}).catch(function (err) {
			console.error('Error create user', err);
		});
	});

	const allPromises = Promise.all(userPromises).then(function () {
		let photoModels = [];
		const userIDs = Object.keys(mapFakeId2RealId);
		for (let i = 0; i < userIDs.length; i++) {
			photoModels = photoModels.concat(modelData.photoOfUserModel(userIDs[i]));
		}
		const photoPromises = photoModels.map(function (photo) {
			return Photo.create({
				file_name: photo.file_name,
				date_time: photo.date_time,
				user_id: mapFakeId2RealId[photo.user_id]
			}).then(function (photoObj) {
				photo.objectID = photoObj._id;
				if (photo.comments) {
					photo.comments.forEach(function (comment) {
						photoObj.comments = photoObj.comments.concat([{
							comment: comment.comment,
							date_time: comment.date_time,
							user_id: comment.user.objectID
						}]);
						console.log('Adding comment of length %d by user %s to photo %s',
							comment.comment.length,
							comment.user.objectID,
							photo.file_name);
					});
				}
				photoObj.save();
				console.log('Adding photo:', photo.file_name, ' of user ID ', photoObj.user_id);
			}).catch(function (err) {
				console.error('Error create user', err);
			});
		});
		return Promise.all(photoPromises).then(function () {
			return SchemaInfo.create({
				version: versionString
			}).then(function (schemaInfo) {
				console.log('SchemaInfo object created with version ', schemaInfo.version);
			}).catch(function (err) {
				console.error('Error create schemaInfo', err);
			});
		});
	});

	allPromises.then(function () {
		mongoose.disconnect();
	});
}).catch(function (err) {
	console.error('Error create schemaInfo', err);
});
