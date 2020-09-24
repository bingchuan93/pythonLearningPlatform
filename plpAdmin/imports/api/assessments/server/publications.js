import { collections } from 'meteor/bingchuan:plp-collections';

const { Assessments } = collections;

const count = new Counter('assessment-count', Assessments.find({ isArchived: false }), 5000);
Meteor.publish('assessments.count', function () {
    return count;
});
