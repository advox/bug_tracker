const usersImporter = require('./Users');
const taskImporter = require('./Tasks');
const commentImporter = require('./Comments');

console.log('Init Started');

usersImporter
    .removeAllUsers()
    .then(() => {
        return usersImporter.importUsers();
    })
    .then(() => {
        return taskImporter.removeAllTasks();
    })
    .then(() => {
        return commentImporter.removeAllComments();
    })
    .then(() => {
        return taskImporter.removeTaskStatuses();
    })
    .then(() => {
        return taskImporter.addTaskStatuses();
    })
    .then(() => {
        return taskImporter.removeTaskImportance();
    })
    .then(() => {
        return taskImporter.addTaskImportance();
    })
    .catch(err => {
        console.log(err);
    })
;
return null;
