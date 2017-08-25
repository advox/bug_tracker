const pool = require('./db/connection');
const Comment = require('../models/comment');
const Task = require('../models/task');
const User = require('../models/user');
const db = require("../bin/db");
const Promise = require('bluebird');
const http = require('http');
const fs = require('fs');
const mkdirp = require('mkdirp');
const mime = require('mime-types')

module.exports = {
    removeAllComments: function () {
        return new Promise((resolved, reject) => {
            Comment.remove({}, (err) => {
                if (err) {
                    return reject(err)
                }
                return resolved();
            });
        })
    },

    importComments: function () {
        return new Promise((resolved, reject) => {
            pool.query(`select * from zgloszenia_odp where odp_text > '' order by odp_main_odp_id`,
            function (error, results, fields) {
                results.map(row => {
                    Promise.props({
                        parentTask: Task.getByExternalId(row.odp_zgl_id),
                        author: User.getByExternalId(row.odp_admin_id),
                    }).then(results => {

                        var author = null;

                        if (results.author.length > 0) {
                            author = results.author[0]._id;
                        }
                        console.log(results.author);
                        console.log(results.parentTask);

                        if (results.author.length > 0 && results.parentTask.length >0) {

                            let comment = new Comment({
                                author: author,
                                task: results.parentTask[0]._id,
                                content: row.odp_text,
                                createdAt: row.odp_date,
                                updatedAt: row.odp_date,
                                status: row.odp_done,
                            });

                            try {
                                comment.save();
                                // .then(function(result){
                                //
                                //     let filesArray = [];
                                //
                                //     if (row.odp_file1 != '') {
                                //         var fileObject = {
                                //             'size': '',
                                //             'path': 'public/images/upload/' + result.task + '/' + row.odp_file1,
                                //             'filename': row.odp_file1,
                                //             'destination': 'public/images/upload/' + result.task,
                                //             'mimetype': mime.lookup(row.odp_file1),
                                //             'encoding': '7bit',
                                //             'originalname': row.odp_file1,
                                //             'fieldname': 'files'
                                //         };
                                //         filesArray.push(fileObject);
                                //     }
                                //     if (row.odp_file2 != '') {
                                //         var fileObject = {
                                //             'size': '',
                                //             'path': 'public/images/upload/' + result.task + '/' + row.odp_file2,
                                //             'filename': row.odp_file2,
                                //             'destination': 'public/images/upload/' + result.task,
                                //             'mimetype': mime.lookup(row.odp_file2),
                                //             'encoding': '7bit',
                                //             'originalname':  row.odp_file2,
                                //             'fieldname': 'files'
                                //         };
                                //         filesArray.push(fileObject);
                                //     }
                                //     if (row.odp_file3 != '') {
                                //         var fileObject = {
                                //             'size': '',
                                //             'path': 'public/images/upload/' + result.task + '/' + row.odp_file3,
                                //             'filename': row.odp_file3,
                                //             'destination': 'public/images/upload/' + result.task,
                                //             'mimetype': mime.lookup(row.odp_file3),
                                //             'encoding': '7bit',
                                //             'originalname':  row.odp_file3,
                                //             'fieldname': 'files'
                                //         };
                                //         filesArray.push(fileObject);
                                //     }
                                //     if (row.odp_file4 != '') {
                                //         var fileObject = {
                                //             'size': '',
                                //             'path': 'public/images/upload/' + result.task + '/' + row.odp_file4,
                                //             'filename': row.odp_file4,
                                //             'destination': 'public/images/upload/' + result.task,
                                //             'mimetype': mime.lookup(row.odp_file4),
                                //             'encoding': '7bit',
                                //             'originalname':  row.odp_file4,
                                //             'fieldname': 'files'
                                //         };
                                //         filesArray.push(fileObject);
                                //     }
                                //     if (row.odp_file5 != '') {
                                //         var fileObject = {
                                //             'size': '',
                                //             'path': 'public/images/upload/' + result.task + '/' + row.odp_file5,
                                //             'filename': row.odp_file5,
                                //             'destination': 'public/images/upload/' + result.task,
                                //             'mimetype': mime.lookup(row.odp_file5),
                                //             'encoding': '7bit',
                                //             'originalname':  row.odp_file5,
                                //             'fieldname': 'files'
                                //         };
                                //         filesArray.push(fileObject);
                                //     }
                                //
                                //     if (filesArray.length > 0) {
                                //
                                //         for (let i = 1; i<=5; i++) {
                                //             let field = "odp_file" + i;
                                //
                                //             if (row[field] != '') {
                                //                 mkdirp('public/images/upload/' + result._id, function (err) {
                                //                     if (err) {
                                //                         console.log(err);
                                //                     }
                                //                     let file = fs.createWriteStream("public/images/upload/" + result._id + "/" + row[field]);
                                //                     http.get("http://www.paker.co.uk/_admin/pliki/zgl/" + row[field], function(response) {
                                //                         response.pipe(file);
                                //                     });
                                //                 });
                                //             }
                                //         }
                                //
                                //         result.files = filesArray;
                                //         result.save();
                                //     }
                                //
                                // });
                            } catch (err) {
                                console.log(err);
                                return reject(err)
                            }
                        }

                        return resolved();

                    });
                });
            });
        })
    },

    assignCommentsToItsTasks: function() {
        return new Promise((resolved, reject) => {
            Task.find({}, (err, tasks) => {
                if (err) {
                    reject();
                }
                tasks.map(task => {
                    Comment.find({task: task._id}, (err, comments) => {
                        if (err) {
                            reject();
                        }
                        task.comments = comments;
                        task.save(err => {
                            if (err) {
                                reject();
                            }
                        });
                    })
                });
                resolved()
            })
        })
    }
};