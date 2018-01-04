var L = require('leaflet'),
leafletStream = require('leaflet-geojson-stream');

const basemapUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

var map10colors = [ '#006837', '#1a9850', '#66bd63', '#a6d96a', '#d9ef8b','#fee08b', '#F6D11E', '#FBA50E', '#d73027', '#a50026' ];
let geojson;
let orr_column;
let pop;
let store;
let score;
let posoutlets;
let searchControl;

var map1 = L.map('map1', { scrollWheelZoom : false }).setView([ 40.739061, -73.952654 ], 11);
L.tileLayer(basemapUrl, {attribution : attribution }).addTo(map1);


//Runs when a user mouses over any polygon
function mouseoverFunction(e) {
/*	var layer = e.target;
	layer.setStyle({ weight : 2, color : 'blue', dashArray : '', fillOpacity : 0.25, });

	if (!L.Browser.ie && !L.Browser.opera) { layer.bringToFront(); }

	// Update the text in the infoWindow with some relevant info
	var info;
	if ((pop == "baseimpact") && (score == "censusscore")) {
		info = '<p>ID: ' + layer.feature.properties.blockid10 + '<br/>Normalized Impact Score: ' + layer.feature.properties[orr_column] + '</p>';
	} 
	else if ((pop == "snapimpact") && (score == "censusscore")) {
		info = '<p>ID: '+ layer.feature.properties.blockid10 + '<br/>Normalized Impact Score: ' + layer.feature.properties[orr_column] + '</p>';
	} 
	else if ((pop == "nychaimpact") && (score == "censusscore")) {
		info = '<p>Development: ' + layer.feature.properties.blockid10 + '<br/>Normalized Impact Score:' + +layer.feature.properties[orr_column] + '</p>';
	}
	$('#infoWindow').fadeOut('fast', function() { $('#infoWindow').html(info).animate({height:'100%'},50); $('#infoWindow').fadeIn('fast'); });*/
}

// Runs when a user hovers over any point
function mouseoverPFunction(e) {
	/*let layer = e.target;
	layer.setStyle({ weight : 0.75, color : 'blue', dashArray : '', fillOpacity : 0.45, radius : 5 });

	if (!L.Browser.ie && !L.Browser.opera) {layer.bringToFront();}

	// Update the text in the infoWindow with some relevant info
	if ((pop == "baseimpact") && (score == "posscore")) {
		$('#infoWindow').html('<p>Business Name: '+ layer.feature.properties['BUSINESS NAME'] + '<br/>Normalized Impact Score: '+ layer.feature.properties[orr_column] + '</p>');
	} 
	else if ((pop == "snapimpact") && (score == "posscore")) {
		$('#infoWindow').html('<p>Business Name: ' + layer.feature.properties.store_name + '<br/>Normalized Impact Score: ' + layer.feature.properties[orr_column] + '</p>');
	} 
	else if ((pop == "nychaimpact") && (score == "posscore")) {
		$('#infoWindow').html('<p>Business Name: '+ layer.feature.properties.business_name_1 + '<br/>Normalized Impact Score: ' + layer.feature.properties[orr_column] + '</p>');
	}*/
}

//Runs when a user clicks on map feature
function clickFunction(e) {
	switch (true) {
	case ((pop == "baseimpact") && (score == "censusscore")):
		moreCensus(e,0);
		moreTwo(2);
		break;
	case ((pop == "baseimpact") && (score == "censusscore")):
		moreCensus(e,1);
		moreTwo(2);
		break;	
	case ((pop == "nychaimpact") && (score == "censusscore")):
		moreCensus(e,2);
		moreTwo(2);
		break;
	}
}

const pos_group =['gen_pos','snap_pos','nycha_pos'];

function moreCensus(e,p){
	let first_second;
	switch(true) {
		case (p == 2):
			let heading = '<p class="center-align">ID: ' + e.target.feature.properties.blockid10 + ',  Score: ' + e.target.feature.properties[orr_column] + '</p><table><thead><tr><th>Business Name</th><th>Classification</th><th>Zip Code Pop. Density</th><th>Zip Median Income</th><th>Store Square Footage</th></tr></thead><tr><td>';
			first_second = fsPOS(e,heading,2,2);
			first_second += '</table>';
			$('#infoWindow').html( '<p>ID: ' + e.target.feature.properties.blockid10 + '</p><p>Normalized Impact Score: '+ e.target.feature.properties[orr_column] + '</p>');
			break;
	}
	
	$('#moreInfo').fadeOut('fast', function() { 
		$('#moreoneheader').html('2 Closest POS');
		$('#moreonebody').html(first_second); 
		$('#moreInfo').fadeIn('fast'); 
	});
}

