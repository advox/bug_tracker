const usersImporter = require('./Users');
const taskImporter = require('./Tasks');

console.log('Tasks Started');

usersImporter
    .getImportedUsersIdsString()
    .then(adminIdsString => {
        return taskImporter.importTasks(adminIdsString);
    })
    .catch(err => {
        console.log(err);
    })
;
return null;
