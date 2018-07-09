'use strict';



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
	console.log(username);
	callForAnalytics(username);
	callForData(username);


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
	let mapDocs = data.map(doc => {
		return doc;
	})
	console.log(mapDocs);
	var data = {
	  labels: ['date', 'date', 'date', 'date', 'date'],
	  series: [
	    [5, 2, 4, 2, 0]
	  ],
	};
	new Chartist.Line('.ct-chart', data);
	console.log('new overall graph made');
}

var anger = [];
var disgust = [];
var fear = [];
var joy = [];
var sadness = [];
var surprise = [];
var date = [];

function makeGraphRecentVideo(data) {
	let mapVid = data[0].frames.map(frame => {
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

	})
	console.log(anger);
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
	new Chartist.Line('.ct-chart', data);
	console.log('new overall graph made');
}

$(getUsername);


