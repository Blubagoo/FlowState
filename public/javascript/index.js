Chart.defaults.global.defaultFontColor = "#FAFFD8";
function makeGraphOverall(data) {
	var ctx = document.getElementById('graph2').getContext('2d');
	var charts = new Chart (ctx, {
		type:'bar',
		data: {
			datasets: [{
				label: "anger",
				backgroundColor: "#CA6624",
				data: [12]
			},
			{
				label: "joy",
				backgroundColor: "#5C3085",
				data: [47,58,26,31,1,58,47]
			},
			{
				label: "sadness",
				backgroundColor: "#4AC85C",
				data: [85]
			},
			{
				label: "surprise",
				backgroundColor: "#F0ED2B",
				data: [22]
			},
			{
				label: "disgust",
				backgroundColor: "#5D70FC",
				data: [65]
			},
			{
				label: "fear",
				backgroundColor: "#F34DFE",
				data: [29]
			}
			]
		},
		options: {responsive: false}
}); 
}



function makeGraphRecentVideo(data) {

	var ctx = document.getElementById('graph1').getContext('2d');

	var chart = new Chart (ctx, {
	type:'bar',
	data: {
		datasets: [{
			label: "joy",
			backgroundColor: "#CA6624",
			data: [8]
		},
		{
			label: "fear",
			backgroundColor: "#5C3085",
			data: [44]
		},
		{
			label: "anger",
			backgroundColor: "#4AC85C",
			data: [5]
		},
		{
			label: "sadness",
			backgroundColor: "#F0ED2B",
			data: [58]
		},
		{
			label: "disgust",
			backgroundColor: "#5D70FC",
			data: [83]
		},
		{
			label: "surprise",
			backgroundColor: "#F34DFE",
			data: [12]
		}]
	},
	options: {responsive: false}
	}); 
}

$(makeGraphRecentVideo);
$(makeGraphOverall);