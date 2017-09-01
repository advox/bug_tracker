const pool = require('./db/connection');
const Comment = require('../models/comment');
const Task = require('../models/task');
const User = require('../models/user');
const db = require("../bin/db");
const Promise = require('bluebird');
const http = require('http');
const fs = require('fs');
const mkdirp = require('mkdirp');
const mime = require('mime-types');

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
            pool.query(`select * from zgloszenia_odp where odp_text > '' order by odp_id asc`,
            function (error, results, fields) {
                results.map(row => {

                    let comment = new Comment({
                        content: row.odp_text,
                        createdAt: row.odp_date,
                        updatedAt: row.odp_date,
                        externalId: row.odp_id,
                        task: null,
                        parent: null,
                        author: null,
                    });

                    try {
                        comment.save();
                    } catch (err) {
                        console.log(err);
                    }
                });
            });
        })
    },

    assignCommentsToItsTasks: function() {
        return new Promise((resolved, reject) => {
            pool.query(`select * from zgloszenia_odp where odp_text > '' order by odp_id asc`,
            function (error, results, fields) {
                results.map(row => {
                    Promise.props({
                        parentTask: Task.getByExternalId(row.odp_zgl_id),
                        author: User.getByExternalId(row.odp_admin_id),
                        comment: Comment.getByExternalId(row.odp_id),
                    }).then(results => {

                        let author = null;
                        let parentTask = null;

                        if(results.author.length > 0) {
                            author = results.author[0]._id;
                        }

                        if(results.parentTask.length > 0) {
                            parentTask = results.parentTask[0]._id;
                        }
console.log(1);
                        let commentData = {
                            author: author,
                            content: row.odp_text,
                            task: parentTask,
                            files: [1,2],
                            externalId: row.odp_id,
                            createdAt: row.odp_date,
                            updatedAt: row.odp_date,
                            status: 54
                        };
                        console.log(2);


                        try {
                            Comment.findByIdAndUpdate(commentData._id, { $set: commentData}, { new: true }, function (err, comment) {
                                if (err) return handleError(err);
                                console.log(2.45);
                            });

                            // Comment.update({_id: commentData._id}, {$set: commentData}, function(err, doc){
                            //     if(err){
                            //         console.log("Something wrong when updating data!");
                            //     }
                            //     console.log(doc);
                            // });
                            console.log(3);
                            // comment.save();
                                // .then(function(result){
                                //
                                //     let filesArray = [];
                                //
                                //     if (row.odp_file1 != '') {
                                //         var fileObject = {
                                //             'size': '',
                                //             'path': 'public/images/upload/' + result._id + '/' + row.odp_file1,
                                //             'filename': row.odp_file1,
                                //             'destination': 'public/images/upload/' + result._id,
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
                                //             'path': 'public/images/upload/' + result._id + '/' + row.odp_file2,
                                //             'filename': row.odp_file2,
                                //             'destination': 'public/images/upload/' + result._id,
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
                                //             'path': 'public/images/upload/' + result._id + '/' + row.odp_file3,
                                //             'filename': row.odp_file3,
                                //             'destination': 'public/images/upload/' + result._id,
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
                                //             'path': 'public/images/upload/' + result._id + '/' + row.odp_file4,
                                //             'filename': row.odp_file4,
                                //             'destination': 'public/images/upload/' + result._id,
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
                                //             'path': 'public/images/upload/' + result._id + '/' + row.odp_file5,
                                //             'filename': row.odp_file5,
                                //             'destination': 'public/images/upload/' + result._id,
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
                                // });
                        } catch (err) {
                            console.log(err);
                            return reject(err)
                        }
                        return resolved();
                    });
                });
            });
        });
    }
};