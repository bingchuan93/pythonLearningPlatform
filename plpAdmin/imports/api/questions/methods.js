import _ from 'lodash';
import { collections } from 'meteor/bingchuan:plp-collections';

const { Questions } = collections;

Meteor.methods({
	'Questions.list'(params) {
		try {
			const { pageSize, page, filters, fields, sort } = params;
			const questions = Questions.find(filters, {
				fields: fields,
				sort: sort,
				skip: page * pageSize,
				limit: pageSize
			}).fetch();
			const count = Questions.find(filters).count();
			return { data: questions, count: count };
		} catch (e) {
			if (e.reason) {
				throw new Meteor.Error(e.error, e.reason);
			}
			throw new Meteor.Error('error', 'Fail to list questions');
		}
	},
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
            let fullMarks = 0;
            if (formValues.type != 'coding') {
                fullMarks = formValues.answers.reduce((accumulator, current) => {
                    if (current.isCorrect) {
                        accumulator += formValues.marksPerCorrectAnswer;
                    }
                }, 0);
            } else {
                fullMarks = formValues.testCases.length * formValues.marksPerCorrectTestCase;
                formValues.answers = [{
                    id: 1,
                    content: 'no-answer',
                    isCorrect: false
                }];
            }
            const newQuestionId = Questions.insert({
                ...formValues,
                fullMarks: fullMarks
            });

            return Questions.findOne(newQuestionId);
        } catch (e) {
            console.log(e);
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to create question');
        }
    },
});