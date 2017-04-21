const usersImporter = require('./Users');
const taskImporter = require('./Tasks');
const commentImporter = require('./Comments');

usersImporter
    .removeAllUsers()
    .then(() => {
        return usersImporter.importUsers();
    })
    .then(() => {
        return taskImporter.removeAllTasks();
    })
    .then(() => {
        return usersImporter.getImportedUsersIdsString();
    })
    .then((adminIdsString) => {
        return taskImporter.importTasks(adminIdsString);
    })
    .then(() => {
        return commentImporter.removeAllComments();
    })
    .then(() => {
        return commentImporter.importComments();
    })
    .then(() => {
        return console.log('Finished');
    })
    .catch(err => {
        console.log(err);
    })
;