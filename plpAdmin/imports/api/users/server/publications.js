const count = new Counter('student-count', Meteor.users.find({ role: 'user' }), 5000);
Meteor.publish('students.count', function () {
    return count;
});