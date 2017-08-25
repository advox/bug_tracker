const pool = require('./db/connection');
const User = require('../models/user');
const db = require("../bin/db");

module.exports = {
    removeAllUsers: function () {
        return new Promise((resolved, reject) => {
            User.remove({}, (err) => {
                if (err) {
                    return reject(err)
                }
                return resolved();
            });
        })
    },
    importUsers: function () {
        return new Promise((resolve, reject) => {
            var counter = 1;
            pool.query('SELECT * FROM admins', function (error, results, fields) {
                results.map(row => {
                    name = row.name.split(' ');
                    let user = new User({
                        login: row.login,
                        password: row.pass,
                        email: row.admin_email,
                        name: name[0],
                        surname: name[1],
                        status: row.active,
                        group: row.group === 'manager' ? 1 : row.group === 'dev' ? 2 : 0,
                        color: row.color,
                        externalId: row.id,
                    });
                    try {
                        user.save();

                    } catch (err) {
                        return reject(err);
                    }
                    console.log(counter);
                    counter = counter + 1;
                    return resolve();
                });
            });
        });
    },

    getImportedUsersIdsString: function () {
        return new Promise((resolved, reject) => {
            let query = User.find({}).select('externalId -_id');
            query.exec((err, values) => {
                if (err) {
                    return reject(err)
                }
                let adminIds = [];
                values.map(value => {
                    adminIds.push(value.externalId)
                });
                return resolved(adminIds.join())
            });
        })
    }

};
