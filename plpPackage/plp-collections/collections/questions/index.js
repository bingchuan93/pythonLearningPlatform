import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';
import { StringDecoder } from 'string_decoder';

class Questions extends Mongo.Collection {
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

const questions = new Questions('questions', {
    idGeneration: 'MONGO'
});

questions.schema = new SimpleSchema({
    type: {
        type: String,
        optional: false,
        label: 'Type'
    },
    content: {
        type: String,
        optional: false,
        label: 'Content'
    },
    answers: {
        type: Array,
        optional: false,
        label: 'Answers',
        minCount: 1
    },
    'answers.$': {
        type: String
    },
    marks: {
        type: Number,
        optional: false,
        label: 'Marks',
        defaultValue: 1,
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

questions.attachSchema(questions.schema);

if (Meteor.isServer) {
    // questions.rawCollection().createIndex({ name: 1 }, { unique: true });
}

export default questions;