/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var shortid = require('shortid');
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.set('books', {});

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    
      var books = app.get('books'); 
      
      res.send(Object.keys(books).map(bk => {
        var book = books[bk];
        var count = book.comments ? book.comments.length : 0;
        return { ...book, commentcount: count};
      }));

    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
  
      var books = app.get('books');
      var book = { title, _id: shortid.generate() }; 
      books[book['_id']] = book;
     
      app.set('books', books);
      res.send(book);

    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    
      app.set('books', {});
      res.send('complete delete successful');

    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    
      var books = app.get('books');
      var book = books[bookid];

      if(book){
        
        res.send({
          title: book.title,
          _id: book._id,
          comments: book.comments || []
        });

      } else {
        
        res.send('no book exists');

      }

    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    
      var books = app.get('books');
      var book = books[bookid];

      if(book){

        if(!book.comments){
          book.comments = [];
        }

        book.comments.push(comment);
        app.set('books', books);

        res.send(book);

      } else {

        res.send('no books exists');

      }

    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    
      var books = app.get('books');
      var book = books[bookid];

      if(book){
        delete books[bookid];
        app.set('books', books);
      
        res.send('delete successful'); 
      } else {

        res.send('no books exists');

      }

    });
  
};
