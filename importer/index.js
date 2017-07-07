const usersImporter = require('./Users');
const taskImporter = require('./Tasks');
const commentImporter = require('./Comments');

console.log('Started');
usersImporter
    .removeAllUsers()
    .then(() => {
        return usersImporter.importUsers();
    })
    .then(() => {
        return taskImporter.removeAllTasks();
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
    .then(() => {
        return usersImporter.getImportedUsersIdsString();
    })
    .then(adminIdsString => {
        return taskImporter.importTasks(adminIdsString);
    })
    .then(() => {
        return commentImporter.removeAllComments();
    })
    .then(() => {
        return commentImporter.importComments();
    })
    .then(() => {
        return commentImporter.assignCommentsToItsTasks();
    })
    .then(() => {
        return console.log('Finished');
    })
    .catch(err => {
        console.log(err);
    })
;
console.log('End');
return null;
