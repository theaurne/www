const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	location: String,
	description: String,
	occupation: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
