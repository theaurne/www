/*
	Like in the frontend where we had the a separate file for requests,
	in the backend there should be a file (or multiple) for database queries
*/

const User = require('../schema/user');
const Photo = require('../schema/photo');
const Utils = require('./utils');

class Database {
	static getAllUsers() {
		return new Promise((resolve, reject) => {
			User.find((error, users) => {
				if (error) {
					return reject(error);
				}

				const data = users.map((user) => Utils.dbUserToAPIUserBasic(user));
				resolve(data);
			});
		});
	}

	static getUserByID(id) {
		return new Promise((resolve, reject) => {
			User.findOne({_id: id}, (error, user) => {
				if (error) {
					return reject(error);
				}

				if (!user) {
					return resolve(null);
				}

				const data = Utils.dbUserToAPIUserFull(user);
				resolve(data);
			});
		});
	}

	static getPhotosByUserID(id) {
		return new Promise((resolve, reject) => {
			Photo.find({user_id: id}, (error, photos) => {
				if (error) {
					return reject(error);
				}

				if (!photos) {
					return resolve(null);
				}

				const data = photos.map((photo) => Utils.dbPhotoToAPIPhoto(photo));
				resolve(data);
			});
		});
	}
}

module.exports = Database;
