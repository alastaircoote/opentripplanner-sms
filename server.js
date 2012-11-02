var http = require('http');
var config = require("./config.js");
var querystring = require("querystring");


var steps = [
	require("./steps/start-trip.js"),
	require("./steps/receive-start.js"),
	require("./steps/receive-end.js")
]



http.createServer(function (req, res) {
	req.formData = [];
	req.on("data", function(data) {
		req.formData.push(data.toString());
		console.log("data")
	});
	req.on("end", function() {
		var parsed = querystring.parse(req.formData.join(""));
		console.log(parsed)
		for(var x=0;x<steps.length;x++) {
			var parsedResponse = steps[x](parsed,res);
			console.log(parsedResponse)
			if (parsedResponse == true) break;
		}
	});
	
	
	res.on("end", function(){
		console.log("endreq")
	})

}).listen(3300);

