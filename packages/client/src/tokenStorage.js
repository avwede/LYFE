exports.storeToken = function (tok) {
	try {
		
		localStorage.setItem('user_data', tok.accessToken);
	}
	catch (e) {
		console.log(e.message);
	}
}

exports.retrieveToken = function () {
	var ud;
	try {
		ud = localStorage.getItem('user_data');
	}
	catch (e) {
		console.log(e.message);
	}
	return ud;
}