import { collections } from 'meteor/bingchuan:plp-collections';

const { TutorialGroups } = collections;

Meteor.methods({
    'TutorialGroups.getAll' () {
        try {
            return TutorialGroups.find({}).fetch();
        }
        catch (e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to get all tutorial groups');
        }
    }
})