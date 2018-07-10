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
		let firstName = fname.val();
		let lastName = lname.val();
		user.val('');
		pass.val('');
		fname.val('');
		lname.val('');
		console.log(username, password, firstName, lastName);
		postCredentials(username,password,firstName,lastName);

	});
}

function postCredentials(user, pass, fname, lname) {
	let jsonObject = {
			username: user,
			password: pass,
			firstName: fname,
			lastName: lname
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
			console.log('authenticated user');
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
	console.log(users);
	localStorage.setItem(`user${username}`, jsonReady);
	console.log(JSON.parse(localStorage[`user${username}`]));
	window.location = url;
}


$(grabInput)