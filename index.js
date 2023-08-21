const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', // Reemplaza esto con la URL de tu frontend
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  };

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use('/auth', cors(), authRoutes);
app.use('/events',cors(), eventRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});