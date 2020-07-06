import { collections } from 'meteor/bingchuan:plp-collections';

const { TutorialGroups } = collections;

Meteor.methods({
    'TutorialGroups.list'(params) {
        try {
            const { pageSize, page, filters, fields, sort, extraParams } = params;
            const { isArchived, relatedTutorialGroupIds } = extraParams;
            if (isArchived != undefined) {
                filters.isArchived = isArchived;
            }
            if (relatedTutorialGroupIds) {
                filters._id = { $in: relatedTutorialGroupIds };
            }
            const tutorialGroups = TutorialGroups.find(filters, { fields: fields, sort: sort, skip: page * pageSize, limit: pageSize }).fetch();
            const count = TutorialGroups.find(filters).count();
            return { data: tutorialGroups, count: count };
        }
        catch (e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to list tutorial groups');
        }
    },
    'TutorialGroups.create'(form) {
        const namesNotAdded = [];
        form.names.forEach((name) => {
            try {
                TutorialGroups.insert({
                    name: name,
                    academicYear: form.academicYear,
                    semester: form.semester
                });
            }
            catch (e) {
                if (e.reason) {
                    namesNotAdded.push({ name: name, error: e.reason });
                }
                namesNotAdded.push({ name: name, error: 'Fail to create tutorial group' });
            }
        });
        if ( namesNotAdded.length > 0 ) {
            return { error: true, data: namesNotAdded };
        }
        else {
            return { error: false };
        }
    },
    'TutorialGroups.update'(id, form) {
        try {
            TutorialGroups.update(new Mongo.ObjectID(id), {
                $set: {
                    name: form.name,
                    academicYear: form.academicYear,
                    semester: form.semester
                }
            });
        }
        catch (e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to update tutorial groups');
        }
    },
    'TutorialGroups.archive'(_id) {
        try {
            TutorialGroups.update(_id, { $set: { isArchived: true } });
        }
        catch (e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to archive tutorial group');
        }
    },
    'TutorialGroups.restore'(_id) {
        try {
            TutorialGroups.update(_id, { $set: { isArchived: false } });
        }
        catch (e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to restore tutorial group');
        }
    },
    'TutorialGroups.getById'(id) {
        try {
            return TutorialGroups.findOne(new Mongo.ObjectID(id));
        }
        catch (e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to get tutorial group by id');
        }
    },
    'TutorialGroups.getAll'() {
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
});