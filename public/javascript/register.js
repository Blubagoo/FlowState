'use strict';

let user = $('#user-input');
let pass = $('#pass-input');
let fname = $('#fname-input');
let lname = $('#lname-input');

function grabInput(user, pass) {
	console.log('getting data');
	let expectedUser = user.split(/\s/);
	console.log(expectedPass, expectedUser);
	let expectedPass = pass.split(/\s/);
	let username = user.val();
	let password = pass.val();
	user.val('');
	pass.val('');
	if(expectedUser.length === 1 && expectedPass.length === 1) {
		postCredentials(username,password);
	}
	$('.help-area').append(`<p id="whiteSpace" class="help-text"> No whitespaces!`);
	setTimeout($('#whiteSpace').remove, 3 * 1000);
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
