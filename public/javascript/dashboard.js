'use strict';
//check local storage for authentication
Chart.defaults.global.defaultFontColor = "#FAFFD8";

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
	const settings = {
		url: `/api/users/analytics/${user}`,
		success: (data) => {
			makeGraphOverall(data);
		},
		error: (err) => console.error(err)
	};
	$.ajax(settings);
}
function callForData(user) {
	const settings = {
		url: `/api/users/analytics/dynamic/${user}`,
		success: (data) => {
			makeGraphRecentVideo(data);
		},
		error: (err) => console.error(err)
	};
	$.ajax(settings);
}
// display data 
function serializeDate(date) {
	let splitDate = date.split("T");
	let moDtYr = splitDate[0].split("-");
	return `${moDtYr[1]}-${moDtYr[2]}-${moDtYr[0]}`
}

function makeGraphOverall(data) {
	var ctx = document.getElementById('overall-chart').getContext('2d');
	var anger = [];
	var disgust = [];
	var fear = [];
	var joy = [];
	var sadness = [];
	var surprise = [];
	var date = [];
	var glances = [];
	var dwell = [];
	var positive = [];
	var neutral = [];
	var negative = [];
	let mapDocs = data.map(doc => {
		let dte = doc.date;
		date.push(serializeDate(dte));
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
		let glnces = doc.glances;
		glances.push(glnces);
		let dwll = doc.dwell;
		dwell.push(dwll);
		let pstv = doc.positive;
		positive.push(pstv);
		let ntrl = doc.neutral;
		neutral.push(ntrl);
		let ngtv = doc.negative;
		negative.push(ngtv);
	});
	var chart = new Chart (ctx, {
		type:'line',
		data: {
			labels: date,
			datasets: [{
				label:"anger",
				borderColor: "#CA6624",
				data: anger
			},
			{
				label:"fear",
				borderColor: "#5C3085",
				data: fear
			},
			{
				label:"disgust",
				borderColor: "#4AC85C",
				data: disgust
			},
			{
				label:"joy",
				borderColor: "#F0ED2B",
				data: joy
			},
			{
				label:"sadness",
				borderColor: "#5D70FC",
				data: sadness
			},
			{
				label:"surprise",
				borderColor: "#F34DFE",
				data: surprise
			}
			]
		},
		options: {
			responsive: false,
			fontSize: 30,
			scales: {
				yAxes: [{
					scaleLabel:{
						lineHeight: 100,
						fontSize: 80,
						labelString: "frames"
					}
				}]
			}
		}
}); 
}



function makeGraphRecentVideo(data) {
	var anger = [];
	var disgust = [];
	var fear = [];
	var joy = [];
	var sadness = [];
	var surprise = [];
	var date = [];
	var mapVid = data[0].frames.map((frame, index) => {
		let dt = index + 1
		date.push(dt);
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
	var ctx = document.getElementById('recentVideo').getContext('2d');
	var chart = new Chart (ctx, {
	type:'line',
	data: {
		labels: date,
		datasets: [{
			label:"anger",
			borderColor: "#CA6624",
			data: anger
		},
		{
			label:"fear",
			borderColor: "#5C3085",
			data: fear
		},
		{
			label:"disgust",
			borderColor: "#4AC85C",
			data: disgust
		},
		{
			label:"joy",
			borderColor: "#F0ED2B",
			data: joy
		},
		{
			label:"sadness",
			borderColor: "#5D70FC",
			data: sadness
		},
		{
			label:"surprise",
			borderColor: "#F34DFE",
			data: surprise
		}
		]
	},
	options: {responsive: false}
}); 
	


}

function listenForEvent() {
	$('#lastVid-btn').on('click',(e)=> {
		e.preventDefault();
		$('.canvas-overall').hide();
		$('.canvas-recent').show();
	});
	$('#overall-btn').on('click', (e)=> {
		e.preventDefault();
		$('.canvas-recent').hide();
		$('.canvas-overall').show();

	})
}

$(checkAuthentication);
$(listenForEvent)

