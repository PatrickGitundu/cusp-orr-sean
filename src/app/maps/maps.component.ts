import { Component,  OnInit, AfterViewInit } from '@angular/core';
import Leaf from 'leaflet';
import leafletStream from 'leaflet-geojson-stream';
import leafletSearch from 'leaflet-search';

import { SplitsService } from './splits.service';

import geostats from 'geostats';

import './maps.js';

declare var $: any;
declare var onEachFeature: any;
declare var onEachpointFeature: any;
declare var addSearch: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: [
	  './maps.component.scss',
	  ]
})

export class MapsComponent implements AfterViewInit {
  user = localStorage.getItem('currentUser');

	  pops = [
	  		{ value: 'baseimpact', viewValue: 'Total Population'},
		  	{ value: 'snapimpact', viewValue: 'SNAP'},
		  	{ value: 'nychaimpact', viewValue: 'NYCHA'}
	  ];

	  scores = [
	  		{ value: 'censusscore', viewValue: 'Vulnerable Population'},
		  	{ value: 'posscore', viewValue: 'Critical POS'}
	  ];

	  map10colors = [ '#006837', '#1a9850', '#66bd63', '#a6d96a', '#d9ef8b', '#fee08b', '#F6D11E', '#FBA50E', '#d73027', '#a50026' ];

	  selectedPop: string;
	  selectedScore: string;

	  map1: any;
	  geojson: any;
	  searchControl: any;

	  updatePop(text) {
		  this.selectedPop = text.value;
	  }
	  updateScore(text) {
		  this.selectedScore = text.value;
	  }

	  ngAfterViewInit(): void {
		  $('.collapsible').collapsible();
		  $('.select').material_select();
		  $('nav').pushpin({
			        top: 0,
			        bottom: 1000,
			        offset: 0
			      });

		  const basemapUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
		  const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
		  this.map1 = Leaf.map('map1', { scrollWheelZoom : false }).setView([ 40.739061, -73.952654 ], 11);
		  Leaf.tileLayer(basemapUrl, {attribution : attribution }).addTo(this.map1);
	  }

  	  constructor( private splitsService: SplitsService) { }

	  clearPage(p) {
		  if (p !== 1) {
			  this.clearSelect();
		  }

		  try {
			  $('#infoWindow').fadeOut('fast', function() {	
				  $('.collapsible').collapsible('close', 0);
				  $('.collapsible').collapsible('close', 1);
				  //$('#formulabody').html('<p>All scores are normalized from 0-1.<br/>With a score of 1 having the highest vulnerability.</p>');
				  $('#infobody').html('Updates when you click on an area or outlet.');
				  $('#infoWindow').fadeIn('fast');
				});		  
		   } catch (err) { console.log(err); }

			if (this.geojson !== undefined) {
				this.map1.removeLayer(this.geojson);
			}

			$('#moreoneheader').html('POS/Census Area');
			$('#moreonebody').html('<p>Closest POS or Most affected Census Area</p>');
			$('#moretwoheader').html('Top Ten');
			$('#moretwobody').html('<p>Top ten results</p>');

			$('#maplegend').fadeOut('fast', function() {
				document.getElementById('maplegend').innerHTML = '';
				$('#maplegend').fadeIn('fast'); });

			this.map1.setView([ 40.739061, -73.952654 ], 11);
			$('.indeterminate').hide();

			/*if (this.searchControl) { this.map1.removeControl(this.searchControl); }*/
		}

  	  clearSelect() {
		   this.selectedPop = '';
		   this.selectedScore = '';
	   }


	  seeScore() {
		  // To do: Indicate to the user in the event there is a problem with the selections.
		  this.clearPage(1);
			try {
				if (this.geojson === undefined) {
					localStorage.setItem('scenario', JSON.stringify({'pop': this.selectedPop, 'score': this.selectedScore}));
					this.createMap(this.selectedPop, this.selectedScore);
				} else {
					this.geojson.clearLayers();
					localStorage.setItem('scenario', JSON.stringify({'pop': this.selectedPop, 'score': this.selectedScore}));
					this.createMap(this.selectedPop, this.selectedScore);
				}
             } catch (err) {
				console.log(err);
             }
		}

