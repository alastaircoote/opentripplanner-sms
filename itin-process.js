var processLeg = function(leg) {
	if (leg.mode == "WALK") {
		return "Walk to " + leg.to.name;
	} else if (leg.mode == "SUBWAY") {
		return "Take " + leg.route + " train to " + leg.to.name;
	} else if (leg.mode == "BUS") {
		return "Take " + leg.route + " bus to " + leg.to.name;
	}
};

module.exports = function(itin) {
	var legs = [];
	for(var x=0;x<itin.legs.length;x++) {
		legs.push(processLeg(itin.legs[x]));
	}
	return legs;
}