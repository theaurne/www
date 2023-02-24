/*
	Most of my projects have a Utils, which is useful for all of the code that is used in multiple places,
	to avoid repetition
*/
class Utils {
	static getUserIDFromRouterPathname(props) {
		const url = props.location.pathname;
		const parts = url.split('/');
		if (parts.length === 4) {
			return parts[3];
		}
		return null;
	}

	static getPageFromRouterPathname(props) {
		const url = props.location.pathname;
		const parts = url.split('/');
		if (
			parts[2] === 'users' &&
			(
				parts.length === 3 ||
				(parts.length === 4 && parts[3] === '')
			)) {
			return 'user-list';
		} else if (parts.length === 3 && parts[2] === 'photos') {
			return 'photos';
		} else if (parts.length === 4) {
			return parts[2];
		}

		return null;
	}
}

export default Utils;
