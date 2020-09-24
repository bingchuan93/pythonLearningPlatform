import { collections } from 'meteor/bingchuan:plp-collections';

const { TutorialGroups } = collections;

const count = new Counter('tutorial-group-count', TutorialGroups.find({ isArchived: false }), 5000);
Meteor.publish('tutorialGroups.count', function () {
    return count;
});
