let geostats = require('../javascripts/geostats.min');

var map10colors = [ '#006837', '#1a9850', '#66bd63', '#a6d96a', '#d9ef8b','#fee08b', '#F6D11E', '#FBA50E', '#d73027', '#a50026' ];

let dataValues = [], maxDatavalues = [], snap_splits, snap_pos_splits, gen_splits, gen_pos_splits, nycha_splits, nycha_pos_splits, gen_impmax, snap_impmax, nycha_impmax, gen_posmax, snap_posmax, nycha_posmax;

//Pre-load data for the NYCHA Impact Scores
var nycha_pos = require('./nycha_pos.json'); 
[nycha_pos_splits,nycha_posmax] = nychaPosQuantiles();

// Pre-load data for the NYCHA Critical Scores
var nycha_imp = require('./nycha_impact.json');
[nycha_splits,nycha_impmax] = nychaQuantiles();

// Pre-load data for the SNAP Impact Scores
var snap_imp = require('./snap_json.json');
[snap_splits,snap_impmax] = snapQuantiles();

// Pre-load data for the SNAP Impact Scores
var snap_pos = require('./snap_pos.json'); 
[snap_pos_splits,snap_posmax] = snapPosQuantiles();

// Pre-load data for the General Population Impact Scores
var gen_pos = require('./gen_pos.json');
[gen_pos_splits,gen_posmax] = genPosQuantiles();

// Pre-load data for the General Population Impact Scores
var gen_imp = require('./gen_json.json');
[gen_splits,gen_impmax] = genQuantiles();

//Pre-load data for Full Service Grocery Stores
var tier1 = require('./tier_1.json');

var data = {};

data.tier1 = tier1;
data.gs = gen_splits;
data.gm = gen_impmax;
data.gps = gen_pos_splits;
data.gpm = gen_posmax;
data.ss = snap_splits;
data.sm = snap_impmax;
data.sps = snap_pos_splits;
data.spm = snap_posmax;
data.ns = nycha_splits;
data.nm = nycha_impmax;
data.nps = nycha_pos_splits;
data.npm = nycha_posmax;

data.dv = dataValues;

data.info = clicked_info;
data.fs = fsPOS;

module.exports = data;

//Calculate The Quantiles for the SNAP results
function snapQuantiles() {
	dataValues.length = 0; maxDatavalues.length = 0;
	for (var i = 0; i < snap_imp.features.length; i++) {
		var scoreValue = snap_imp.features[i].properties.impact_score_normalized;
		var score2 = snap_imp.features[i].properties.impact_score;
		dataValues.push(scoreValue); maxDatavalues.push(score2);		
	}

	var sn_series = new geostats(dataValues);
	sn_series.setPrecision(4);
	var sn_qs = sn_series.setClassManually([ 0, 0.0005, 0.0034, 0.0092, 0.2, 1 ]);
	var sn_2 = new geostats(maxDatavalues); var sn_max = sn_2.max();
	return [sn_qs,sn_max];
}

// Calculate The Quantiles for the SNAP results
function snapPosQuantiles() {
	dataValues.length = 0; maxDatavalues.length = 0;
	for (var i = 0; i < snap_pos.features.length; i++) {
		var scoreValue = snap_pos.features[i].properties.critical_score_snap_normalized;
		var score2 = snap_pos.features[i].properties.critical_score_snap;
		dataValues.push(scoreValue); maxDatavalues.push(score2);
	}
	var snp_series = new geostats(dataValues);
	snp_series.setPrecision(4);
	var snp_qs = snp_series.setClassManually([ 0, 0.0028, 0.024, 0.12, 0.2, 1 ]);
	var snp_2 = new geostats(maxDatavalues); var snp_max = snp_2.max();
	return [snp_qs,snp_max];
}

