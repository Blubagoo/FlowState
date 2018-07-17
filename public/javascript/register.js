'use strict';

let user = $('#user-input');
let pass = $('#pass-input');
let fname = $('#fname-input');
let lname = $('#lname-input');

function grabInput() {
	$('#submit-btn').on('click', (e)=> {
		e.preventDefault();
		console.log('getting data');

		let username = user.val();
		let password = pass.val();
		user.val('');
		pass.val('');
		fname.val('');
		lname.val('');

		postCredentials(username,password);

	});
}

function postCredentials(user, pass) {
	let jsonObject = {
			username: user,
			password: pass
		}
	const settings = {
		url: '/api/users',
		headers: {
			"Content-Type": "application/json"
		},
		method: "POST",
		data: JSON.stringify(jsonObject),
		success:(data) => {
			getJWT(data.authToken, user, pass)
		},
		error: (err) =>
			console.error(err)
	}
	$.ajax(settings);
}

function getJWT(jwt, user, pass) {
	var info = {
		username: user,
		password: pass
	};
	const settings = {
		url:`/api/auth/login/${user}`,
		headers: {
			"Content-Type": "application/json" 
		},
		data: JSON.stringify(info),
		contentType: "application/json",
		processData: false,
		dataType: "json",
		method:"POST",
		success: (data) => {
			setLocalStorageVariables(user, data.authToken, data.url);
		},
		error: (err) => console.log(err)
	}
	$.ajax(settings);
}

function setLocalStorageVariables(username, JWT_TOKEN, url) {	
	let users = {};
	Object.assign(users, {
		user: username,
		jwt: JWT_TOKEN
	});
	let jsonReady = JSON.stringify(users);
	localStorage.setItem(`user${username}`, jsonReady);
	window.location = url;
}


$(grabInput)