const sequelize = require('./db');
const User = require('./models/User');
const Event = require('./models/Event');

sequelize.sync().then(() => {
    console.log('sincronizado con la base de datos')
  });