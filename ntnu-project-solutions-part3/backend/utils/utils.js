/*
	Utils here are used to convert between db models and the data format our API needs to expose
*/
class Utils {
	static dbUserToAPIUserBasic(user) {
		return {
			_id: user._id,
			first_name: user.first_name,
			last_name: user.last_name
		};
	}

	static dbUserToAPIUserFull(user) {
		return {
			_id: user._id,
			first_name: user.first_name,
			last_name: user.last_name,
			location: user.location,
			description: user.description,
			occupation: user.occupation
		};
	}

	static dbPhotoToAPIPhoto(photo) {
		return {
			_id: photo._id,
			user_id: photo.user_id,
			file_name: photo.file_name,
			date_time: photo.date_time,
			comments: photo.comments.map((comment) => ({
				_id: comment._id,
				comment: comment.comment,
				date_time: comment.date_time,
				user_id: comment.user_id
			}))
		};
	}
}

module.exports = Utils;
