/**
 * Created by Ivy on 11/25/2014.
 */

"use strict";

//reference to SQLite database
var _db;
var express = require('express');

//GET /api/tasks - returns all tasks
function getAllTasks(req, res, next) {
    _db.all('select rowid, title, done from Tasks where done=0', function(err, rows){
        if (err) {
            return next(err);
        }

        res.json(rows);
    });
}

//POST /api/tasks - inserts a new task
function insertTasks(req, res, next) {
    if(!req.body.title || req.body.title.trim().length == 0) {
        return next({statusCode: 400, message: 'You must suppy a title!'});
    }

    _db.run('insert into Tasks (title, done) values (?,0)', req.body.title, function(err) {
        if(err){
            return next(err);
        }
        res.json({rowid: this.lastID});
    });
}

//GET /api/tasks/:id - gets a particular task
function getTask(req, res, next) {
    _db.get('select rowid, title, done from Tasks where rowid=?', req.params.id, function(err, row) {
        if(err) {
            return next(err);
        }
        if(row) {
            res.json(row);
        } else {
            next({statusCode: 404, message: 'Invalid task id!'});
        }
    });
}

//PUT /api/tasks/:id - updates a particular task
function updateTask(req, res, next) {
    _db.run('update Tasks set done=? where rowid=?', req.body.done, req.params.id, function(err) {
        if(err) {
            return next(err);
        }
        res.json({rowsAffected: this.changes});
    })
}


module.exports.Router = function(db) {
    _db = db;

    var router = express.Router();
    router.get('/tasks', getAllTasks);
    router.post('/tasks', insertTasks);
    router.get('tasks/:id', getTask);
    router.put('/tasks/:id', updateTask);
    return router;
};