var fs = require("fs");

var fileRead = fs.readFileSync("./data.json","UTF-8");

var sessions = JSON.parse(fileRead);

module.exports = {
	sessions: sessions,
	persist: function() {
		fs.writeFileSync("./data.json", JSON.stringify(sessions))
	}
};