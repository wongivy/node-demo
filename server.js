/*
    server.js

    Main script for our Node.js server.
    This script will create the Express application and add routers for our REST API
*/
'use strict';

var sqlite3 = require('sqlite3');
var express = require('express');
var bodyParser = require('body-parser');

//open the database
var dbPath = __dirname + '/data/tasks.db';
var db = new sqlite3.Database(dbPath, function(err) {
    if (err) {
        throw err;
    }

    var createTablesSql = 'create table if not exists Tasks (title text, done int);';
    db.run(createTablesSql, function() {

        //create an express application
        var app = express();

        //use the JSON parser from bodyParser
        app.use(bodyParser.json());

        //serve static files from the /static sub-directory
        app.use(express.static(__dirname + '/static'));

        //create routes for our REST API
        //GET /api/tasks - returns all tasks

        //POST /api/tasks - inserts a new task

        //GET /api/tasks/:id - gets a particular task

        //PUT /api/tasks/:id - updates a particular task




        //finally, add an error handler that sends back the error info as JSON
        app.use(function(err, req, res, next) {
            if (undefined == err.statusCode || 500 == err.statusCode) {
                console.error(err);
            }

            res.status(err.statusCode || 500).json({message: err.message || err.toString()});
        });

        //start the web server
        var server = app.listen(8080, function() {
            console.log('listening for requests sent to http://localhost:%s', server.address().port);
        });

        //listen for the SIGINT signal (Ctrl+C) and shut down the database gracefully
        process.on('SIGINT', function() {
            console.log('closing database...');
            db.close(function(err) {
                if (err) {
                    console.log('error closing database! ' + err);
                    process.exit(1);
                }
                else {
                    console.log('database is safely closed.');
                    process.exit(0);
                }
            }); //db.close()
        }); //on SIGINT
    }); //create tables
}); //open database

