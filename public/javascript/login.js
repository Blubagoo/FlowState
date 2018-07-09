'use strict';

//get values for inputs


function listenForLogin() {
	console.log('listening')
	$('#submit-btn').on('click', e => {
	e.preventDefault();
	console.log('button-pressed');

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
			authenticateToken(data.authToken, user);
		},
		error: (err) => console.log(err)
	}
	$.ajax(settings);
}


function authenticateToken(jwt, user) {
	console.log('trying to authenticate');
	const settings = {
		url: `api/auth/dashboard/${user}/${jwt}`,
		headers: {
			Authorization: `Bearer ${jwt}`
		},
		success: (data) => {
			console.log('success', data);
			window.location = data.url;
		},
		error: (err) => console.error(err)

	};
	$.ajax(settings);
}



$(listenForLogin);







