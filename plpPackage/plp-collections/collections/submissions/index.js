import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';

class Submissions extends Mongo.Collection {
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

const submissions = new Submissions('submissions', {
    idGeneration: 'MONGO'
});

submissions.schema = new SimpleSchema({
    assessmentId: {
        type: Object,
        blackbox: true,
        optional: false
    },
    student: {
        type: Object,
        blackbox: true,
        optional: false,
    },
    marks: {
        type: Number,
        optional: false,
        defaultValue: 0
    },
    answers: {
        type: Object,
        blackbox: true,
        optional: false,
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

submissions.attachSchema(submissions.schema);

if (Meteor.isServer) {

}

export default submissions;