// Calculate The Quantiles for the NYCHA results
function nychaQuantiles() {
	dataValues.length = 0; maxDatavalues.length = 0;
	for (var i = 0; i < nycha_imp.features.length; i++) {
		var scoreValue = nycha_imp.features[i].properties.score_norm;
		var score2 = nycha_imp.features[i].properties.score;
		dataValues.push(scoreValue); maxDatavalues.push(score2);
	}
	var ny_series = new geostats(dataValues);
	ny_series.setPrecision(4);
	var ny_qs = ny_series.setClassManually([ 0, 0.0005, 0.0034, 0.0092, 0.2, 1 ]);
	var ny_2 = new geostats(maxDatavalues); var ny_max = ny_2.max();
	return [ny_qs,ny_max];
}

// Calculate The Quantiles for the NYCHA results
function nychaPosQuantiles() {
	dataValues.length = 0; maxDatavalues.length = 0;
	for (var i = 0; i < nycha_pos.features.length; i++) {
		var scoreValue = nycha_pos.features[i].properties.critical_score_nycha_normalized;
		var score2 = nycha_pos.features[i].properties.critical_score_nycha;
		dataValues.push(scoreValue); maxDatavalues.push(score2);
	}

	var nyp_series = new geostats(dataValues);
	nyp_series.setPrecision(4);
	var nyp_qs = nyp_series.setClassManually([ 0, 0.015, 0.038, 0.052, 0.1, 1 ]);
	var nyp_2 = new geostats(maxDatavalues); var nyp_max = nyp_2.max();
	//var legendDiv = nyp_qs.getHtmlLegend([ map10colors[2], map10colors[5], map10colors[6],map10colors[7], map10colors[9] ], null, null, null,'distinct');
	
	//return [nyp_qs,nyp_max, legendDiv];
	return [nyp_qs,nyp_max]
}

// Calculate The Quantiles for the SNAP results
function genQuantiles() {
	dataValues.length = 0; maxDatavalues.length = 0;
	for (var i = 0; i < gen_imp.features.length; i++) {
		var scoreValue = gen_imp.features[i].properties.impact_score_normalized;
		var score2 = gen_imp.features[i].properties.impact_score;
		dataValues.push(scoreValue); maxDatavalues.push(score2);
	}

	var gn_series = new geostats(dataValues);
	gn_series.setPrecision(4);
	var gn_qs = gn_series.setClassManually([ 0, 0.0005, 0.0034, 0.0092, 0.2, 1 ]);
	var gn_2 = new geostats(maxDatavalues); var gn_max = gn_2.max();
	return [gn_qs,gn_max];
}

// Calculate The Quantiles for the SNAP results
function genPosQuantiles() {
	dataValues.length = 0; maxDatavalues.length = 0;
	for (var i = 0; i < gen_pos.features.length; i++) {
		var scoreValue = gen_pos.features[i].properties.critical_score_pop_normalized;
		var score2 = gen_pos.features[i].properties.critical_score_pop;
		dataValues.push(scoreValue); maxDatavalues.push(score2);
	}

	var gnp_series = new geostats(dataValues);
	gnp_series.setPrecision(4);
	var gnp_qs = gnp_series.setClassManually([ 0, 0.015, 0.038, 0.052, 0.15, 1 ]);
	var gnp_2 = new geostats(maxDatavalues); var gnp_max = gnp_2.max();
	return [gnp_qs,gnp_max];
}

