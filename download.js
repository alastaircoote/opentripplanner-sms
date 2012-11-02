var url = require("url");
var http = require("http");
var https = require("https");


module.exports = function(urlToFetch, retFunc,accepts) {
	var options = url.parse(urlToFetch);
	if (accepts) {
		options.headers = {
			"Accepts":"application/json"
		}
	}
	console.log(options)
	var d = http;
	if (options.protocol == "https:") d = https;
	d.get(options, function(resp){
		var data = [];
		resp.on("data", function(chunk) {
			data.push(chunk.toString());
		});
		resp.on("end", function() {
			retFunc(data.join(""));
		});
	})
}