'use strict';
//check local storage for authentication
function checkAuthentication() {
	let username = getUsername();
	//if not authenticated redirect
	if(localStorage[`user${username}`] == null) {
		window.location = "https://flow-state.herokuapp.com/login.html";
	}
	
	let localStore = JSON.parse(localStorage[`user${username}`])
	$.ajax({
		url: '/api/auth',
		headers: {
			"Authorization": `Bearer ${localStore.jwt}`
		},
		success: () => {
			callForAnalytics(username);
			callForData(username);
			listenForNewVideo(username);
		},
		error: () => {
			window.location = "https://flow-state.herokuapp.com/login.html";
		}
	})

}

function listenForNewVideo(user) {
	console.log('listening for new video');
	$('#newBtn').on('click', function() {
		console.log('pressing button');
		window.location = `https://flow-state.herokuapp.com/upload.html?username=${user}`;
	});
}


const serialize = function() {
	return {
		user: this.user || "",
		date: this.date || "",
		anger: this.anger || "",
		disgust: this.disgust || "",
		fear: this.fear || "",
		joy: this.joy || "",
		sadness: this.sadness || "",
		surprise: this.surprise || "", 
		glances: this.glances || "",
		dwell: this.dwell || "",
		attention: this.attention || "",
		positive: this.positive || "",
		negative: this.negative || "",
		neutral: this.neutral || ""
	};
};
// get username
function getUsername() {
	let url = window.location.href;
	let username = url.split("username=")[1];
	return username;
}

// call for data
function callForAnalytics(user) {
	console.log('going for overall analytics');
	const settings = {
		url: `/api/users/analytics/${user}`,
		success: (data) => {
			console.log('got data analytics', data);
			makeGraphOverall(data);
		},
		error: (err) => console.error(err)
	};
	$.ajax(settings);
}
function callForData(user) {
	console.log('going for video data');
	const settings = {
		url: `/api/users/analytics/dynamic/${user}`,
		success: (data) => {
			console.log('got data video', data);
			makeGraphRecentVideo(data);
		},
		error: (err) => console.error(err)
	};
	$.ajax(settings);
}
// display data 

		
function makeGraphOverall(data) {
	let anger = [];
	let disgust = [];
	let fear = [];
	let joy = [];
	let sadness = [];
	let surprise = [];
	let date = [];
	
	let mapDocs = data.map(doc => {
		let angr = doc.anger;
		anger.push(angr);
		let dsgst = doc.disgust;
		disgust.push(dsgst);
		let fr = doc.fear;
		fear.push(fr);
		let jy = doc.joy;
		joy.push(jy);
		let sad = doc.sadness;
		sadness.push(sad);
		let srprise = doc.surprise;
		surprise.push(srprise);
	});

	var data = {
	  labels: date,
	  series: [
	    anger,
	    disgust,
	    fear,
	    joy,
	    sadness,
	    surprise
	    ]
	};

// var ctx = document.getElementById('overall-chart').getContext('2d');
// var chart = new Chart (ctx, {
// 	type:'line',
// 	data: {
// 		labels: [1,2,3,4],
// 		datasets: [{
// 			label:"overall impression",
// 			backgroundColor: 'rgb(255,99,132)',
// 			borderColor: 'rgb(255,99,132)',
// 			data: 
// 				anger
		  

// 		}]
// 	},
// 	options: {}
// }); 


	new Chartist.Line('#progress-graph', data);
	console.log('new overall graph made');
}



function makeGraphRecentVideo(data) {
	let anger = [];
	let disgust = [];
	let fear = [];
	let joy = [];
	let sadness = [];
	let surprise = [];
	let date = [];

	if(data === !undefined){
		let mapVid = data[data.length - 1].frames.map(frame => {
			let angr = frame.anger;
			anger.push(angr);
			let dsgst = frame.disgust;
			disgust.push(dsgst);
			let fr = frame.fear;
			fear.push(fr);
			let jy = frame.joy;
			joy.push(jy);
			let sad = frame.sadness;
			sadness.push(sad);
			let srprise = frame.surprise;
			surprise.push(srprise);
		});
		var data = {
	  labels: ['date', 'date', 'date', 'date', 'date'],
	  series: [
	    anger,
	    disgust,
	    fear,
	    joy,
	    sadness,
	    surprise
	  ],
	};
	new Chartist.Line('#mood-graph', data);
	console.log('new overall graph made');
	}

	
}



$(checkAuthentication);


