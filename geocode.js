var url = require("url");
var http = require("http");
var download = require("./download.js");

module.exports = function(address,retFunc) {
	//address += ", New York";
	bounds = "40.589, -74.054|40.796, -73.783"
	download("http://maps.googleapis.com/maps/api/geocode/json?sensor=false&components=administrative_area:New+York&address=" + encodeURIComponent(address), function(data) {
		retFunc(data);
	})
}