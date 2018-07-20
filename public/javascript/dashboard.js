'use strict';
//check local storage for authentication
Chart.defaults.global.defaultFontColor = "#FAFFD8";
Chart.defaults.global.defaultFontSize = 10
// var canvas = document.getElementById('overall-chart');
// var aspectRatio = 1.5;    // height:width = 3:2
// canvas.height = canvas.width * aspectRatio;

function listenForNewVideo(user) {
	$('#newBtn').on('click', function() {
		window.location =  window.location.origin + `/upload.html?username=${user}`;
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
			console.log('making recent graph', data);
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
	var charts = new Chart (ctx, {
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
			fontSize: 30,
			scales: {
				yAxes: [{
					gridLines: {
						color: "white"
					},
					scaleLabel:{
						lineHeight: 100,
						fontSize: 80,
						labelString: "frames"
					}
				}],
				xAxes: [{
					gridLines: {
						color: "white"
					}
				}]
			}
		}
}); 
}



function makeGraphRecentVideo(data) {
	console.log(data);
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
		}]
	},
	options: {
			fontSize: 30,
			scales: {
				yAxes: [{
					gridLines: {
						color: "white"
					},
					scaleLabel:{
						lineHeight: 100,
						fontSize: 80,
						labelString: "frames"
					}
				}],
				xAxes: [{
					gridLines: {
						color: "white"
					}
				}]
			}
		}
	}); 
}

function listenForGraphEvent() {
	$('#lastVid-btn').on('click',(e)=> {
		e.preventDefault();
		$('.canvas-overall').hide();
		$('.canvas-recent').show();
	});
	$('#overall-btn').on('click', (e)=> {
		e.preventDefault();
		$('.canvas-recent').hide();
		$('.canvas-overall').show();
	});
	$('#new-btn').on('click', (e) => {
		e.preventDefault();
		$('.dashboard-area').remove();
		$('main').html(`
			<div class="upload-area">
				<div id="info">
					<p class="info-sect instructions">Take about a 20 second video about how your 
					current project is going.</h2>
				</div>
				<div id="vid-area">
					<div id="vid-nav-area">
						<button id="btn-start-recording" class="info">Start Recording</button>
						<button id="btn-stop-recording"  class="info" disabled>Stop Recording</button>
						<button id="dashboard-btn" class="info">Back to Dashboard</button>
					</div>
					<div class="main-area">
						<div class="videoNSample">
							<div class="video">
								<video autoplay="true" id="videoElement" alt="Sorry "></video>
							</div>
						</div>
					</div>
				</div>
			</div>
			`)
		runWebcam();
	});
}

// $(checkAuthentication);
$(listenForGraphEvent)

