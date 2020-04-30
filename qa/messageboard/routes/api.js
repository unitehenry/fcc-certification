/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
var shortid = require('shortid');

module.exports = function(app) {
  app.set('boards', {});

  app
    .route('/api/threads/:board')
    .put((req, res) => {
      const { thread_id } = req.body;
      const boards = app.get('boards');
      const board = boards[req.params.board];

      if(board){
        const thread = board[thread_id];

        if(thread){
          
          thread.reported = true;
          boards[req.params.board][thread_id] = thread;

          app.set('boards', boards);
          res.send('success');
          
        }
      }
    })
    .delete((req, res) => {
      const {thread_id, delete_password} = req.body;

      const boards = app.get('boards');
      const board = boards[req.params.board];

      if (board) {
        const thread = board[thread_id];

        if (thread) {
          if (thread.delete_password === delete_password) {
            delete boards[req.params.board][thread_id];
            app.set('boards', boards);

            res.send('success');
          } else {
            res.send('incorrect password');
          }
        }
      }
    })
    .post((req, res) => {
      const {text, delete_password} = req.body;

      const boards = app.get('boards');
      const board = boards[req.params.board];

      if (!board) {
        boards[req.params.board] = {};
      }

      const thread = {
        _id: shortid.generate(),
        text,
        created_on: new Date(),
        bumped_on: new Date(),
        reported: false,
        delete_password,
        replies: [],
      };

      boards[req.params.board][thread['_id']] = thread;
      app.set('boards', boards);

      console.log('New Thread Created:', thread['_id']);
      res.redirect(`/b/${req.params.board}`);
    })
    .get((req, res) => {
      const boards = app.get('boards');
      const board = boards[req.params.board];
      const threads = Object.keys(board).map(threadId => board[threadId]);

      if (req.query.thread_id) {
        const thread = board[req.query.thread_id];

        if (thread) {
          res.send({
            _id: thread['_id'],
            text: thread.text,
            created_on: thread['created_on'],
            bumped_on: thread['bumped_on'],
            replies: thread.replies.splice(0, 2),
          });
        }
      } else {
        const result = threads
          .sort((a, b) => {
            return a.bumped_on > b.bumped_on;
          })
          .slice(0, 10)
          .map(thread => {
            return {
              _id: thread['_id'],
              text: thread.text,
              created_on: thread['created_on'],
              bumped_on: thread['bumped_on'],
              replies: thread.replies.splice(0, 2),
            };
          });

        res.send(result);
      }
    });

  app
    .route('/api/replies/:board')
    .delete((req, res) => {
      const {thread_id, reply_id, delete_password} = req.body;
      const boards = app.get('boards');
      const board = boards[req.params.board];

      if (board) {
        const thread = board[thread_id];

        if (thread) {
          thread.replies = thread.replies.map(rep => {
            if (rep['_id'] === reply_id) {
              rep.text = '[deleted]';
            }

            return { ...rep };
          });

          boards[req.params.board][thread_id] = thread;
          app.set('boards', board);

          res.send('success');
        }
      }
    })
    .put((req, res) => {
      const { thread_id, reply_id } = req.body;
      const boards = app.set('boards');
      const board = boards[req.params.board];

      if(board){
        const thread = board[thread_id];

        if(thread){
          
          thread.replies = thread.replies.map(rep => {
            if(rep['_id'] === reply_id){
              rep.reported = true;
            }

            return { ...rep };
          }) 

          boards[req.params.board][thread_id] = thread;
          app.set('boards', boards);
          res.send('success');

        }
      }

    })
    .post((req, res) => {
      const {text, delete_password, thread_id} = req.body;
      const boards = app.get('boards');
      const board = boards[req.params.board];

      if (board) {
        const thread = boards[req.params.board][thread_id];

        if (thread) {
          thread.bumped_on = new Date();

          const reply = {
            _id: shortid.generate(),
            text,
            created_on: new Date(),
            delete_password,
            reported: false,
          };

          thread.replies.push(reply);
          boards[req.params.board][thread_id] = thread;

          app.set('boards', boards);
          res.redirect(`/b/${req.params.board}/${thread_id}`);
        }
      }
    });
};
