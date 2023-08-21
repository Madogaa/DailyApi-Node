const Sequelize = require('sequelize')
const sequelize = require('../db')
const User = require('./User')

const Event = sequelize.define('event',{
    title: {
        type:Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    startDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    endDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },

})


User.associate = (models) => {
    User.belongsTo(models.user);
}

module.exports = Event;