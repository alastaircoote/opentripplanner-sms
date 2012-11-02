var s = require("../smssidstore.js");
var sessions = s.sessions;
var geocode = require("../geocode.js");

var parseFromAddress = function(parsed,res,session) {
	var address = parsed.Body;
	geocode(address, function(data) {
		var addressDetails = JSON.parse(data).results[0];

		if (!addressDetails) {
			res.twilioEnd("Address not recognized. Please try again.");
		} else {
			res.twilioEnd("Starting at " + addressDetails.formatted_address +". If correct, reply with YES followed by your destination address.");
			session.pendingFrom = addressDetails;
		}
		s.persist();
	})
}

module.exports = function(parsed,res) {
	var session = sessions[parsed.From];
	if (parsed.Body.toLowerCase() == "yes") {
		res.twilioEnd("Please put the address you wish to travel to after YES");
		return true;
	}
	if (session != null && parsed.Body.toLowerCase().indexOf("yes ") != 0 && parsed.Body.toLowerCase().indexOf("again ") != 0) {
		parseFromAddress(parsed,res,session);
		return true;
	}
	else if (session != null && session.pendingFrom && (parsed.Body.toLowerCase().indexOf("yes ") == 0 || parsed.Body.toLowerCase().indexOf("again ") == 0)) {
		session.from = session.pendingFrom;
		delete session.pendingFrom;
		s.persist();
		console.log("switched to absolute from")
		return false;
	}
	return false;
}