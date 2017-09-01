const commentImporter = require('./Comments');

console.log('Comments Started');

commentImporter.assignCommentsToItsTasks();
return null;

commentImporter.removeAllComments()
    .then(() => {
        return commentImporter.importComments();
    })
    .then(() => {
        return commentImporter.assignCommentsToItsTasks();
    })
    .catch(err => {
        console.log(err);
    })
;
return null;
