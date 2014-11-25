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
        app.use('/api', require('./controllers/tasksController.js').Router(db));

        //GET /api/tasks - returns all tasks

        //app.get('/api/tasks', function(req, res, next) {
        //   db.all('select rowid, title, done from Tasks where done=0', function(err, rows){
        //       if (err) {
        //           return next(err);
        //       }
        //
        //       res.json(rows);
        //   });
        //});
        //
        ////POST /api/tasks - inserts a new task
        //app.post('/api/tasks', function(req, res, next) {
        //    if(!req.body.title || req.body.title.trim().length == 0) {
        //        return next({statusCode: 400, message: 'You must suppy a title!'});
        //    }
        //
        //    db.run('insert into Tasks (title, done) values (?,0)', req.body.title, function(err) {
        //        if(err){
        //            return next(err);
        //        }
        //        res.json({rowid: this.lastID});
        //    });
        //});
        //
        ////GET /api/tasks/:id - gets a particular task
        //app.get('/api/tasks/:id', function(req, res, next) {
        //    db.get('select rowid, title, done from Tasks where rowid=?'), req.params.id, function(err, row) {
        //        if(err) {
        //            return next(err);
        //        }
        //        if(row) {
        //            res.json(rows);
        //        } else {
        //            next({statusCode: 404, message: 'Invalid task id!'});
        //        }
        //    }}
        //);
        //
        ////PUT /api/tasks/:id - updates a particular task
        //app.put('/api/tasks/:id', function(req, res, next) {
        //    db.run('update Tasks set done=? where rowid=?', req.body.done, req.params.id, function(err) {
        //        if(err) {
        //            return next(err);
        //        }
        //        res.json({rowsAffected: this.changes});
        //    })
        //});

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

