const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});