function onEachFeature(feature, layer) { layer.on({ mouseover : mouseoverFunction, mouseout : resetHighlight, click : clickFunction }); }
function onEachPointFeature(feature, layer) { layer.on({ mouseover : mouseoverPFunction, mouseout : resetPointHighlight, click : clickFunction }); }
  
function  resetHighlight(e) { 
	e.target.setStyle({weight : 0.5, color : 'grey', dashArray : '', fillOpacity : 0.5});
	e.target.closePopup();
}
  
function  resetPointHighlight(e) { 
	e.target.setStyle({weight : 0.5, color : 'grey', dashArray : '', fillOpacity : 0.5, radius : 5});
	e.target.closePopup();
}
  
function  mouseoverFunction(e) {
	var o_s = JSON.parse(localStorage.getItem('o_s'));
	e.target.setStyle({ weight : 2, color : 'blue', dashArray : '', fillOpacity : 0.25});
	e.target.bindPopup("<b>ID: "+ e.target.feature.properties[o_s.store] +"</b></br><b>Score: "+ e.target.feature.properties[o_s.ORR] +"<b>").openPopup();
	if (!L.Browser.ie && !L.Browser.opera) { e.target.bringToFront(); }
}

function mouseoverPFunction(e) {
	var o_s = JSON.parse(localStorage.getItem('o_s'));
	e.target.setStyle({ weight : 0.75, color : 'blue', dashArray : '', fillOpacity : 0.45, radius : 5 });
	e.target.bindPopup("<b>ID: "+ e.target.feature.properties[o_s.store]+"</b></br><b>Score: "+ e.target.feature.properties[o_s.ORR] +"<b>").openPopup();
	if (!L.Browser.ie && !L.Browser.opera) {e.target.bringToFront();}
}

function clickFunction(e) {
	var scenario = JSON.parse(localStorage.getItem('scenario'));
	switch (true) {
		//To do: Change  number of more closest censuses/stores to dynamic instead of 2 default
		case ((scenario.pop == "baseimpact") && (scenario.score == "censusscore")):
			moreCensus(e,1,2);
			break;
		case ((scenario.pop == "baseimpact") && (scenario.score == "posscore")):
			moreCensus(e,2,2);
			break;
		case ((scenario.pop == "snapimpact") && (scenario.score == "censusscore")):
			moreCensus(e,3,2);
			break;
		case ((scenario.pop == "snapimpact") && (scenario.score == "posscore")):
			moreCensus(e,4,2);
			break;
		case ((scenario.pop == "nychaimpact") && (scenario.score == "censusscore")):
			moreCensus(e,5,2);
			break;
		case ((scenario.pop == "nychaimpact") && (scenario.score == "posscore")):
			moreCensus(e,6,2);
			break;
	}
}


function moreCensus(e,p,num){
	// Highlight clicked block or store
	// Reset all other highlighted elements
	// e.target.setStyle({ weight : 2, color : 'blue', dashArray : '-', fillOpacity : 0.75, radius : 7 });
	var cen_info, first_second;
	$.when( fsPOS(e,p,num) ).done( function(data){ 
         cen_info = data.info;
         first_second = data.fs; 
     });
	try {
		$('#moreonebody, #infobody').fadeOut('fast', function() { 
			if (p%2 !== 0) {
				$('#moreoneheader').html('2 Closest POS');
			}
			else {
				$('#moreoneheader').html('2 Closest Blocks/Developments');
			}
			$('#infobody').html(cen_info);
			$('#moreonebody').html(first_second); 
			$('#moreonebody, #infobody').fadeIn('fast'); 
		});
	} catch(err) { 
		console.log(err); 
	}
		
}

function fsPOS(e,p,num) {
	var scenario = JSON.parse(localStorage.getItem('o_s'));
	var data = {e:e.target.feature.properties[scenario.store], p: p, num: num}; 
	try {
		return $.ajax({  
		    url:"/info",  
		    type:"POST",
		    data: data,
		    success:function(data){
		    	return data;
		    }  
		});
	} catch (err) {
		console.log("Try error:" + err);
	}
}

