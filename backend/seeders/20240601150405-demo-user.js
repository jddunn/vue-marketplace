'use strict';
const bcrypt = require('bcryptjs');

const makePassword = (pw) => {
    return new Promise(async (rs) => {
        let salt, hash;
        salt = await bcrypt.genSalt(10);
        hash = await bcrypt.hash(pw, salt);
        return rs(hash);
    });
};

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const hashedPassword1 = await makePassword('password123');
        const hashedPassword2 = await makePassword('password123');

        return queryInterface.bulkInsert(
            'Users',
            [
                {
                    email: 'user1@example.com',
                    password: hashedPassword1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    email: 'user2@example.com',
                    password: hashedPassword2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {},
        );
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    },
};
