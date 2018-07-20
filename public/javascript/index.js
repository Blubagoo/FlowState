
function checkAuthentication(need) {
	// $('.hide').hide();
	let url = window.location.href;
	let attempt = url.split("?");
	if(attempt.length > 1) {
		let username = url.split("username=")[1];
		
		if(localStorage[`user${username}`] == null) {
			return;
		};
		let localStore = JSON.parse(localStorage[`user${username}`])
		$.ajax({
			url: '/api/auth',
			headers: {
				"Authorization": `Bearer ${localStore.jwt}`
			},
			success: (data) => {
				console.log(data);
				changeStatus(username);
				checkNeeds(need, data);
				$('#nav-area').show();
			},
			error: (data) => {
				console.log(data.message);
			}
		});
	};
}
function checkNeeds(need, data) {
	if(need === 1) {
		console.log(VIDEO_URL)
		submitFileToApi(VIDEO_URL, data)
	}
}
function listenForCredentialEvent() {

	$('nav').on('click','#logout', (e)=> {
		console.log('button pressed')
		e.preventDefault();
		window.location.href = window.location.origin;
	});

	$('nav').on('click', '#new-user', (e) => {
		e.preventDefault();
		$('#legend').html(`
			<label for="user"></label>
			<input type="text" name="user" id="user-input" placeholder="Username">
			<label for="pass"></label>
			<input type="password" name="pass" id="pass-input" placeholder="Password">
			<button id="register-btn">Register</button>
			<div class="help-area">
				<p class="help-text"><a href ="#" class="help-text" id="demo">Just want a demo?</a></p>
				<p class="help-text">Or are you a new <a href="#" class="help-text" id="new-user">User</a>
			</div>
			`);
		$('nav').on('click', '#register-btn', (e) => {
			grabInput();
		})
	})
}
function changeStatus(user) {
	$('form').hide();
	$('nav').html(`
		<div class="logged-in">
			<p class="help-text">Hello, ${user} is logged in.</p>
			<button id="logout">LOGOUT</button>
		</div>
		`);
	$('.landing-area').remove();
	$('main').html(`
		<div class="dashboard-area">
			<div id="nav-area">
				<button id="new-btn">New Video</button>
				<button id="overall-btn">Overall Feel</button>
				<button id="lastVid-btn">Video Results</button>
			</div>
			<div class="canvas-overall">
				<canvas id="overall-chart"></canvas>
			</div>
			<div class="canvas-recent" hidden>
				<canvas id="recentVideo"></canvas>
			</div>
			<div id="help-info">
				<p class="help-info">Here the goal is to compare your notes with the our emotional tracking to find
				out what kind of emotions you were portraying while producing the peak of your code.
			</div>
		</div>
		`);
	callForAnalytics(user);
	callForData(user);
	listenForGraphEvent();

}





$(checkAuthentication)
$(listenForLogin);
$(listenForCredentialEvent)