var defaultConfig = require("./config/defaults.json");
var customConfig;
try {
	customConfig = require("./config/project.json")
}

catch (e) {

}

if (customConfig){
	for (var key in customConfig) {
		defaultConfig[key] = customConfig[key];
	}
}

module.exports = defaultConfig;
