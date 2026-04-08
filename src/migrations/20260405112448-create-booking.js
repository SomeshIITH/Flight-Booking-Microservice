'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flightId: {
        type: Sequelize.INTEGER,
        allowNull : false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull : false
      },
      status: {
        type: Sequelize.ENUM,
        allowNull : false,
        values : ["INPROCESS","BOOKED","CANCEL","PENDING"],
        defaultValue : "INPROCESS"
      },
      noOfSeats: {
        type: Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 50
      },
      totalCost: {
        type: Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 1000
      },
      departureTime : {
        type : Sequelize.DATE,
        allowNull : false
      },
      transactionId : {
        type : Sequelize.STRING,
        allowNull : true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};