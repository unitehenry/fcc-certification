const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8000;

app.use(cors());

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

app.listen(port, () => console.log(`API listening at ${port}`));
