import { collections } from 'bingchuan:plp-collections';

const { TutorialGroups } = collections;

Meteor.methods({
    'TutorialGroups.list'(params) {
        try {
            const { pageSize, page, filters, fields, sort } = params;
            const tutorialGroups = TutorialGroups.find(filters, { fields: fields, sort: sort, skip: page * pageSize, limit: pageSize }).fetch();
            const count = TutorialGroups.find(filters).count();
            return { data: tutorialGroups, count: count };
        }
        catch(e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to list tutorial groups');
        }
    },
    'TutorialGroups.create' (form) {
        try {
            throw new Meteor.Error('error', 'Fail to create tutorial group');
        }
        catch(e) {

        }
    }
});