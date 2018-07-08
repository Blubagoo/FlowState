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
	let username = url.split("?")[1];
	console.log(username);
	callForData(username);


}
// call for data
function callForData(user) {
	console.log('going for data');
	const settings = {
		url: `/api/users/analytics/${user}`,
		success: (data) => {
			console.log('got data', data);
		},
		error: (err) => console.error(err)
	};
	$.ajax(settings);
}
// display data 

		
function makeGraph() {
	$('#graph-btn').on('click', function(e) {
		console.log('button pressed')
		e.preventDefault();
		var data = {
		  
		  labels: ['date', 'date', 'date', 'date', 'date'],
		  // Our series array that contains series objects or in this case series data arrays
		  series: [
		    [5, 2, 4, 2, 0]
		  ],

		};
		new Chartist.Line('.ct-chart', data);
		console.log('new graph made');
	})

}

$(getUsername);
$(makeGraph);