	  createMap(pop, score) {
		    const pl = { 'type': 'FeatureCollection', 'features': []};

			$('#maplegend').fadeOut('fast', function() {
				document.getElementById('maplegend').innerHTML = '';
				$('.collapsible').collapsible('close', 0);
				$('.collapsible').collapsible('close', 1);
				});

			switch (true) {

			case (pop === 'baseimpact') && (score === 'censusscore'):
				localStorage.setItem('o_s', JSON.stringify({ORR: 'impact_score_normalized', store: 'blockid10'}));
				this.addMap(1, 1, './assets/data/gen_json.json');
				this.moreTwo(1);
				break;

			case (pop === 'baseimpact') && (score === 'posscore'):
				localStorage.setItem('o_s', JSON.stringify({ORR: 'critical_score_pop_normalized', store: 'BUSINESS NAME'}));
				this.addMap(2, 2, './assets/data/gen_pos.json');
				this.moreTwo(2);
				break;

			case (pop === 'snapimpact') && (score === 'censusscore'):
				localStorage.setItem('o_s', JSON.stringify({ORR: 'impact_score_normalized', store: 'blockid10'}));
				this.addMap(3, 1, './assets/data/snap_impact.json');
				this.moreTwo(3);
				break;

			case (pop === 'snapimpact') && (score === 'posscore'):
				localStorage.setItem('o_s', JSON.stringify({ORR: 'critical_score_snap_normalized', store: 'store_name'}));
				this.addMap(4, 2, './assets/data/snap_pos.json');
				this.moreTwo(4);
				break;

			case (pop === 'nychaimpact') && (score === 'censusscore'):
				localStorage.setItem('o_s', JSON.stringify({ORR: 'score_norm', store: 'blockid10'}));
				this.addMap(5, 1, './assets/data/nycha_impact.json');
				this.moreTwo(5);
				//this.addSearch();
				break;

			case (pop === 'nychaimpact') && (score === 'posscore'):
				localStorage.setItem('o_s', JSON.stringify({ORR: 'critical_score_nycha_normalized', store: 'business_name'}));
				this.addMap(6, 2, './assets/data/nycha_pos.json');
				this.moreTwo(6);
				break;
			}
			this.map1.setView([ 40.739061, -73.952654 ], 11);
		}

	  addMap(scenario, map_type, url) {
			$('.indeterminate').show();
			this.splitsService.getSplits(scenario).subscribe(
					data => {
						this.streamMap(map_type, url, data['splits']);
						this.addLegend(data['splits'], data['dv']);
						/*this.addSearch();*/
						addFormula(scenario, data['max']);
					},
					err => { console.log(err); });
			/*if (searchControl) map1.removeControl(searchControl);*/

			function addFormula(sc, max) {
				  switch (sc) {
					  case 1:

						  break;
					  case 2:
						  $('#formulabody').html( '<p><strong>These scores are based on access to full&#45service grocery scores.' +
								  '<br/>Scores are normalized from 0 to 1.</strong></p>' +
								  '<p style="text-align: center;"><b><strong>Criticality Score</b></strong><i>(normalized on a 0-1 scale)</i><br/>' +
								  '<b><strong> = Sum of Vulnerability Scores of Relevant Census Blocks</strong></b>' +
								  '</p><p><strong>Max Criticality Score: ' + max + '</strong></p>');
						  break;
					  case 3:
						  $('#formulabody').html('<p><strong>These scores are based on access to ALL stores that accept SNAP.' +
								  '<br/>Scores are normalized from 0 to 1.</strong></p>' +
								  '<p style="text-align: center;"><b><strong>Vulnerability Score</b></strong><i>(normalized on a 0-1 scale)</i><br/>' +
								  '<b><strong> = Differential Distance between Primary and Secondary SNAP POS * ' +
								  '% SNAP Households * Total Census Block Households</strong></b></p>' +
								  '<p><strong>Max Vulnerability Score: ' + max + '</strong></p>');
						  break;
					  case 4:
						  $('#formulabody').html('<p><strong>These scores are based on access to ALL stores that accept SNAP.' +
								  '<br/>Scores are normalized from 0 to 1.</strong></p>' +
								  '<p style="text-align: center;"><b><strong>Criticality Score</b></strong><i>(normalized on a 0-1 scale)</i></i>' +
								  '<br/><b><strong> =  Sum of Vulnerability Scores of Relevant Census Blocks</strong></b></p>' +
								  '<p><strong>Max Criticality Score: ' + max + '</strong></p>');
						  break;
					  case 5:
						  $('#formulabody').html('<p><strong>These scores are based on access to full&#45service grocery scores.' +
								  '<br/>Scores are normalized from 0 to 1.</strong></p>' +
								  '<p style="text-align: center;"><b><strong>Vulnerability Score</b></strong><i>(normalized on a 0-1 scale)</i>' +
								  '<br/><b><strong> = Differential Distance between Primary and Secondary POS * NYCHA Households</strong></b></p>' +
								  '<p><strong>Max Vulnerability Score: ' + max + '</strong></p>');
						  break;
					  case 6:
						  $('#formulabody').html('<p><strong>These scores are based on access to full&#45service grocery scores.' +
								  '<br/>Scores are normalized from 0 to 1.</strong></p>' +
								  '<p style="text-align: center;"><b><strong>Criticality Score</b></strong><i>(normalized on a 0-1 scale)</i>' +
								  '<br/><b><strong> = Sum of Vulnerability Scores of Relevant NYCHA buildings</strong></b></p>' +
								  '<p><strong>Max Criticality Score: ' + max + '</strong></p>');
						  break;
				  }
			  }
		}

