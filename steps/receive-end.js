var s = require("../smssidstore.js");
var sessions = s.sessions;
var geocode = require("../geocode.js");
var config = require("../config.js");
var download = require("../download.js");
var processItin = require("../itin-process.js");
var querystring = require("querystring")

var parseFromAddress = function(parsed,res,session) {
	var address = parsed.Body.substr(3);
	geocode(address, function(data) {
		var addressDetails = JSON.parse(data).results[0];

		if (!addressDetails) {
			res.twilioEnd("Address not recognized. Please try again.");
		} else {

			var fromLatLng = session.from.geometry.location.lat + "," + session.from.geometry.location.lng;
			var toLatLng = addressDetails.geometry.location.lat + "," + addressDetails.geometry.location.lng;

			var url = config.otpApiEndpoint + "/ws/plan?fromPlace=" + fromLatLng + "&toPlace=" + toLatLng;
			console.log(url);
			download(url, function(data){
				var ret = JSON.parse(data);
				if (!ret.plan || ret.plan.itineraries.length == 0) {
					res.twilioEnd("No route found to " + addressDetails.formatted_address + ". Reply again with YES followed by address to try again.")
					return;
				}
				var itin = ret.plan.itineraries[0];
				var steps = processItin(itin);

				steps.push("");
				steps.push("To try another destination, reply with AGAIN followed by address. To start again, respond with TRIP")
				
				var response = "Directions to " + addressDetails.formatted_address + ":\n";
				var twilioResponse = '<?xml version="1.0" encoding="UTF-8" ?><Response>';
				var numTexts = 1;
				for(var x = 0;x<steps.length;x++) {
					if (response.length + steps[x].length < 154) {
						response += steps[x] + "\r\n";
					} else {
						twilioResponse += "<Sms>(" + numTexts +") " + response + "</Sms>"
						response = steps[x] + "\r\n"
						numTexts++;
					}
				}
				twilioResponse += "<Sms>(" + (numTexts) + ") " + response + "</Sms></Response>";
				console.log(twilioResponse)


				res.writeHead(200, {'Content-Type': 'text/xml'});
				res.end(twilioResponse)

			},"application/json");
		}
	})
}
module.exports = function(parsed,res) {
	var session = sessions[parsed.From];
	console.log(parsed.From, session)
	if (parsed.Body.toLowerCase() == "yes") {
		res.twilioEnd("Please put the address you wish to travel to after YES");
		return true;
	}
	if (session != null && (parsed.Body.toLowerCase().indexOf("yes ") == 0 || parsed.Body.toLowerCase().indexOf("again ") == 0)) {
		parseFromAddress(parsed,res,session);
		return true;
	}
	return false;
}