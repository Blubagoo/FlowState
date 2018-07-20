'use strict';

//get values for inputs


function listenForLogin() {
	$('#demo').on('click', (e)=> {
		e.preventDefault();
		authenticateUser("Demo", "password");
	})
	$('#submit-btn').on('click', e => {
	e.preventDefault();

	const username = $('#user-input').val().trim();
	const password = $('#pass-input').val().trim();

	$('#user-input').val('');
	$('#pass-input').val('');

	authenticateUser(username, password);

});
}
let Unauthorized = ""
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
			setLocalStorageVariables(data.user, data.authToken, data.url);
			$('#error-text').remove();
		},
		error: (err) => {
			console.log(err);
			if(err.status === 401) {
				$('.help-area').append(`
					<p id="error-text" class="help-text">Username/Password is invalid</p>
					`);
			}
		}
	}
	$.ajax(settings);
}
function setLocalStorageVariables(username, JWT_TOKEN, url) {
console.log('setting variables')	
	let users = {};
	Object.assign(users, {
		user: username,
		jwt: JWT_TOKEN,
		authenticated: true
	});

	let jsonReady = JSON.stringify(users);
	localStorage.setItem(`user${username}`, jsonReady);
	window.location = window.location.origin + url;
}






