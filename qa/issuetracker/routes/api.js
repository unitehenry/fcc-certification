/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var shortid = require('shortid');
var _ = require('lodash');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
  app.set('projects', {});

  app
    .route('/api/issues/:project')

    .get(function(req, res) {
      var project = req.params.project;
      var projects = app.get('projects');

      var proj = projects[project];

      if(!proj){
        res.send('project not found');
        return false;
      }

      var issues = proj.issues;
      var params = Object.keys(req.query); 

      if(params.length){
        params.forEach(p => {
          issues = Object.keys(issues).filter(i => {
            var iss = issues[i];
            return iss[p] === req.query[p]; 
          }).map(i => issues[i]); 
        })
      }

      res.send(issues);
    })

    .post(function(req, res) {
      var project = req.params.project;
      var title = req.body['issue_title'];
      var text = req.body['issue_text'];
      var createdBy = req.body['created_by'];
      var assignedTo = req.body['assigned_to'];
      var statusText = req.body['status_text'];

      var projects = app.get('projects');
      var newid = shortid.generate();

      var issue = {
        _id: newid,
        issue_title: title,
        issue_text: text,
        created_by: createdBy,
        assigned_to: assignedTo || '',
        status_text: statusText || '',
        open: true,
        updated_on: new Date(),
        created_on: new Date()
      };

      if (!projects[project]) {
        projects[project] = {issues: {}};
        projects[project].issues[newid] = issue;
      } else {
        projects[project].issues[newid] = issue;
      }

      app.set('projects', projects);

      res.json(issue);
    })

    .put(function(req, res) {
      var project = req.params.project;
      var id = req.body['_id'];
      var title = req.body['issue_title'];
      var text = req.body['issue_text'];
      var createdBy = req.body['created_by'];
      var assignedTo = req.body['assigned_to'];
      var statusText = req.body['status_text'];
      var open = req.body['open'];
      
      var projects = app.get('projects');
      
      var proj = projects[project];

      if(!proj){
        res.send('could not update ' + id);
        return false;
      }

      if(!proj.issues[id]){
        res.send('could not update ' + id);
        return false;
      }

      var issue = projects[project].issues[id];

      if(
        !title &&
        !text &&
        !createdBy &&
        !assignedTo &&
        !statusText &&
        !open
      ){
        res.send('no updated fields sent');
        return false;
      }

      if(
        issue['issue_title'] === title &&
        issue['issue_text'] === text &&
        issue['created_by'] === createdBy &&
        issue['assigned_to'] === assignedTo &&
        issue['status_text'] === statusText &&
        issue['open'] === open
      ) {
        res.send('no updated field sent');
        return false;
      }

      var updatedissue = {
        issue_title: title,
        issue_text: text,
        created_by: createdBy,
        assigned_to: assignedTo || '',
        status_text: statusText || '',
        open: open,
        updated_on: new Date()
      };

      projects[project].issues[id] = { ...issue, ...updatedissue };
      app.set('projects', projects);
     
      res.send('successfully updated');
    })

    .delete(function(req, res) {
      var project = req.params.project;
      var id = req.body['_id'];
   
      var projects = app.get('projects');

      if(!id){
        res.send('id error');
        return false;
      }

      var proj = projects[project];

      if(!proj){
        res.send('could not delete ' + id);
        return false;
      }

      if(!proj.issues[id]){
        res.send('could not delete ' + id);
        return false;
      }

      delete projects[project].issues[id];
      app.set('projects', projects);

      res.send('deleted ' + id);

    });
};
