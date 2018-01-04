var config = require('../../server/config.json');
//var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');



const sqlite3 = require('sqlite3').verbose();
let db;

var service = {};

service.createDB = createDB;
service.authenticate = authenticate;
 
module.exports = service;

function createDB() {
	var deferred = Q.defer();
	
	try {
		db = new sqlite3.Database(':memory:');
		
		const users = [['Kate','admin'],['Joe','admin'],['guest','guest']]
		db.serialize(function() {
		    //Initialize table
			db.run('drop table if exists users;');
		    db.run('create table users (user varchar(15), pwd varchar(15));');
		    //Insert Users data
		    var stmt = db.prepare('insert into users values(?,?)');
		    for (var i=0; i<users.length; i++) {
		    	stmt.run(users[i]);
		    }
		    stmt.finalize();
		    deferred.resolve();
		});
	}
	catch (err) {deferred.reject();}
	
	//db.close();
	return deferred.promise;
}


function authenticate(username, password) {
    var deferred = Q.defer();
 
    if (username != undefined && username != '' && password != undefined) {
    	db.get("select * from users where user=? and pwd=?", [ username, password ], function (err, row) {
        	if (err) deferred.reject(err.name + ': ' + err.message);
        	
        	/*if (row && bcrypt.compareSync(password, row.hash)) {
        		// authentication successful
        		deferred.resolve({ 
        			username: row.user,
        			token: jwt.sign({ sub: user._id }, config.secret)
        		});
        	}*/
        	if (row != undefined) {
        		// authentication successful
        		deferred.resolve();
        	}
        	else {
                // authentication failed
                deferred.reject();
        	}
        });
        
        return deferred.promise;
    }
    else {
    	deferred.resolve({user: 'guest'});
    }
}


