const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8000;
const dns = require('dns');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'files/' });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Timestamp
app.get('/api/timestamp/', (req, res) => {
  const date = new Date();
  res.send({unix: date.getTime(), utc: date.toUTCString()});
});

app.get('/api/timestamp/:date', (req, res) => {
  const {date} = req.params;
  const isNum = /^\d+$/.test(date);
  const parsed = isNum ? new Date(parseInt(date)) : new Date(date);

  if (Number.isInteger(parsed.getTime())) {
    res.send({
      unix: parsed.getTime(),
      utc: parsed.toUTCString(),
    });
  } else {
    res.send({error: 'Invalid Date'});
  }
});

// Request Header Parser
app.get('/api/whoami', (req, res) => {
  const {headers} = req;

  const ip = headers['x-forwarded-for'] || req.connection.remoteAddress;

  res.send({
    ipaddress: ip,
    language: headers['accept-language'],
    software: headers['user-agent'],
  });
});

// URL Shortener
app.set('url-id', 0);

app.post('/api/shorturl/new', (req, res) => {
  const {url} = req.body;

  dns.lookup(url, (err, address) => {
    if (err) {
      res.send({error: 'invalid URL'});
    } else {
      const urlId = app.get('url-id') + 1;
      app.set('url-id', urlId);

      app.get(`/api/shorturl/${urlId}`, (reReq, reRes) => {
        reRes.redirect('https://' + url);
      });

      res.send({original_url: url, short_url: urlId});
    }
  });
});

// Exercise Tracker
app.set('users', {});

app.post('/api/exercise/new-user', (req, res) => {
  const {username} = req.body;
  const users = app.get('users');
  const user = {username, _id: Object.keys(users).length + 1, exercises: []};

  users[user['_id']] = user;
  app.set('users', users);

  res.send({username: user.username, _id: user['_id']});
});

app.get('/api/exercise/users', (req, res) => {
  const users = app.get('users');
  const result = [];

  Object.keys(users).forEach(u => result.push(users[u]));

  res.send(
    result.map(({username, _id}) => {
      return {username, _id};
    }),
  );
});

app.post('/api/exercise/add', (req, res) => {
  const {userId, description, duration, date} = req.body;
  const users = app.get('users');

  const exercise = {
    description: description,
    duration: duration,
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
  };

  users[userId].exercises.push(exercise);

  const user = users[userId];
  app.set('users', users);
  
  res.json({username: user.username, _id: user['_id'], ...exercise});
});

app.get('/api/exercise/log', (req, res) => {
  const {userId, from, to, limit} = req.query;
  const users = app.get('users');
  const user = users[userId];

  let result = {
    username: user.username,
    _id: user['_id'],
    log: user.exercises,
    count: user.exercises.length,
  };

  if (from && to) {
    const {exercises} = user;
    let log = null;

    log = exercises.filter(({date}) => {
      return new Date(date) > new Date(from) && new Date(date) < new Date(to);
    });

    result = {
      username: user.username,
      _id: user['_id'],
      from: new Date(from).toDateString(),
      to: new Date(to).toDateString(),
      log: log,
      count: log.length,
    };
  
  }

  if (limit) {
    log = result['log']; 
    log = log.filter((l, i) => i < limit);
    result['log'] = log;
    result['count'] = log.length;
  }

  res.send(result);

});

// File Metadata
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  res.send({
    'name': req.file.originalname,
    'type': req.file.mimetype,
    'size': req.file.size
  });
});

app.listen(port, () => console.log(`API listening at ${port}`));
