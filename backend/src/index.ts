import express from 'express';
import bodyParser from 'body-parser';
import eventsRouter from './routes/events';

const app = express();
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the ChronoQuest Backend API');

});

// Mount the events API on /events
app.use('/events', eventsRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
