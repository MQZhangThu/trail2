/*
Main Technique Focus:
1. Back-end based on KOA;
2. KOA Sequelize to manage the DB;
3. JWT
4. HTML5 localStorage for storing tokens (implemented on client-side JS (public/js/main.js))

Scenario:
- The user submits the email and password to the server;
- The server generates a JSON WEB TOKEN with expire time, and then sends the token back to the browser client;
- The JWT token is stored in the DB using Sequelize, to support server-side token validation
- Browser client will store the JWT using HTML5 localStorage ( the token can be attached in the header each time when send requests to the server)
- When the browser jumps to the welcom.html, the token will be read from localStorage and displayed.

How to run:
1. modify ./config/dbconfig.json to properly configure the DB
2. npm install necessary modules (koa, koa-static, koa-router, co-body, moment, jwt-simple)
3. node --harmony app

Optional: 
You can change the secret string defined in the file ./config/secretconfig.json

*/
var serve = require('koa-static');
var app = require('koa')();
var router = require('koa-router')();
var parse = require('co-body');
var moment = require('moment');
var jwt = require('jwt-simple');

var dbconfig = require('./config/dbconfig.json');
var secretconfig = require('./config/secretconfig.json');

app.use(serve('public'));

router.post('/handlerLogin', function *(next) {
	this.req.body = yield parse(this);
	console.log(this.req.body); 
	/* { email: 'a@a.com', pwd: 'faddsfa1233ADSADS' } */
	
	var postData = this.req.body;

	var response = ({
		'status':'success'
	});
	
	var Sequelize = require('sequelize');
	var sequelize = new Sequelize(dbconfig.dbName, dbconfig.userName, dbconfig.pwd, {
      dialect: dbconfig.dialect, 
      port:  dbconfig.port, 
    });
	
	/* Login DB - account authentication */
	var test = sequelize.authenticate()
    .then(function () {
        console.log("CONNECTED! ");
    })
    .catch(function (err) {
		response.status = 'Unable to connect to the database.';
    })
    .done();
	
	/* Create table schema if necessary */
	var loginTable = sequelize.define(
		'loginTable', 
		{
			userName: {type: Sequelize.STRING, primaryKey: true},
			token: Sequelize.TEXT
		},
		{
			engine:'myISAM'
		}
	);
	
	/* Generate the token */
	var expires = moment().add('days', 7).valueOf();
	var token = jwt.encode({
	  iss: postData.email,
	  exp: expires
	}, secretconfig.jwtTokenSecret);
	
	console.log('Token: ' + token);
	
	
	loginTable.sync({force:'true'}).then(function() {
	  console.log('sync success');
		/* Insert or Update the token in Database*/
		loginTable.upsert({
			userName: postData.email.toString(),
			token: token.toString()
		}).then(function() {
			console.log("upsert successfully");
		}).catch(function(e) {
			console.log("upsert failed: "+e.toString());
			response.status = 'fail to upsert.';
		});
	}, function(err) {
	  console.log('sync fail');
	  response.status = 'fail to sync the table schema.';
	});
	
	response.token = token;
	
	this.body = JSON.stringify(response);
});

app
  .use(router.routes())
  .use(router.allowedMethods());
  
app.listen(80);
 
console.log('listening on port 80...');