function clicked_info(e,p) {
	var c_info;
	switch(true) {
		case (p == 1):
			c_info = '<table><thead><tr><th>Census Block ID</th><th>Population (2010)</th><th>Score</th><th>Normalized Score</th></tr></thead>';
			for (var n=0; n < gen_imp.features.length; n++) {
				if (gen_imp.features[n].properties.blockid10 == e) {
					c_info += '<tr><td>' + gen_imp.features[n].properties.blockid10 + '</td><td>' + gen_imp.features[n].properties.pop10 + '</td><td>' + gen_imp.features[n].properties.impact_score + '</td><td>'+ gen_imp.features[n].properties.impact_score_normalized + '</td></tr></table>';
					break;
				}
			}
			break;
		case ((p == 2) || (p == 6)):
			c_info = '<table><thead><tr><th>Business Name</th><th>Classification</th><th>Zip Code Pop. Density</th><th>Zip Median Income</th><th>Store Square Footage</th></tr></thead><tr><td>';
			for (var n=0; n < tier1.length; n++) {
				if (tier1[n].BUSINESS_N == e) {
					c_info += tier1[n].BUSINESS_N + '</td><td>' + tier1[n].PROJECT_CA + '</td><td>' + tier1[n].POPULATION + '</td><td>' + tier1[n].MEDIAN_HOU + '</td><td>' + tier1[n].SQUARE_FOO + '</td></tr></table>';
					break;
				}
			}
			break;
		case (p == 3):
			c_info = '<table><thead><tr><th>Census Block ID</th><th>Population (2010)</th><th>Score</th><th>Normalized Score</th></tr></thead>';
			for (var n=0; n < snap_imp.features.length; n++) {
				if (snap_imp.features[n].properties.blockid10 == e) {
					c_info += '<tr><td>' + snap_imp.features[n].properties.blockid10 + '</td><td>' + snap_imp.features[n].properties.pop10 + '</td><td>' + snap_imp.features[n].properties.impact_score + '</td><td>'+ snap_imp.features[n].properties.impact_score_normalized + '</td></tr></table>';
					break;
				}
			}
			break;
		case (p == 4):
			c_info = '<table><thead><tr><th>Business Name</th><th>Address></th><th>County</th><th>City</th></tr></thead>';
			for (var n=0; n < snap_pos.features.length; n++) {
				if (snap_pos.features[n].properties.store_name == e) {
					c_info += '<tr><td>' + snap_pos.features[n].properties.store_name + '</td><td>' + snap_pos.features[n].properties.address + '</td><td>' + snap_pos.features[n].properties.county + '</td><td>' + snap_pos.features[n].properties.city + '</td></tr></table>';
					break;
				}
			}
			break;
		case (p == 5):
			c_info = '<table><thead><tr><th>Development</th><th>Borough</th><th>Score</th><th>Normalized Score</th></tr></thead>';
			for (var n=0; n < nycha_imp.features.length; n++) {
				if (nycha_imp.features[n].properties.blockid10 == e) {
					c_info += '<tr><td>' + nycha_imp.features[n].properties.blockid10 + '</td><td>' + nycha_imp.features[n].properties.borough + '</td><td>' + nycha_imp.features[n].properties.score + '</td><td>'+ nycha_imp.features[n].properties.score_norm + '</td></tr></table>';
					break;
				}
			}
			break;
	}
	return c_info;
}

