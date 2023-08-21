const Sequelize = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcrypt');
const Event = require('./Event')

const User = sequelize.define('user',{
    username:{
        type: Sequelize.STRING,
        allowNull: false,
        unique:true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
})

User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

User.hasMany(Event);

  module.exports = User;

