const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

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