function fsPOS(e,p,num) {
	//To do. Create json for response instead of sending back html code
	var target,fs;
	var f=1;
	var found = 0;
	switch(true) {
		case (p == 1):
			fs = '<table><thead><tr><th>Business Name</th><th>Classification</th><th>Zip Code Pop. Density</th><th>Zip Median Income</th><th>Store Square Footage</th></tr></thead><tr><td>';
			for (var n=0; n < gen_imp.features.length; n++) {
				if (gen_imp.features[n].properties.blockid10 == e) {
					target = gen_imp.features[n];
					break;
				}
			}
			while(f < num+1) {
				for (var i = 0; i < gen_pos.features.length; i++) {
					if (gen_pos.features[i].properties.DNB_ID == target.properties[f]) {
						for (var j = 0; j < tier1.length; j++) {
							if (tier1[j].BUSINESS_N == gen_pos.features[i].properties['BUSINESS NAME']) {
								if (f == num) {
									fs += tier1[j].BUSINESS_N + '</td><td>' + tier1[j].PROJECT_CA + '</td><td>' + tier1[j].POPULATION + '</td><td>' + tier1[j].MEDIAN_HOU + '</td><td>' + tier1[j].SQUARE_FOO + '</td></tr>';
								}
								else {
									fs += tier1[j].BUSINESS_N + '</td><td>' + tier1[j].PROJECT_CA + '</td><td>' + tier1[j].POPULATION + '</td><td>' + tier1[j].MEDIAN_HOU + '</td><td>' + tier1[j].SQUARE_FOO + '</td></tr><tr><td>';
								}
								break;
							}
						}
						break;
					}
				}
				f++;
			}
			fs += '</table>';
			break;
		case (p == 2):
			fs = '<table><thead><tr><th>Census Block ID</th><th>Population (2010)</th><th>Score</th><th>Normalized Score</th></tr></thead><tr><td>';
			for (var n=0; n < gen_pos.features.length; n++) {
				if (gen_pos.features[n].properties['BUSINESS NAME'] == e) {
					target = gen_pos.features[n];
					break;
				}
			}
			while(f < num+1) {
				for (var i = 0; i < gen_imp.features.length; i++) {
					if (gen_imp.features[i].properties[f] == target.properties.DNB_ID) {
						if (f == num) {
							fs += gen_imp.features[i].properties.blockid10 + '</td><td>' + gen_imp.features[i].properties.pop10 + '</td><td>' + gen_imp.features[i].properties.impact_score + '</td><td>'+ gen_imp.features[i].properties.impact_score_normalized + '</td></tr>';
							found++;
						}
						else {
							fs += gen_imp.features[i].properties.blockid10 + '</td><td>' + gen_imp.features[i].properties.pop10 + '</td><td>' + gen_imp.features[i].properties.impact_score + '</td><td>'+ gen_imp.features[i].properties.impact_score_normalized + '</td></tr><tr><td>';
							found++;
						}
						break;
					}
				}
				f++;
			}
			if (found == 0) {
				fs = '<table><thead><tr><th>Development</th><th>Borough</th><th>Score</th><th>Normalized Score</th></tr></thead><tr><td colspan="4"><strong>There are no Census Blocks close enough to be affected by a closure of this store.</strong></td></tr>';
			}
			fs += '</table>';
			break;
		case (p == 3):
			fs = '<table><thead><tr><th>Business Name</th><th>Address></th><th>County</th><th>City</th></tr></thead><tr><td>';
			for (var n=0; n < snap_imp.features.length; n++) {
				if (snap_imp.features[n].properties.blockid10 == e) {
					target = snap_imp.features[n]
					break;
				}
			}
			while(f < num+1) {
				for (var i = 0; i < snap_pos.features.length; i++) {
					if (snap_pos.features[i].properties.cartodb_id == target.properties[f]) {
						if (f == num) {
							fs += snap_pos.features[i].properties.store_name + '</td><td>' + snap_pos.features[i].properties.address + '</td><td>' + snap_pos.features[i].properties.county + '</td><td>' + snap_pos.features[i].properties.city + '</td></tr>';
						}
						else {
							fs += snap_pos.features[i].properties.store_name + '</td><td>' + snap_pos.features[i].properties.address + '</td><td>' + snap_pos.features[i].properties.county + '</td><td>' + snap_pos.features[i].properties.city + '</td></tr><tr><td>';
						}
						break;
					}
				}
				f++;
			}
			fs += '</table>';
			break;
		case (p == 4):
			fs = '<table><thead><tr><th>Census Block ID</th><th>Population (2010)</th><th>Score</th><th>Normalized Score</th></tr></thead><tr><td>';
			for (var n=0; n < snap_pos.features.length; n++) {
				if (snap_pos.features[n].properties.store_name == e) {
					target = snap_pos.features[n];
					break;
				}
			}
			while(f < num+1) {
				for (var i = 0; i < snap_imp.features.length; i++) {
					if (snap_imp.features[i].properties[f] == target.properties.cartodb_id) {
						if (f == num) {
							fs += snap_imp.features[i].properties.blockid10 + '</td><td>' + snap_imp.features[i].properties.pop10 + '</td><td>' + snap_imp.features[i].properties.impact_score + '</td><td>'+ snap_imp.features[i].properties.impact_score_normalized + '</td></tr>';
							found++;
						}
						else {
							fs += snap_imp.features[i].properties.blockid10 + '</td><td>' + snap_imp.features[i].properties.pop10 + '</td><td>' + snap_imp.features[i].properties.impact_score + '</td><td>'+ snap_imp.features[i].properties.impact_score_normalized + '</td></tr><tr><td>';
							found++;
						}
						break;
					}
				}
				f++;
			}
			if (found == 0) {
				fs = '<table><thead><tr><th>Development</th><th>Borough</th><th>Score</th><th>Normalized Score</th></tr></thead><tr><td colspan="4"><strong>There are no Census Blocks close enough to be affected by a closure of this store.</strong></td></tr>';
			}
			fs += '</table>';
			break;
		case (p == 5):
			fs = '<table><thead><tr><th>Business Name</th><th>Classification</th><th>Zip Code Pop. Density</th><th>Zip Median Income</th><th>Store Square Footage</th></tr></thead><tr><td>';
			for (var n=0; n < nycha_imp.features.length; n++) {
				if (nycha_imp.features[n].properties.blockid10 == e) {
					target = nycha_imp.features[n];
					break;
				}
			}
			while(f < num+1) {
				for (var i = 0; i < nycha_pos.features.length; i++) {
					if (nycha_pos.features[i].properties.DNB_ID == target.properties[f]) {
						for (var j = 0; j < tier1.length; j++) {
							if (tier1[j].BUSINESS_N == nycha_pos.features[i].properties.business_name) {
								if (f == num) {
									fs += tier1[j].BUSINESS_N + '</td><td>' + tier1[j].PROJECT_CA + '</td><td>' + tier1[j].POPULATION + '</td><td>' + tier1[j].MEDIAN_HOU + '</td><td>' + tier1[j].SQUARE_FOO + '</td></tr>';
								}
								else {
									fs += tier1[j].BUSINESS_N + '</td><td>' + tier1[j].PROJECT_CA + '</td><td>' + tier1[j].POPULATION + '</td><td>' + tier1[j].MEDIAN_HOU + '</td><td>' + tier1[j].SQUARE_FOO + '</td></tr><tr><td>';
								}
								break;
							}
						}
						break;
					}
				}
				f++;
			}
			fs += '</table>';
			break;
		case (p == 6):
			fs = '<table><thead><tr><th>Development</th><th>Borough</th><th>Score</th><th>Normalized Score</th></tr></thead><tr><td>';
			for (var n=0; n < nycha_pos.features.length; n++) {
				if (nycha_pos.features[n].properties.business_name == e) {
					target = nycha_pos.features[n];
					break;
				}
			}
			while(f < num+1) {
				for (var i = 0; i < nycha_imp.features.length; i++) {
					if (nycha_imp.features[i].properties[f] == target.properties.DNB_ID) {
						if (f == num) {
							fs += nycha_imp.features[i].properties.blockid10 + '</td><td>' + nycha_imp.features[i].properties.borough + '</td><td>' + nycha_imp.features[i].properties.score + '</td><td>'+ nycha_imp.features[i].properties.score_norm + '</td></tr>';
							found++;
						}
						else {
							fs += nycha_imp.features[i].properties.blockid10 + '</td><td>' + nycha_imp.features[i].properties.borough + '</td><td>' + nycha_imp.features[i].properties.score + '</td><td>'+ nycha_imp.features[i].properties.score_norm + '</td></tr><tr><td>';
							found++;
						}
						break;
					}
				}
				f++;
			}
			if (found == 0) {
				fs = '<table><thead><tr><th>Development</th><th>Borough</th><th>Score</th><th>Normalized Score</th></tr></thead><tr><td colspan="4"><strong>There are no NYCHA developments close enough to be affected by a closure of this store.</strong></td></tr>';
			}
			fs += '</table>';
			break;
	}
	return fs;
}











