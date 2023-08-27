const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const cors = require('cors');

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://daily-api-ten.vercel.app'];

app.use(cors({
  origin: allowedOrigins
}));

app.use(bodyParser.json());

app.use('/auth', cors(), authRoutes);
app.use('/events',cors(), eventRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});