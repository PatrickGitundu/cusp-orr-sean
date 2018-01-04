const express = require('express');
const router = express.Router();
var path = require('path');
//var config = require('../bin/config.json');
var userService = require('../services/user.service');
var data = require('../../dist/assets/data/data');

//Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

router.post('/authenticate', authenticate);
//router.get('/logout', logout);
//router.post('/isloggedin', isLoggedIn);

router.post('/splits', getData);

router.post('/info', getInfo);

function authenticate(req, res) {
	if (req.body.username != undefined) {
		userService.authenticate(req.body.username.replace(/\s+/g, ''), req.body.password)
        .then(function (user) {
        	// authentication successful
        	res.json({user: req.body.username, authenticated: true});
        })
        .catch(function (err) {
        	// authentication failed
        	res.json({user: req.body.username, authenticated: false});
        });
	}
	else {
		res.json({user: 'guest', authenticated: true});
	}
	
}
// Enable these functions once session management is activated.
/*
function logout(req, res) {
	//Clear session
	res.json();
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
    	return next();
    // if they aren't redirect them to the home page
    else {
    	var message = encodeURIComponent('You are not authorized to view that page');
    	res.json();
    }
}
*/
function getData(req,res) {
	var json;
	switch(true) {
		case (req.body.p == '1'):
			json = { splits: data.gs, max: data.gm, dv: data.dv } ;
			res.json(json);
			break;
		case (req.body.p == '2'):
			json = { splits: data.gps, max: data.gpm, dv: data.dv } ;
			res.json(json);
			break;
		case (req.body.p == '3'):
			json = { splits: data.ss, max: data.sm, dv: data.dv } ;
			res.json(json);
			break;
		case (req.body.p == '4'):
			json = { splits: data.sps, max: data.spm, dv: data.dv } ;
			res.json(json);
			break;
		case (req.body.p == '5'):
			json = { splits: data.ns, max: data.nm, dv: data.dv } ;
			res.json(json);
			break;
		case (req.body.p == '6'):
			json = { splits: data.nps, max: data.npm, dv: data.dv } ;
			res.json(json);
			break;
		default:
			json = { splits: [0,0], max: 0, dv: [0,0] } ;
			res.json(json);
	}
}

function getInfo(req,res) {
	var json = { info : data.info(req.body.e,req.body.p), fs: data.fs(req.body.e, req.body.p, req.body.num)};
	res.json(json);
}

function getResults(req,res) {
	var json = { results : data.results(req.body.user)};
	res.json(json);
}
module.exports = router;