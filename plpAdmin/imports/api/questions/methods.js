import _ from 'lodash';
import { collections } from 'meteor/bingchuan:plp-collections';

const { Questions } = collections;

Meteor.methods({
    'Questions.getByIds'(_ids) {
        try {
            return Questions.find({ _id: { $in: _ids } }).fetch();
        } catch (e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to get questions by ids');
        }
    },
    'Questions.create'(formValues) {
        try {
            return Questions.insert({
                ...formValues,
                fullMarks: formValues.answers.reduce((accumulator, current) => {
                    if (current.isCorrect) {
                        accumulator += formValues.marksPerCorrectAnswer;
                    }
                }, 0),
            });
        } catch (e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to create question');
        }
    },
});
