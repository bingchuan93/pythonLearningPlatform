import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';

class TutorialGroups extends Mongo.Collection {
    insert(doc, callback) {
        try {
            doc.createdAt = Date.now();
            doc.updatedAt = Date.now();
            if (callback) {
                super.insert(doc, (err, result) => {
                    callback(err, result);
                });
            }
            else {
                const result = super.insert(doc);
                return result;
            }
        }
        catch (e) {
            throw e;
        }
    }

    update(selector, modifier, options, callback) {
        try {
            modifier.$set.updatedAt = Date.now();
            if (callback) {
                super.update(selector, modifier, options, (err, result) => {
                    callback(err, result);
                });
            }
            else {
                const result = super.update(selector, modifier, options);
                return result;
            }
        }
        catch (e) {
            throw e;
        }
    }
}

const tutorialGroups = new TutorialGroups('tutorialGroups', {
    idGeneration: 'MONGO'
});

tutorialGroups.schema = new SimpleSchema({
    name: {
        type: String,
        optional: false,
        label: 'Name'
    },
    academicYear: {
        type: Number,
        optional: false,
        label: 'Academic Year'
    },
    semester: {
        type: String,
        optional: false,
        label: 'Semester',
    },
    isArchived: {
        type: Boolean,
        optional: false,
        label: 'Is Archived',
        defaultValue: false,
    },
    updatedAt: {
        type: Date,
        defaultValue: new Date(),
        optional: false,
        label: 'Last Updated Date',
    },
    createdAt: {
        type: Date,
        defaultValue: new Date(),
        optional: false,
        label: 'Creation Date',
    },
});

tutorialGroups.attachSchema(tutorialGroups.schema);

if (Meteor.isServer) {
    tutorialGroups.rawCollection().createIndex({ name: 1, academicYear: 1, semester: 1 }, { unique: true });
}

export default tutorialGroups;