function fsPOS(e,fs,p,num) {
	let f=1;
	switch(true) {
		case (p == 0):
			break;
		case (p == 1):
			break;
		case (p == 2):
			while(f < num+1) {
				for (var i = 0; i < nycha_pos.features.length; i++) {
					if (nycha_pos.features[i].properties.DNB_ID == e.target.feature.properties[f]) {
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
			break;
		}
	return fs;
}

function moreTwo(p){
	if (user == "guest") {
		$('#moretwoheader').html('Top Ten Census Blocks');
		$('#moretwobody').html('<p>You are not authorized to view these results.</p>');
	}
	
	else if((user == "Joe") || (user == "Kate")) {
		switch(true) {
			case (p == 0):
				$('#moretwoheader').html('Top Ten Census Blocks');
				$('#moretwobody').html('<div><table > <thead> <tr> <th>Neighborhood</th> <th>Population</th> <th>Distance Increase (ft)</th> <th>Normalized Vulnerability Score</th> </tr> </thead> <tr> <td>Roosevelt Island (Central)</td> <td>4970</td> <td>844</td> <td>1.000</td> </tr> <tr> <td>Washington Heights, Manhattan</td> <td>2335</td> <td>978</td> <td>0.544</td> </tr> <tr> <td>Roosevelt Island (North)</td> <td>1905</td> <td>1017</td> <td>0.462</td> </tr> <tr> <td>Kips Bay, Manhattan</td> <td>2106</td> <td>816</td> <td>0.410</td> </tr> <td>Roosevelt Island (Central)</td> <td>1188</td> <td>1292</td> <td>0.366</td> </tr> <tr> <td>Parkchester, Bronx</td> <td>3646</td> <td>359</td> <td>0.312</td> </tr> <tr> <td>Williamsburg, Brooklyn</td> <td>2177</td> <td>582</td> <td>0.302</td> </tr> <tr> <td>Two Bridges, Manhattan</td> <td>1981</td> <td>622</td> <td>0.294</td> </tr> <tr> <td>Williamsburg, Brooklyn</td> <td>3419</td> <td>359</td> <td>0.292</td> </tr> <tr> <td>City Island, Bronx</td> <td>240</td> <td>5106</td> <td>0.292</td> </tr> </table></div>');
				break;
			case (p == 1):
				$('#moretwoheader').html('Top Ten Census Blocks');
				$('#moretwobody').html('<div><table> <thead> <tr> <th>Neighborhood</th> <th>Number of Households</th> <th>SNAP Percentage</th> <th>Distance Increase (ft)</th> <th>Normalized Vulnerability Score</th> </tr> </thead> <tr> <td>Far Rockaway, Queens</td> <td>1087</td> <td>53%</td> <td>470</td> <td>1.000</td> </tr> <tr> <td>Concourse, Bronx</td> <td>630</td> <td>42%</td> <td>646</td> <td>0.626</td> </tr> <tr> <td>Carnarsie, Brooklyn</td> <td>1601</td> <td>55%</td> <td>143</td> <td>0.470</td> </tr> <tr> <td>Mariners Harbor, Staten Island</td> <td>341</td> <td>62%</td> <td>585</td> <td>0.458</td> </tr> <tr> <td>Sheepshead Bay, Brooklyn</td> <td>528</td> <td>57%</td> <td>317</td> <td>0.351</td> </tr> <tr> <td>East New York, Brooklyn</td> <td>849</td> <td>53%</td> <td>208</td> <td>0.347</td> </tr> <tr> <td>Washington Heights, Manhattan</td> <td>837</td> <td>57%</td> <td>187</td> <td>0.331</td> </tr> <tr> <td>Mott Haven, Bronx</td> <td>566</td> <td>62%</td> <td>242</td> <td>0.315</td> </tr> <tr> <td>Far Rockaway, Queens</td> <td>343</td> <td>39%</td> <td>569</td> <td>0.281</td> </tr> <tr> <td>Chelsea, Manhattan</td> <td>814</td> <td>21%</td> <td>441</td> <td>0.280</td> </tr> </table></div>');
				break;
			case (p == 2):
				$('#moretwoheader').html('Top Ten Census Blocks');
				$('#moretwobody').html('<div><table> <thead> <tr> <th>Development</th> <th>Number of Households</th> <th>Distance Increase (ft)</th> <th>Normalized Vulnerability Score</th> </tr> </thead> <tr> <td>FHA REPOSSESSED HOUSES (GROUP VII), Queens</td> <td>274</td> <td>960</td> <td>1.000</td> </tr> <tr> <td>New York City Housing Authority&#39s Dr. Ramon E. Betances II, 13 (700 E 140th St, Bronx, NY 10454)</td> <td>518</td> <td>438</td> <td>0.862</td> </tr> <tr> <td>La Preciosa-NYCHA (1070 Washington Ave Bronx, NY 10456)</td> <td>590</td> <td>348</td> <td>0.780</td> </tr> <tr> <td>FHA REPOSSESSED HOUSES (GROUP X), Queens</td> <td>284</td> <td>688</td> <td>0.743</td> </tr> <tr> <td>New York City Housing Authority&#39s Howard Avenue-Park Place (1761 Sterling Pl, Brooklyn, NY 11233)</td> <td>365</td> <td>514</td> <td>0.714</td> </tr> <tr> <td>NYCHA &#45 Betances II, 18 (443 E 137th St Bronx, NY 10454)</td> <td>519</td> <td>353</td> <td>0.696</td> </tr> <tr> <td>FHA REPOSSESSED HOUSES (GROUP V), Brooklyn</td> <td>260</td> <td>696</td> <td>0.688</td> </tr> <tr> <td>New York City Housing Authority&#39s Dr. Ramon E. Betances III, 18 (411 East 136th Street, Bronx, NY 10454, Bronx, NY 10454)</td> <td>521</td> <td>347</td> <td>0.687</td> </tr> <tr> <td>New York City Housing Authority&#39s Lower East Side III (722 E 9th St, New York, NY 10009)</td> <td>364</td> <td>468</td> <td>0.647</td> </tr> <tr> <td>New York City Housing Authority &#45 Beach 41st Street (38-20 Beach Channel Dr, Far Rockaway, NY 11691)</td> <td>165</td> <td>1000</td> <td>0.627</td> </tr> </table></div>');
				break;
		}
	}
}

//Runs on mouseout
function resetHighlight(e) { geojson.resetStyle(e.target); }

// Executed once for each feature in the data, and adds listeners
function onEachFeature(feature, layer) { layer.on({ mouseover : mouseoverFunction, mouseout : resetHighlight, click : clickFunction }); }
function onEachPointFeature(feature, layer) { layer.on({ mouseover : mouseoverPFunction, mouseout : resetHighlight, click : clickFunction }); }

//Runs when the user clicks the run button
$("#seescore").click(function() {
	try 
	{ 
		$('#wait').show();
		if (geojson === undefined) {
			createMap();
		}
		else { geojson.clearLayers(); createMap(); }
	} 
	catch (err) { console.log(err); }
});

var gen_imp;
$.getJSON('data/gen_impact.json', function(json) { gen_imp = json; [gen_splits,gen_impmax] = genQuantiles(); });
var nycha_imp;
$.getJSON('data/nycha_impact.json', function(json) { nycha_imp = json; [nycha_splits,nycha_impmax] = nychaQuantiles(); });
var snap_imp;
$.getJSON('data/snap_impact.json', function(json) { snap_imp = json; [snap_splits,snap_impmax] = snapQuantiles(); });

//Creates the map with the variables chosen
function createMap() {
	pop = $("#pop option:selected").val(); store = $("#stores option:selected").val(); score = $("#score option:selected").val();
	var pl = { "type": "FeatureCollection", "features": []}
	
	$('#infoWindow,#maplegend').fadeOut('fast',
			function() {
				//$('#infoWindow').html('Map Loading');
				$('#maplegend').html();
				$('#infoWindow,#maplegend').fadeIn('slow');
			});

	switch (true) {
	
	case (pop == "baseimpact") && (score == "censusscore"):
		orr_column = 'impact_score';
		
		geojson = L.geoJson(pl,{ 
			style : function (feature) {
				return { fillColor : getColor(gen_splits,feature.properties[orr_column]), weight : 0.5, color : 'grey',	dashArray : '',	fillOpacity : 0.5 };
		    }, 
			onEachFeature : onEachFeature }).addTo(map1);
		leafletStream.ajax('data/gen_impact.json', geojson)
				.on('end', function() {});
		
		genQuantiles(); addLegend(); //addSearch();
		//$('#resultlegend').fadeOut('fast', function() { $('#resultlegend').animate({height:'100%'},15).html('<p><strong>These scores are based on access to full&#45service grocery scores. <br />Scores are normalized from 0 to 1.</strong></p><p style="text-align: center;"><b><strong>Vulnerability Score</b></strong><i>(normalized on a 0-1 scale)</i><br /><b><strong> = Differential Distance between Primary and Secondary POS * NYCHA Households</strong></b></p><p><strong>Max Vulnerability Score: '+nycha_impmax+'</strong></p>'); $('#resultlegend').fadeIn('slow'); });
		break;

	case (pop == "baseimpact") && (score == "posscore"):
		$('#wait').show();
		orr_column = 'critical_score_pop_normalized';
		geojson = L.geoJson(gen_pos, { pointToLayer : function(feature, latlng) { return L.circleMarker(latlng, gen_pos_style(feature)); }, onEachFeature : onEachPointFeature }).addTo(map1);
		genPosQuantiles(); addCritLegend();
		$('#resultlegend').fadeOut('fast', function() { $('#resultlegend').html('<p><strong>These scores are based on access to full&#45service grocery scores. <br />Scores are normalized from 0 to 1.</strong></p><p style="text-align: center;"><b><strong>Criticality Score</b></strong><i>(normalized on a 0-1 scale)</i><br /><b><strong> = Sum of Vulnerability Scores of Relevant Census Blocks	</strong></b></p><p><strong>Max Criticality Score: '+gen_posmax+'</strong></p>'); $('#resultlegend').fadeIn('slow'); });
		if (searchControl) map1.removeControl(searchControl);
		$('#moreInfo').fadeOut('fast', function() {
			if (user == "guest") {
				$('#moreInfo').html('<div class="wrapper"><nav class="vertical"><ul><li><label for="moreone">POS/Census Area</label><input type="radio" name="verticalMenu" id="moreone"/><div><p>Closest POS or Most affected Census Area</p></div></li><li><label for="moretwo">Top TEN POS outlets</label><input type="radio" name="verticalMenu" id="moretwo"/><div><p>You are not authorized to view these results.</p></div></li></ul></nav></div>');
			}
			else if((user == "Joe") || (user == "Kate")) {
				$('#moreInfo').html('<div class="wrapper"><nav class="vertical"><ul><li><label for="moreone">POS/Census Area</label><input type="radio" name="verticalMenu" id="moreone"/><div><p>Closest POS or Most affected Census Area</p></div></li><li><label for="moretwo">Top TEN POS outlets</label><input type="radio" name="verticalMenu" id="moretwo"/><div><table > <thead> <tr> <th>Business Name</th> <th>Neighborhood</th> <th>Normalized Criticality Score</th> </tr> </thead> <tr> <td>City Island Deli</td> <td>City Island, Bronx</td> <td>1.000</td> </tr> <tr> <td>Pathmark Stores  Inc</td> <td>Bay Terrace, Staten Island</td> <td>0.532</td> </tr> <tr> <td>Gristedes Foods  Inc</td> <td>Roosevelt Island (North)</td> <td>0.452</td> </tr> <tr> <td>Waldbaum Inc</td> <td>Arden Heights, Staten Island</td> <td>0.419</td> </tr> <tr> <td>145 Food Center Inc</td> <td>Springfield Gardens, Queens</td> <td>0.382</td> </tr> <tr> <td>Richmond Food  Inc</td> <td>West Brighton, Staten Island</td> <td>0.381</td> </tr> <tr> <td>Benn S Meat Market</td> <td>Mariners Harbor, Staten Island</td> <td>0.362</td> </tr> <tr> <td>K & S Produce Inc</td> <td>Throgs Neck, Bronx</td> <td>0.357</td> </tr> <tr> <td>Nadine Food Corp</td> <td>East Elmhurst, Queens</td> <td>0.308</td> </tr> <tr> <td>Trader Joes Company</td> <td>New Springville, Staten Island</td> <td>0.295</td> </tr> </table></div></li></ul></nav></div>');
			}
			$('#moreInfo').fadeIn('slow');
		});
		break;

	case (pop == "snapimpact") && (score == "censusscore"):
		orr_column = 'impact_score_normalized';
		
		geojson = L.geoJson(pl,{ 
			style : function (feature) {
				return { fillColor : getColor(snap_splits,feature.properties[orr_column]), weight : 0.5, color : 'grey',	dashArray : '',	fillOpacity : 0.5 };
		    }, 
			onEachFeature : onEachFeature }).addTo(map1);
		leafletStream.ajax('data/snap_impact.json', geojson)
				.on('end', function() {});
		
		snapQuantiles(); addLegend(); //addSearch();
		$('#resultlegend').fadeOut('fast', function() { $('#resultlegend') .html('<p><strong>These scores are based on access to ALL stores that accept SNAP. <br />Scores are normalized from 0 to 1.</strong></p><p style="text-align: center;"><b><strong>Vulnerability Score</b></strong><i>(normalized on a 0-1 scale)</i><br /><b><strong> = Differential Distance between Primary and Secondary SNAP POS * % SNAP Households * Total Census Block Households</strong></b></p><p><strong>Max Vulnerability Score: '+snap_impmax+'</strong></p>'); $('#resultlegend').fadeIn('slow'); });
		$('#moreInfo').fadeOut('fast', function() {
			if (user == "guest") {
				$('#moreInfo').html('<div class="wrapper"><nav class="vertical"><ul><li><label for="moreone">POS/Census Area</label><input type="radio" name="verticalMenu" id="moreone"/><div><p>Closest POS or Most affected Census Area</p></div></li><li><label for="moretwo">Top TEN census blocks</label><input type="radio" name="verticalMenu" id="moretwo"/><div><p>You are not authorized to view these results.</p></div></li></ul></nav></div>');
			}
			else if((user == "Joe") || (user == "Kate")) {
				$('#moreInfo').html('<div class="wrapper"><nav class="vertical"><ul><li><label for="moreone">POS/Census Area</label><input type="radio" name="verticalMenu" id="moreone"/><div><p>Closest POS or Most affected Census Area</p></div></li><li><label for="moretwo">Top TEN census blocks</label><input type="radio" name="verticalMenu" id="moretwo"/><div><table> <thead> <tr> <th>Neighborhood</th> <th>Number of Households</th> <th>SNAP Percentage</th> <th>Distance Increase (ft)</th> <th>Normalized Vulnerability Score</th> </tr> </thead> <tr> <td>Far Rockaway, Queens</td> <td>1087</td> <td>53%</td> <td>470</td> <td>1.000</td> </tr> <tr> <td>Concourse, Bronx</td> <td>630</td> <td>42%</td> <td>646</td> <td>0.626</td> </tr> <tr> <td>Carnarsie, Brooklyn</td> <td>1601</td> <td>55%</td> <td>143</td> <td>0.470</td> </tr> <tr> <td>Mariners Harbor, Staten Island</td> <td>341</td> <td>62%</td> <td>585</td> <td>0.458</td> </tr> <tr> <td>Sheepshead Bay, Brooklyn</td> <td>528</td> <td>57%</td> <td>317</td> <td>0.351</td> </tr> <tr> <td>East New York, Brooklyn</td> <td>849</td> <td>53%</td> <td>208</td> <td>0.347</td> </tr> <tr> <td>Washington Heights, Manhattan</td> <td>837</td> <td>57%</td> <td>187</td> <td>0.331</td> </tr> <tr> <td>Mott Haven, Bronx</td> <td>566</td> <td>62%</td> <td>242</td> <td>0.315</td> </tr> <tr> <td>Far Rockaway, Queens</td> <td>343</td> <td>39%</td> <td>569</td> <td>0.281</td> </tr> <tr> <td>Chelsea, Manhattan</td> <td>814</td> <td>21%</td> <td>441</td> <td>0.280</td> </tr> </table></div></li></ul></nav></div>');
			}
			$('#moreInfo').fadeIn('slow');
		});
		break;

	case (pop == "snapimpact") && (score == "posscore"):
		$('#wait').show();
		orr_column = 'critical_score_snap_normalized';
		geojson = L.geoJson(snap_pos, { pointToLayer : function(feature, latlng) { return L.circleMarker(latlng, snap_pos_style(feature)); }, onEachFeature : onEachPointFeature }).addTo(map1);
		snapPosQuantiles(); addCritLegend();
		$('#resultlegend').fadeOut('fast', function() { $('#resultlegend').html('<p><strong>These scores are based on access to ALL stores that accept SNAP. <br />Scores are normalized from 0 to 1.</strong></p><p style="text-align: center;"><b><strong>Criticality Score</b></strong><i>(normalized on a 0-1 scale)</i></i><br /><b><strong> =  Sum of Vulnerability Scores of Relevant Census Blocks</strong></b></p><p><strong>Max Criticality Score: '+snap_posmax+'</strong></p>'); $('#resultlegend').fadeIn('slow'); });
		if (searchControl) map1.removeControl(searchControl);
		$('#moreInfo').fadeOut('fast', function() {
			if (user == "guest") {
				$('#moreInfo').html('<div class="wrapper"><nav class="vertical"><ul><li><label for="moreone">POS/Census Area</label><input type="radio" name="verticalMenu" id="moreone"/><div><p>Closest POS or Most affected Census Area</p></div></li><li><label for="moretwo">Top TEN POS outlets</label><input type="radio" name="verticalMenu" id="moretwo"/><div><p>You are not authorized to view these results.</p></div></li></ul></nav></div>');
			}
			else if((user == "Joe") || (user == "Kate")) {
				$('#moreInfo').html('<div class="wrapper"><nav class="vertical"><ul><li><label for="moreone">POS/Census Area</label><input type="radio" name="verticalMenu" id="moreone"/><div><p>Closest POS or Most affected Census Area</p></div></li><li><label for="moretwo">Top TEN POS outlets</label><input type="radio" name="verticalMenu" id="moretwo"/><div><table> <thead> <tr> <th>BUSINESS NAME</th> <th>Neighborhood</th> <th>ADDRESS</th> <th>Normalized Criticality Score</th> </tr> </thead> <tr> <td>290 Beach 14th Street Grocery, Corp/Pioneer Spmkt</td> <td>Far Rockaway, Queens</td> <td>290 Beach 14th St</td> <td>1.000</td> </tr> <tr> <td>57 Food Market Corp</td> <td>Far Rockaway, Queens</td> <td>5725 Shore Front Pkwy</td> <td>0.854</td> </tr> <tr> <td>Fernandez & Fernandez Deli Grocery Corp</td> <td>Mariners Harbor, Staten Island</td> <td>201 Harbor Rd</td> <td>0.526</td> </tr> <tr> <td>Canarsie Food Center Inc.</td> <td>Canarsie, Brooklyn</td> <td>245 Stanley Ave</td> <td>0.261</td> </tr> <tr> <td>Gnm Deli & Grocery Inc</td> <td>Springfield Gardens, Queens</td> <td>22801 147th Ave</td> <td>0.234</td> </tr> <tr> <td>Adames Deli Grocery</td> <td>Rosedale, Queens</td> <td>25013 Hook Creek Blvd</td> <td>0.233</td> </tr> <tr> <td>Holland Deli Corp</td> <td>Mariners Harbor, Staten Island</td> <td>3400 Richmond Ter</td> <td>0.204</td> </tr> <tr> <td>Fannie Deli & Grocery Corp</td> <td>Far Rockaway, Queens</td> <td>5307 Rockaway Beach Blvd</td> <td>0.196</td> </tr> <tr> <td>Sayres 178 Deli Grocery Inc</td> <td>Jamaica, Queens</td> <td>17802 Sayres Ave</td> <td>0.141</td> </tr> <tr> <td>WALGREENS 09204</td> <td>Castleton Corners, Staten Island</td> <td>955 Manor Rd</td> <td>0.131</td> </tr> </table></div></li></ul></nav></div>');
			}
			$('#moreInfo').fadeIn('slow');
		});
		break;

	case (pop == "nychaimpact") && (score == "censusscore"):
		//$('#wait').show();
		orr_column = 'score_norm';
		
		geojson = L.geoJson(pl,{ 
			style : function (feature) {
				return { fillColor : getColor(nycha_splits,feature.properties[orr_column]), weight : 0.5, color : 'grey',	dashArray : '',	fillOpacity : 0.5 };
		    }, 
			onEachFeature : onEachFeature }).addTo(map1);
		leafletStream.ajax('data/nycha_impact.json', geojson)
				.on('end', function() {});
		
		nychaQuantiles(); addLegend(); //addSearch();
		//$('#resultlegend').fadeOut('fast', function() { $('#resultlegend').animate({height:'100%'},15).html('<p><strong>These scores are based on access to full&#45service grocery scores. <br />Scores are normalized from 0 to 1.</strong></p><p style="text-align: center;"><b><strong>Vulnerability Score</b></strong><i>(normalized on a 0-1 scale)</i><br /><b><strong> = Differential Distance between Primary and Secondary POS * NYCHA Households</strong></b></p><p><strong>Max Vulnerability Score: '+nycha_impmax+'</strong></p>'); $('#resultlegend').fadeIn('slow'); });
		break;		

	case (pop == "nychaimpact") && (score == "posscore"):
		$('#wait').show();
		orr_column = 'critical_score_nycha_normalized';
		
		geojson = L.geoJson(nycha_pos, { pointToLayer : function(feature, latlng) { return L.circleMarker(latlng, nycha_pos_style(feature)); }, onEachFeature : onEachPointFeature }).addTo(map1);
		
		nychaPosQuantiles(); addCritLegend();
		$('#resultlegend').fadeOut('fast', function() { $('#resultlegend').animate({height:'100%'},15).html('<p><strong>These scores are based on access to full&#45service grocery scores. <br />Scores are normalized from 0 to 1.</strong></p><p style="text-align: center;"><b><strong>Criticality Score</b></strong><i>(normalized on a 0-1 scale)</i><br /><b><strong> = Sum of Vulnerability Scores of Relevant NYCHA buildings</strong></b></p><p><strong>Max Criticality Score: '+nycha_posmax+'</strong></p>'); $('#resultlegend').fadeIn('slow'); });
		if (searchControl) map1.removeControl(searchControl);
		break;
	}
	map1.setView([ 40.739061, -73.952654 ], 11);
}

function lpos_style(arr,feature) { return { fillColor : getColor(arr,feature.properties[orr_column]), weight : 0.5, color : 'grey', dashArray : '', fillOpacity : 0.5, radius : 5}; }

function getColor(arr,d) {
	return d >= arr[4] ? map10colors[9] : 
		d >= arr[3] ? map10colors[7] : 
		d >= arr[2] ? map10colors[6] :
		d >= arr[1] ? map10colors[5] : 
		d >= arr[0] ? map10colors[2] : 
		map10colors[2];
}

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
	return [nyp_qs,nyp_max];
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


function addLegend() {
	var legend_series = new geostats(dataValues); 
	legend_series.setPrecision(4); 
	legend_series.setClassManually([ 0, 0.0005, 0.0034, 0.0092, 0.2, 1 ]);
	var legendDiv = legend_series.getHtmlLegend([ map10colors[2], map10colors[5], map10colors[6],map10colors[7], map10colors[9] ], null, null, null,'distinct');
	$('#maplegend').fadeOut('fast', function() { $('#maplegend').html('<p><strong>&nbsp&nbsp&nbspPercentiles &#45 80, 85, 90, 95, 95></strong></p>'+legendDiv); $('#maplegend').fadeIn('fast'); });
}


function addCritLegend() {
	switch (true) {
		case (pop == "snapimpact"):
			var legend_series = new geostats(dataValues); legend_series.setPrecision(4); legend_series.setClassManually([ 0, 0.0028, 0.024, 0.12, 0.2, 1 ]);
			var legendDiv = legend_series.getHtmlLegend([ map10colors[2], map10colors[5], map10colors[6],map10colors[7], map10colors[9] ], null, null, null, null);
			$('#maplegend').fadeOut('fast', function() { $('#maplegend').html('<p><strong>&nbsp&nbsp&nbspPercentiles &#45 99.8, 99.85, 99.9, 99.95, 99.95></strong></p>'+legendDiv); $('#maplegend').fadeIn('fast'); });
			break;
		case (pop == "genimpact" || pop =="nychaimpact"):
			var legend_series = new geostats(dataValues); legend_series.setPrecision(3); legend_series.setClassManually([ 0, 0.015, 0.038, 0.052, 0.15, 1 ]);
			var legendDiv = legend_series.getHtmlLegend([ map10colors[2], map10colors[5], map10colors[6],map10colors[7], map10colors[9] ], null, null, null,'distinct');
			$('#maplegend').fadeOut('fast', function() { $('#maplegend').html('<div id="legendDiv"><p><strong>&nbsp&nbsp&nbspPercentiles &#45 88.5, 90, 91.5, 95, 95></strong></p>'+legendDiv+'</div>'); $('#maplegend').fadeIn('fast'); });
			break;
	}
}

//Clears map and restores variables to default
$("#clearscore").click( function() {
					$('#infoWindow').html('Information Window<br />Updates as you hover over a POS or Census Area');
					var select = $('select');
					select.prop('selectedIndex', 0);
				    select.material_select();
					geojson.clearLayers();
					$('#resultlegend').animate({height:'auto'}, 15).html('<p><strong>All scores are normalized from 0-1.</strong></p>');
					$('#moreoneheader').html('POS/Census Area');
					$('#moreonebody').html('<p>Closest POS or Most affected Census Area</p>');
					$('#moretwoheader').html('Top Ten');
					$('#moretwobody').html('<p>Top ten results</p>');
					$('#maplegend').fadeOut('fast', function() { 
						document.getElementById("maplegend").innerHTML = ""; 
						$('#maplegend').fadeIn('fast'); });
					map1.setView([ 40.739061, -73.952654 ], 11);
					if (searchControl) { map1.removeControl(searchControl); }
				});

function addSearch() {
	if (searchControl) {
		map1.removeControl(searchControl);
		searchControl = new L.Control.Search({
			layer : geojson, propertyName : propname(), marker : false,
			moveToLocation : function(latlng, title, map) { var zoom = map.getBoundsZoom(latlng.layer.getBounds()); map.setView(latlng, zoom); }// access the zoom 
		});
		searchControl.on('search:locationfound', function(e) {
			e.layer.setStyle({ weight : 3, color : 'blue', dashArray : '', fillOpacity : 0.25, });
			e.layer.fire('click');
		}).on('search:collapsed', function(e) { featuresLayer.eachLayer(function(layer) { featuresLayer.resetStyle(layer); }); }); // restore feature color
		map1.addControl(searchControl); // Initialize search control
	} 
	else {
		searchControl = new L.Control.Search({
			layer : geojson, propertyName : propname(), marker : false,
			moveToLocation : function(latlng, title, map) { var zoom = map.getBoundsZoom(latlng.layer.getBounds()); map.setView(latlng, zoom); }// access the zoom
		});
		searchControl.on('search:locationfound', function(e) {
			e.layer.setStyle({ weight : 3, color : 'blue', dashArray : '', fillOpacity : 0.25, });
			e.layer.fire('click');
		}).on('search:collapsed', function(e) { featuresLayer.eachLayer(function(layer) {  featuresLayer.resetStyle(layer); });	}); // restore feature color
		map1.addControl(searchControl); // Initialize search control
	}
}

function propname() {
	var prop;
	switch (true) {
	case ((pop == "nychaimpact") && (score == "censusscore")):
		prop = 'developmen';
		break;
	case ((pop == "nychaimpact") && (score == "posscore")):
		prop = 'business_name_1';
		break;
	case ((pop == "snapimpact") && (score == "posscore")):
		prop = 'store_name';
		break;
	case ((pop == "snapimpact") && (score == "censusscore")):
		prop = 'blockid10';
		break;
	case ((pop == "baseimpact") && (score == "posscore")):
		prop = 'BUSINESS NAME';
		break;
	case ((pop == "baseimpact") && (score == "censusscore")):
		prop = 'blockid10';
		break;
	}
	return prop;
}








