const db = require("./db");
const User = require('../models/user');
const Comment = require('../models/comment');
const Status = require('../models/task/status');
const Task = require('../models/task');

var status = new Status({
    externalId: 0, name: 'Dev-wait'
});
status.save();

var status = new Status({
    externalId: 1, name: 'Paker'
});
status.save();

var status = new Status({
    externalId: 2, name: 'Done'
});
status.save();

var status = new Status({
    externalId: 3, name: 'Feature'
});
status.save();

var status = new Status({
    externalId: 4, name: 'Dev-active'
});
status.save();

return null;
