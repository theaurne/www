/*
	Useful so that the base URL can be changed quickly when for example, the server port changes,
	instead of changing all of the fetchModel calls
*/
const BASE_URL = 'http://localhost:3001';

function fetchModel(url) {
	return new Promise(function (resolve, reject) {
		const xhr = new XMLHttpRequest();
		/*
			load event is also ok to use here,
			but readystatechange was giving me more descriptive errors
		*/
		xhr.addEventListener('readystatechange', () => {
			if (xhr.readyState !== 4) {
				return;
			}
			if (xhr.status !== 200) {
				reject(new Error(JSON.stringify({
					status: xhr.status,
					statusText: xhr.statusText,
					text: xhr.responseText
				})));
			} else {
				resolve(JSON.parse(xhr.responseText));
			}
		});
		xhr.open('GET', BASE_URL + url);
		xhr.send();
	});
}

export default fetchModel;
