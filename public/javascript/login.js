'use strict';

//get values for inputs

function listenForLogin() {
	console.log('listening')
	$('#submit-btn').on('click', e => {
	e.preventDefault();
	console.log('button-pressed');

	let username = $('#user-input').val();
	let password = $('pass-input').val();

	$('#user-input').val('');
	$('pass-input').val('');

	authenticateUser(username, password)
})
}
//send to autenticate
function authenticateUser(user, pass) {
	console.log('trying to authenticate');
	const settings = {
		url:"/api/auth/refresh",
		data:{
			username: `${user}`,
			password: `${pass}`
		},
		method:"POST",
		success: (data) => {
			console.log('authenticated user');
			redirectWithToken(data.authToken, user);
		},
		error: (err) => console.error(err)
	}
	$.ajax(settings);

}
//redirect upon success
function redirectWithToken(jwt, user) {
	console.log('updating users token');
	updateDb(jwt);
	authenticateToken(jwt, user);
}
function updateDb(jwt) {
const settings = {
	url: `/api/users/token`,
	data: {
		authToken: `${jwt}`
	}

}
}

function authenticateToken(jwt, user) {
	const settings = {
		url: `api/auth/dashboard/${user}`,
		headers: {
			Authorization: `Bearer ${jwt}`
		}
	};
	$.ajax(settings);
}

$(listenForLogin);
