'use strict';

//get values for inputs


function listenForLogin() {
	$('#submit-btn').on('click', e => {
	e.preventDefault();

	const username = $('#user-input').val().trim();
	const password = $('#pass-input').val().trim();

	$('#user-input').val('');
	$('#pass-input').val('');

	authenticateUser(username, password);

});
}

//send to autenticate
function authenticateUser(user, pass) {
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
			setLocalStorageVariables(user, data.authToken, data.local);
		},
		error: (err) => console.log(err)
	}
	$.ajax(settings);
}
function setLocalStorageVariables(username, JWT_TOKEN, url) {	
	let users = {};
	Object.assign(users, {
		user: username,
		jwt: JWT_TOKEN,
		authenticated: true
	});

	let jsonReady = JSON.stringify(users);
	localStorage.setItem(`user${username}`, jsonReady);
	window.location = url;
}





$(listenForLogin);







