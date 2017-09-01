const pool = require('./db/connection');
const Task = require('../models/task');
const User = require('../models/user');
const Status = require('../models/task/status');
const Importance = require('../models/task/importance');
const db = require("../bin/db");
const Promise = require('bluebird');
const http = require('http');
const fs = require('fs');
const mkdirp = require('mkdirp');
const mime = require('mime-types')

module.exports = {
    removeAllTasks: function () {
        return new Promise((resolved, reject) => {
            Task.remove({}, (err) => {
                if (err) {
                    return reject(err)
                }
                return resolved();
            });
        })
    },
    removeTaskStatuses: function() {
        return new Promise((resolved, reject) => {
            Status.remove({}, (err) => {
                if (err) {
                    return reject(err)
                }
                return resolved();
            });
        })
    },
    addTaskStatuses: function () {
        let status = new Status({
            externalId: 0, name: 'Dev-wait'
        });
        status.save();
        status = new Status({
            externalId: 1, name: 'Paker'
        });
        status.save();
        status = new Status({
            externalId: 2, name: 'Done'
        });
        status.save();
        status = new Status({
            externalId: 3, name: 'Feature'
        });
        status.save();
        status = new Status({
            externalId: 4, name: 'Dev-active'
        });
        status.save();
    },
    removeTaskImportance: function() {
        return new Promise((resolved, reject) => {
            Importance.remove({}, (err) => {
                if (err) {
                    return reject(err)
                }
                return resolved();
            });
        })
    },
    addTaskImportance: function () {
        let importance = new Importance({
            externalId: 1, name: 'Normal'
        });
        importance.save();
        importance = new Importance({
            externalId: 2, name: 'Urgent'
        });
        importance.save();
        importance = new Importance({
            externalId: 3, name: 'Sebastian'
        });
        importance.save();
    },
    importTasks: function (adminIds) {
        return new Promise((resolved, reject) => {
            pool.query(`
            SELECT * FROM zgloszenia WHERE zgl_admin_id in (${adminIds}) AND zgl_title != ''`,
            function (error, results, fields) {
                results.map(row => {
                    Promise.props({
                        author: User.getByExternalId(row.zgl_admin_id),
                        assignee: User.getByExternalId(row.zgl_to_admin_id),
                        taskStatus: Status.getByExternalId(row.zgl_status),
                        importance: Importance.getByExternalId(row.zgl_priorytet),
                        importanceSebastian: Importance.getByExternalId(3),
                        importanceNormal: Importance.getByExternalId(1),
                    }).then(results => {

                        let author = null;
                        let assignee = null;
                        let importance = null;
                        let importanceSeb = 0;

                        if (results.importance.length > 0) {
                            importance = results.importance[0]._id;
                        } else {
                            importance = results.importanceNormal[0]._id;
                        }

                        if (row.zgl_sebastian > 0) {
                            importanceSeb = 1;
                        }

                        if(results.author[0]._id) {
                            author = results.author[0]._id;
                        }

                        if(results.assignee[0]) {
                            assignee = results.assignee[0]._id;
                        }

                        let task = new Task({
                            status: results.taskStatus[0]._id,
                            title: row.zgl_title,
                            content: row.zgl_desc,
                            rank: row.zgl_ranga,
                            importance: importance,
                            seb: importanceSeb,
                            author: author,
                            assignee: assignee,
                            notifications: [],
                            files: [],
                            externalId: row.zgl_id,
                            createdAt: row.zgl_date,
                            updatedAt: row.zgl_akt,
                        });

                        try {
                            task.save()
                                .then(function(result){

                                    let filesArray = [];

                                    if (row.zgl_file1 != '') {
                                        var fileObject = {
                                            'size': '',
                                            'path': 'public/images/upload/' + result._id + '/' + row.zgl_file1,
                                            'filename': row.zgl_file1,
                                            'destination': 'public/images/upload/' + result._id,
                                            'mimetype': mime.lookup(row.zgl_file1),
                                            'encoding': '7bit',
                                            'originalname': row.zgl_file1,
                                            'fieldname': 'files'
                                        };
                                        filesArray.push(fileObject);
                                    }
                                    if (row.zgl_file2 != '') {
                                        var fileObject = {
                                            'size': '',
                                            'path': 'public/images/upload/' + result._id + '/' + row.zgl_file2,
                                            'filename': row.zgl_file2,
                                            'destination': 'public/images/upload/' + result._id,
                                            'mimetype': mime.lookup(row.zgl_file2),
                                            'encoding': '7bit',
                                            'originalname':  row.zgl_file2,
                                            'fieldname': 'files'
                                        };
                                        filesArray.push(fileObject);
                                    }
                                    if (row.zgl_file3 != '') {
                                        var fileObject = {
                                            'size': '',
                                            'path': 'public/images/upload/' + result._id + '/' + row.zgl_file3,
                                            'filename': row.zgl_file3,
                                            'destination': 'public/images/upload/' + result._id,
                                            'mimetype': mime.lookup(row.zgl_file3),
                                            'encoding': '7bit',
                                            'originalname':  row.zgl_file3,
                                            'fieldname': 'files'
                                        };
                                        filesArray.push(fileObject);
                                    }
                                    if (row.zgl_file4 != '') {
                                        var fileObject = {
                                            'size': '',
                                            'path': 'public/images/upload/' + result._id + '/' + row.zgl_file4,
                                            'filename': row.zgl_file4,
                                            'destination': 'public/images/upload/' + result._id,
                                            'mimetype': mime.lookup(row.zgl_file4),
                                            'encoding': '7bit',
                                            'originalname':  row.zgl_file4,
                                            'fieldname': 'files'
                                        };
                                        filesArray.push(fileObject);
                                    }
                                    if (row.zgl_file5 != '') {
                                        var fileObject = {
                                            'size': '',
                                            'path': 'public/images/upload/' + result._id + '/' + row.zgl_file5,
                                            'filename': row.zgl_file5,
                                            'destination': 'public/images/upload/' + result._id,
                                            'mimetype': mime.lookup(row.zgl_file5),
                                            'encoding': '7bit',
                                            'originalname':  row.zgl_file5,
                                            'fieldname': 'files'
                                        };
                                        filesArray.push(fileObject);
                                    }

                                    if (filesArray.length > 0) {

                                        for (let i = 1; i<=5; i++) {
                                            let field = "zgl_file" + i;

                                            if (row[field] != '') {
                                                mkdirp('public/images/upload/' + result._id, function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    let file = fs.createWriteStream("public/images/upload/" + result._id + "/" + row[field]);
                                                    http.get("http://www.paker.co.uk/_admin/pliki/zgl/" + row[field], function(response) {
                                                        response.pipe(file);
                                                    });
                                                });
                                            }
                                        }

                                        result.files = filesArray;
                                        result.save();
                                    }
                                });
                        } catch (err) {
                            return reject(err)
                        }
                        return resolved();
                    });
                });
            });
        })
    }
};