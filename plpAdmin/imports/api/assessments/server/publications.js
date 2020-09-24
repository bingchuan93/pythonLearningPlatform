import { collections } from 'meteor/bingchuan:plp-collections';

const { Assessments } = collections;

const count = new Counter('assessments-count', Assessments.find({ isArchived: false }), 5000);
Meteor.publish('assessments.count', function () {
    return count;
});
