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
const axios = require('axios');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
  app.set('likes', {});

  app.route('/api/stock-prices').get(function(req, res) {
    const stock = req.query.stock;
    const isLiked = req.query.like;

    const likes = app.get('likes');

    if (typeof stock === 'object') {
      const results = [];

      stock.forEach(stk => {
        const like = likes[stk];

        if (isLiked) {
          if (!like) {
            likes[stk] = 1;
          } else {
            likes[stk] = like + 1;
          }
        }

        axios
          .get(`https://repeated-alpaca.glitch.me/v1/stock/${stk}/quote`)
          .then(quote => {
            results.push({
              stock: stk,
              price: quote.data.latestPrice,
              likes: likes[stk] || 0,
            });
          });
      });

      setTimeout(() => {
        results[0].rel_likes = results[0].likes - results[1].likes;
        results[1].rel_likes = results[1].likes - results[0].likes;

        res.send({
          stockData: results.map(({rel_likes, price, stock}) => {
            return {rel_likes, price, stock};
          }),
        });
      }, 2000);
    } else {
      const like = likes[stock];

      if (isLiked) {
        if (!like) {
          likes[stock] = 1;
        } else {
          likes[stock] = like + 1;
        }
      }

      axios
        .get(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`)
        .then(quote => {
          res.send({
            stockData: {
              stock,
              price: quote.data.latestPrice,
              liked: likes[stock] || 0,
            },
          });
        });
    }
  });
};
