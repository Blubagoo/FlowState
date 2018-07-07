		
function makeGraph() {
	$('#graph-btn').on('click', function(e) {
		e.preventDefault();
		var data = {
		  
		  labels: ['date', 'date', 'date', 'date', 'date'],
		  // Our series array that contains series objects or in this case series data arrays
		  series: [
		    [5, 2, 4, 2, 0]
		  ]
		};
		new Chartist.Line('.ct-chart', data);
		console.log('new graph made');
	})

}
var data = {
		  
		  labels: ['date', 'date', 'date', 'date', 'date'],
		  // Our series array that contains series objects or in this case series data arrays
		  series: [
		    [5, 2, 4, 2, 0]
		  ]
		};
		new Chartist.Line('.ct-chart', data);
		console.log('new graph made');