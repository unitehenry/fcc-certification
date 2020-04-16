const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8000;
const dns = require('dns');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

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

app.listen(port, () => console.log(`API listening at ${port}`));