	  streamMap(t, url, splits) {
		  	const orr_c = JSON.parse(localStorage.getItem('o_s'));
		  	const pl = { 'type': 'FeatureCollection', 'features': []};
			const map10colors = this.map10colors;
			switch (t) {
				case 1:
					this.geojson = Leaf.geoJson(pl, {
						style : function (feature) {
							return { fillColor : getColor(splits, feature.properties[orr_c.ORR]),
                                     weight : 0.5, color : 'grey', dashArray : '', fillOpacity : 0.5 };
						},
						onEachFeature : onEachFeature }).addTo(this.map1);
					leafletStream.ajax(url, this.geojson)
							.on('end', function() {
								$('.indeterminate').hide();
							});
					break;
				case 2:
					this.geojson = Leaf.geoJson(pl, {
						pointToLayer : function(feature, latlng) {
							return Leaf.circleMarker(latlng, lpos_style(splits, feature));
						},
						onEachFeature : onEachPointFeature }).addTo(this.map1);
					leafletStream.ajax(url, this.geojson)
							.on('end', function() {
								$('.indeterminate').hide();
							});
					break;
			}
			function lpos_style(arr, feature) {
			    return {
					fillColor : getColor(arr, feature.properties[orr_c.ORR]), weight : 0.5, color : 'grey', dashArray : '', fillOpacity : 0.5, radius : 5
				};
			}

			function getColor(arr, d) {
				return d >= arr[4] ? map10colors[9] :
					d >= arr[3] ? map10colors[7] :
					d >= arr[2] ? map10colors[6] :
					d >= arr[1] ? map10colors[5] :
					d >= arr[0] ? map10colors[2] :
					map10colors[2];
			}
		}

