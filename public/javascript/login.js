'use strict';

//get values for inputs


function listenForLogin() {
	console.log('listening')
	$('#submit-btn').on('click', e => {
	e.preventDefault();
	console.log('button-pressed');

	const username = $('#user-input').val().trim();
	const password = $('#pass-input').val().trim();

	let json = {};
	json.username = username;
	json.password = password;

	console.log(json);

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
	console.log(info)
	const settings = {
		url:"/api/auth/login",
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
			redirectWithToken(data.authToken, user);
		},
		error: (err) => console.log(err)
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
	console.log('updating database');
	const settings = {
		url: `/api/users/token`,
		data: {
			authToken: `${jwt}`
		},
		method: "PUT",
		dataType: "json",
		success: (data) => {
			console.log('success we have updated the db', data);
		},
		error: (err) => {
			console.error(err);
		}
	};
	
	$.ajax(settings);
}

function authenticateToken(jwt, user) {
	const settings = {
		url: `api/auth/dashboard/${user}`,
		headers: {
			Authorization: `Bearer ${jwt}`
		},

	};
	$.ajax(settings);
}

$(listenForLogin);







