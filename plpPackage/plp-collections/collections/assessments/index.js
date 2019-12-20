import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';

class Assessments extends Mongo.Collection {
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

const assessments = new Assessments('assessments', {
    idGeneration: 'MONGO'
});

assessments.schema = new SimpleSchema({
    type: {
        type: String,
        optional: false,
        label: 'Type'
    },
    name: {
        type: String,
        optional: false,
        label: 'Name'
    },
    description: {
        type: String,
        optional: false,
        label: 'Description',
        defaultValue: '',
    },
    participatingTutorialGroups: {
        type: Array,
        optional: false,
        label: 'Participating Tutorial Groups',
        defaultValue: [],
    },
    'participatingTutorialGroups.$': {
        type: String,
    },
    questionIds: {
        type: Array,
        optional: false,
        label: 'Question IDs',
        defaultValue: [],
    },
    'questionIds.$': {
        type: Object,
        blackbox: true
    },
    duration: {
        type: Number,
        optional: true,
        label: 'Duration',
        defaultValue: 0
    },
    startDate: {
        type: Date,
        optional: true,
        label: 'Start Date'
    },
    endDate: {
        type: Date,
        optional: true,
        label: 'End Date'
    },
    isArchived: {
        type: Boolean,
        optional: false,
        label: 'Is Archived',
        defaultValue: false, 
    }, 
    createdAt: {
        type: Date,
        defaultValue: new Date(),
        optional: false,
        label: 'Creation Date',
    },
    updatedAt: {
        type: Date,
        defaultValue: new Date(),
        optional: false,
        label: 'Last Updated Date',
    }
});

assessments.attachSchema(assessments.schema);

if (Meteor.isServer) {
    assessments.rawCollection().createIndex({ name: 1 }, { unique: true });
}

export default assessments;