	  moreTwo(p) {
			if (this.user === 'guest') {
				$('#moretwoheader').html('Top Ten Census Blocks');
				$('#moretwobody').html('<p>You are not authorized to view these results.</p>');
			} else {
				switch(true) {
					case (p === 1):
						$('#moretwoheader').html('Top Ten Census Blocks');
						$('#moretwobody').html('<div><table><thead><tr><th>Neighborhood</th><th>Population</th><th>Distance Increase (ft)</th> <th>Normalized Vulnerability Score</th> </tr> </thead> <tr> <td>Roosevelt Island (Central)</td> <td>4970</td> <td>844</td> <td>1.000</td> </tr> <tr> <td>Washington Heights, Manhattan</td> <td>2335</td> <td>978</td> <td>0.544</td> </tr> <tr> <td>Roosevelt Island (North)</td> <td>1905</td> <td>1017</td> <td>0.462</td> </tr> <tr> <td>Kips Bay, Manhattan</td> <td>2106</td> <td>816</td> <td>0.410</td> </tr> <td>Roosevelt Island (Central)</td> <td>1188</td> <td>1292</td> <td>0.366</td> </tr> <tr> <td>Parkchester, Bronx</td> <td>3646</td> <td>359</td> <td>0.312</td> </tr> <tr> <td>Williamsburg, Brooklyn</td> <td>2177</td> <td>582</td> <td>0.302</td> </tr> <tr> <td>Two Bridges, Manhattan</td> <td>1981</td> <td>622</td> <td>0.294</td> </tr> <tr> <td>Williamsburg, Brooklyn</td> <td>3419</td> <td>359</td> <td>0.292</td> </tr> <tr> <td>City Island, Bronx</td> <td>240</td> <td>5106</td> <td>0.292</td> </tr> </table></div>');
						break;
					case (p === 2):
						$('#moretwoheader').html('Top Ten Stores - Total Population');
						$('#moretwobody').html('<div><table> <thead> <tr> <th>Business Name</th> <th>Neighborhood</th> <th>Normalized Criticality Score</th> </tr> </thead> <tr> <td>City Island Deli</td> <td>City Island, Bronx</td> <td>1.000</td> </tr> <tr> <td>Pathmark Stores  Inc</td> <td>Bay Terrace, Staten Island</td> <td>0.532</td> </tr> <tr> <td>Gristedes Foods  Inc</td> <td>Roosevelt Island (North)</td> <td>0.452</td> </tr> <tr> <td>Waldbaum Inc</td> <td>Arden Heights, Staten Island</td> <td>0.419</td> </tr> <tr> <td>145 Food Center Inc</td> <td>Springfield Gardens, Queens</td> <td>0.382</td> </tr> <tr> <td>Richmond Food  Inc</td> <td>West Brighton, Staten Island</td> <td>0.381</td> </tr> <tr> <td>Benn S Meat Market</td> <td>Mariners Harbor, Staten Island</td> <td>0.362</td> </tr> <tr> <td>K & S Produce Inc</td> <td>Throgs Neck, Bronx</td> <td>0.357</td> </tr> <tr> <td>Nadine Food Corp</td> <td>East Elmhurst, Queens</td> <td>0.308</td> </tr> <tr> <td>Trader Joes Company</td> <td>New Springville, Staten Island</td> <td>0.295</td> </tr> </table></div>');
						break;
					case (p === 3):
						$('#moretwoheader').html('Top Ten Census Blocks');
						$('#moretwobody').html('<div><table> <thead> <tr> <th>Neighborhood</th> <th>Number of Households</th> <th>SNAP Percentage</th> <th>Distance Increase (ft)</th> <th>Normalized Vulnerability Score</th> </tr> </thead> <tr> <td>Far Rockaway, Queens</td> <td>1087</td> <td>53%</td> <td>470</td> <td>1.000</td> </tr> <tr> <td>Concourse, Bronx</td> <td>630</td> <td>42%</td> <td>646</td> <td>0.626</td> </tr> <tr> <td>Carnarsie, Brooklyn</td> <td>1601</td> <td>55%</td> <td>143</td> <td>0.470</td> </tr> <tr> <td>Mariners Harbor, Staten Island</td> <td>341</td> <td>62%</td> <td>585</td> <td>0.458</td> </tr> <tr> <td>Sheepshead Bay, Brooklyn</td> <td>528</td> <td>57%</td> <td>317</td> <td>0.351</td> </tr> <tr> <td>East New York, Brooklyn</td> <td>849</td> <td>53%</td> <td>208</td> <td>0.347</td> </tr> <tr> <td>Washington Heights, Manhattan</td> <td>837</td> <td>57%</td> <td>187</td> <td>0.331</td> </tr> <tr> <td>Mott Haven, Bronx</td> <td>566</td> <td>62%</td> <td>242</td> <td>0.315</td> </tr> <tr> <td>Far Rockaway, Queens</td> <td>343</td> <td>39%</td> <td>569</td> <td>0.281</td> </tr> <tr> <td>Chelsea, Manhattan</td> <td>814</td> <td>21%</td> <td>441</td> <td>0.280</td> </tr> </table></div>');
						break;
					case (p === 4):
						$('#moretwoheader').html('Top Ten Stores - SNAP');
						$('#moretwobody').html('<div><table> <thead> <tr> <th>Business Name</th> <th>Neighborhood</th> <th>ADDRESS</th> <th>Normalized Criticality Score</th> </tr> </thead> <tr> <td>290 Beach 14th Street Grocery, Corp/Pioneer Spmkt</td> <td>Far Rockaway, Queens</td> <td>290 Beach 14th St</td> <td>1.000</td> </tr> <tr> <td>57 Food Market Corp</td> <td>Far Rockaway, Queens</td> <td>5725 Shore Front Pkwy</td> <td>0.854</td> </tr> <tr> <td>Fernandez & Fernandez Deli Grocery Corp</td> <td>Mariners Harbor, Staten Island</td> <td>201 Harbor Rd</td> <td>0.526</td> </tr> <tr> <td>Canarsie Food Center Inc.</td> <td>Canarsie, Brooklyn</td> <td>245 Stanley Ave</td> <td>0.261</td> </tr> <tr> <td>Gnm Deli & Grocery Inc</td> <td>Springfield Gardens, Queens</td> <td>22801 147th Ave</td> <td>0.234</td> </tr> <tr> <td>Adames Deli Grocery</td> <td>Rosedale, Queens</td> <td>25013 Hook Creek Blvd</td> <td>0.233</td> </tr> <tr> <td>Holland Deli Corp</td> <td>Mariners Harbor, Staten Island</td> <td>3400 Richmond Ter</td> <td>0.204</td> </tr> <tr> <td>Fannie Deli & Grocery Corp</td> <td>Far Rockaway, Queens</td> <td>5307 Rockaway Beach Blvd</td> <td>0.196</td> </tr> <tr> <td>Sayres 178 Deli Grocery Inc</td> <td>Jamaica, Queens</td> <td>17802 Sayres Ave</td> <td>0.141</td> </tr> <tr> <td>WALGREENS 09204</td> <td>Castleton Corners, Staten Island</td> <td>955 Manor Rd</td> <td>0.131</td> </tr> </table></div>');
						break;
					case (p === 5):
						$('#moretwoheader').html('Top Ten Census Blocks');
						$('#moretwobody').html('<div><table> <thead> <tr> <th>Development</th> <th>Number of Households</th> <th>Distance Increase (ft)</th> <th>Normalized Vulnerability Score</th> </tr> </thead> <tr> <td>FHA REPOSSESSED HOUSES (GROUP VII), Queens</td> <td>274</td> <td>960</td> <td>1.000</td> </tr> <tr> <td>New York City Housing Authority&#39s Dr. Ramon E. Betances II, 13 (700 E 140th St, Bronx, NY 10454)</td> <td>518</td> <td>438</td> <td>0.862</td> </tr> <tr> <td>La Preciosa-NYCHA (1070 Washington Ave Bronx, NY 10456)</td> <td>590</td> <td>348</td> <td>0.780</td> </tr> <tr> <td>FHA REPOSSESSED HOUSES (GROUP X), Queens</td> <td>284</td> <td>688</td> <td>0.743</td> </tr> <tr> <td>New York City Housing Authority&#39s Howard Avenue-Park Place (1761 Sterling Pl, Brooklyn, NY 11233)</td> <td>365</td> <td>514</td> <td>0.714</td> </tr> <tr> <td>NYCHA &#45 Betances II, 18 (443 E 137th St Bronx, NY 10454)</td> <td>519</td> <td>353</td> <td>0.696</td> </tr> <tr> <td>FHA REPOSSESSED HOUSES (GROUP V), Brooklyn</td> <td>260</td> <td>696</td> <td>0.688</td> </tr> <tr> <td>New York City Housing Authority&#39s Dr. Ramon E. Betances III, 18 (411 East 136th Street, Bronx, NY 10454, Bronx, NY 10454)</td> <td>521</td> <td>347</td> <td>0.687</td> </tr> <tr> <td>New York City Housing Authority&#39s Lower East Side III (722 E 9th St, New York, NY 10009)</td> <td>364</td> <td>468</td> <td>0.647</td> </tr> <tr> <td>New York City Housing Authority &#45 Beach 41st Street (38-20 Beach Channel Dr, Far Rockaway, NY 11691)</td> <td>165</td> <td>1000</td> <td>0.627</td> </tr> </table></div>');
						break;
					case (p === 6):
						$('#moretwoheader').html('Top Ten Stores - NYCHA');
						$('#moretwobody').html('<div><table> <thead> <tr> <th>Business Name</th> <th>Neighborhood</th> <th>Normalized Criticality Score</th> </tr> </thead> <tr> <td>Myrtle Food Court Corp</td> <td>Jamaica, Queens</td> <td>1.000</td> </tr> <tr> <td>Palaite Pleasures Inc</td> <td>St. Albans, Queens</td> <td>0.981</td> </tr> <tr> <td>Vegetable Fruit & Fish Mkt Inc</td> <td>Foxhurst, Bronx</td> <td>0.821</td> </tr> <tr> <td>Jackson Avenue Live Plty Mkt</td> <td>Mott Haven, Bronx</td> <td>0.791</td> </tr> <tr> <td>Saile Food Corporation</td> <td>Brownsville, Brooklyn</td> <td>0.766</td> </tr> <tr> <td>Shop Smart Meat Market Inc</td> <td>Brownsville, Brooklyn</td> <td>0.650</td> </tr> <tr> <td>R&M Produce Corp</td> <td>Morrisania, Bronx</td> <td>0.445</td> </tr> <tr> <td>JRL Produce Inc</td> <td>Foxhurst, Bronx</td> <td>0.440</td> </tr> <tr> <td>161 East Meat Corp</td> <td>Morrisania, Bronx</td> <td>0.397</td> </tr> <tr> <td>200 Malcolm X Meat Corp</td> <td>Bedford-Stuyvesant, Brooklyn</td> <td>0.352</td> </tr> </table></div>');
						break;
				}
			}
		}
	  
