import fetchModel from '../lib/fetchModelData';

/*
	Separating Requests into it's own thing for convenience when error checking
	+ for not having to ctrl+f fetchModel whenever making changes.
	Every request and how to process it to turn it into usable data should be here.
	Very common to do something like this in bigger systems.
*/
class Requests {
	static async getTestInfo() {
		try {
			const test = await fetchModel('/test/info');
			return {test, error: null};
		} catch (error) {
			return {test: null, error};
		}
	}

	static async getAllUsers() {
		try {
			const users = await fetchModel('/user/list');
			return {users, error: null};
		} catch (error) {
			return {users: [], error};
		}
	}

	static async getUserByID(id) {
		try {
			const user = await fetchModel(`/user/${id}`);
			return {user, error: null};
		} catch (error) {
			return {user: null, error};
		}
	}

	static async getUserPhotosByID(id) {
		try {
			const photos = await fetchModel(`/photosOfUser/${id}`);
			return {photos, error: null};
		} catch (error) {
			return {photos: [], error};
		}
	}
}

export default Requests;
