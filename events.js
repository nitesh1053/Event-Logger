const mongoose = require('mongoose');
const fs = require('fs');

// Define the event log schema
const eventLogSchema = new mongoose.Schema({
  event: { type: String, required: true },
  triggerTime: { type: Date, default: Date.now },
});

// Create the EventLog model using the event log schema
const EventLog = mongoose.model('EventLog', eventLogSchema);

class Events {
  constructor() {
    this.events = {};
    this.connectToMongoDB();
  }

  connectToMongoDB() {
    const uri = 'mongodb://localhost:27017/event-logger';
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log('Connected to MongoDB successfully!');
      })
      .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
      });
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  async trigger(eventName) {
    if (this.events[eventName]) {
      for (const callback of this.events[eventName]) {
        callback();

        try {
          // Log the triggered event in MongoDB
          const eventLog = new EventLog({ event: eventName });
          await eventLog.save();

          // Print the event log in the app.log file
          const logMessage = `${eventName} --> ${new Date().toString()}\n`;
          fs.appendFile('./app.log', logMessage, (err) => {
            if (err) {
              console.error('Error writing event log to app.log:', err);
            }
          });
        } catch (err) {
          console.error('Error logging event to MongoDB:', err);
        }
      }
    }
  }

  off(eventName) {
    delete this.events[eventName];
  }
}

module.exports = Events;

