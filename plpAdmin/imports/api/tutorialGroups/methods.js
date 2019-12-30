import { collections } from 'meteor/bingchuan:plp-collections';

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
            const _id = TutorialGroups.insert({
                name: form.name,
                academicYear: form.academicYear,
                semester: form.semester
            });

            return _id;
        }
        catch(e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to create tutorial groups');
        }
    },
    'TutorialGroups.update' (id, form) {
        try {
            TutorialGroups.update(new Mongo.ObjectID(id), {
                $set: {
                    name: form.name,
                    academicYear: form.academicYear,
                    semester: form.semester
                }
            });
        }
        catch(e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to update tutorial groups');
        }
    },
    'TutorialGroups.archive' (_id) {
        try {
            TutorialGroups.update(_id, { $set: { isArchived: true } });
        }
        catch(e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to archive tutorial group');
        }
    },
    'TutorialGroups.restore' (_id) {
        try {
            TutorialGroups.update(_id, { $set: { isArchived: false } });
        }
        catch(e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to restore tutorial group');
        }
    },
    'TutorialGroups.getById' (id) {
        try {
            return TutorialGroups.findOne(new Mongo.ObjectID(id));
        }
        catch(e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to get tutorial group by id');
        }
    }
});