const express = require('express');
const path = require('path');
const cors = require('cors');
const Events = require('./events');
const app = express();

const events = new Events();

app.use(cors());

app.use(express.json());

app.post('/trigger-event', (req, res) => {
  const eventName = req.body.eventName;
  events.on(eventName, () => {

  });
  events.trigger(eventName);
  events.off(eventName);
  res.send('Event triggered successfully!');
});

app.use(express.static(path.join(__dirname, 'public')));



const port = 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


