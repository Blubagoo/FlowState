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


}
// call for data
function callForAnalytics(user) {
	console.log('going for overall analytics');
	const settings = {
		url: `/api/users/analytics/${user}`,
		success: (data) => {
			console.log('got data analytics', data);
		},
		error: (err) => console.error(err)
	};
	$.ajax(settings);
}
function callForData(data) {
	console.log('going for video data');
	const settings = {
		url: `/api/users/analytics/${user}`,
		success: (data) => {
			console.log('got data video', data);
		},
		error: (err) => console.error(err)
	};
	$.ajax(settings);
}
// display data 

		
function makeGraphOverall(data) {
	console.log('button pressed');
	var data = {
	  labels: ['date', 'date', 'date', 'date', 'date'],
	  series: [
	    [5, 2, 4, 2, 0]
	  ],
	};
	new Chartist.Line('.ct-chart', data);
	console.log('new overall graph made');
}



function makeGraphRecentVideo(data) {
	console.log('button pressed');
	var data = {
	  labels: ['date', 'date', 'date', 'date', 'date'],
	  series: [
	    [5, 2, 4, 2, 0]
	  ],
	};
	new Chartist.Line('.ct-chart', data);
	console.log('new overall graph made');
}

$(getUsername);
$(makeGraph);


