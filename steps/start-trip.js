var s = require("../smssidstore.js");
var sessions = s.sessions;

var startTripRequest = function(parsed,res) {
	sessions[parsed.From] = {

	};
	res.twilioEnd("What is your starting address?");
	s.persist();
}


module.exports = function(parsed,res) {
	if (parsed.Body.toLowerCase() == "trip") {
		console.log("start trip")
		startTripRequest(parsed,res);
		return true;
	}
	return false;
}