	  addLegend(arr, dv) {
			const legend_series = new geostats(dv);
			legend_series.setPrecision(4);
			legend_series.setClassManually(arr);
			const legendDiv = legend_series.getHtmlLegend([
				this.map10colors[2],
				this.map10colors[5],
				this.map10colors[6],
				this.map10colors[7],
				this.map10colors[9] ],
				null, null, null, 'distinct');
			$('#maplegend').fadeIn('fast', function() { $('#maplegend').html('<p><strong>' +
					'&nbsp&nbsp&nbspPercentiles &#45 80, 85, 90, 95, 95></strong></p>' + legendDiv); });
		}
	  
	  addSearch() {
		  	/*this.searchControl = new L.control.search({
				position: 'topright',
				layer : this.geojson,
				initial: false,
				propertyName : this.propname(this.selectedPop, this.selectedScore),
				marker : false,
				moveToLocation : function(lat_long, title, map) {
									let zoom = map.getBoundsZoom(lat_long.layer.getBounds());
									map.setView(lat_long, zoom);
								}// access the zoom
			});
			this.searchControl.on('search:locationfound', function(e) {
				e.layer.setStyle({ weight : 3, color : 'blue', dashArray : '', fillOpacity : 0.25, });
				e.layer.fire('click');
			}).on('search:collapsed', function(e) {
										/*featuresLayer.eachLayer(function(layer) {
																		featuresLayer.resetStyle(layer);
																	});
											}); // restore feature color*/
		  this.map1.addControl(new Leaf.Control.Search());
		}

	  propname(pop, score) {
			let prop;
			switch (true) {
			case ((pop === 'nychaimpact') && (score === 'censusscore')):
				prop = 'developmen';
				break;
			case ((pop === 'nychaimpact') && (score === 'posscore')):
				prop = 'business_name_1';
				break;
			case ((pop === 'snapimpact') && (score === 'posscore')):
				prop = 'store_name';
				break;
			case ((pop === 'snapimpact') && (score === 'censusscore')):
				prop = 'blockid10';
				break;
			case ((pop === 'baseimpact') && (score === 'posscore')):
				prop = 'BUSINESS NAME';
				break;
			case ((pop === 'baseimpact') && (score === 'censusscore')):
				prop = 'blockid10';
				break;
			}
			return prop;
		}
}
