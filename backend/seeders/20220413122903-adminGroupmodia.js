"use strict";
const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("Users", [
      {
        id: 1,
        username: "admin",
        email: process.env.ADMIN_MAIL,
        password: bcrypt.hashSync(
          process.env.ADMIN_PASSWORD,
          bcrypt.genSaltSync(10)
        ),
        avatar: "http://localhost:3000/images/AvatarProfile/random-user.png",
        bio: "",
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
