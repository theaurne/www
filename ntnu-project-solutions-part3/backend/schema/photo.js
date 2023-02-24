const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	comment: String,
	date_time: {type: Date, default: Date.now},
	user_id: mongoose.Schema.Types.ObjectId
});

const photoSchema = new mongoose.Schema({
	file_name: String,
	date_time: {type: Date, default: Date.now},
	user_id: mongoose.Schema.Types.ObjectId,
	comments: [commentSchema]
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
