import { collections } from 'meteor/bingchuan:plp-collections';

const { Questions } = collections;

const count = new Counter('question-count', Questions.find({ isArchived: false }), 5000);
Meteor.publish('questions.count', function () {
    return count;
});
