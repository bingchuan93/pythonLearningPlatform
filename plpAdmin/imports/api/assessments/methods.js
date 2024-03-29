import { collections } from 'meteor/bingchuan:plp-collections';

const { Assessments, TutorialGroups, Questions } = collections;

Meteor.methods({
	'Assessments.list'(params) {
		try {
			const { pageSize, page, filters, fields, sort } = params;
			const assessments = Assessments.find(filters, {
				fields: fields,
				sort: sort,
				skip: page * pageSize,
				limit: pageSize
			}).fetch();
			const count = Assessments.find(filters).count();
			return { data: assessments, count: count };
		} catch (e) {
			if (e.reason) {
				throw new Meteor.Error(e.error, e.reason);
			}
			throw new Meteor.Error('error', 'Fail to list assessments');
		}
	},
	'Assessments.getById'(_id) {
		try {
			const assessment = Assessments.findOne(_id);
			if (assessment) {
				const relatedTutorialGroups = TutorialGroups.find({ _id: { $in: assessment.participatingTutorialGroupIds } }).fetch();
				const relatedQuestions = Questions.find({  _id: { $in: assessment.questionIds } }).fetch();
				return { ...assessment, participatingTutorialGroups: relatedTutorialGroups, questions: relatedQuestions };
			}
		} catch (e) {
			if (e.reason) {
				throw new Meteor.Error(e.error, e.reason);
			}
			throw new Meteor.Error('error', 'Fail to get assessment by id');
		}
	},
	'Assessments.archive'(_id) {
		try {
			return Assessments.update(_id, { $set: {
                isArchived: true
            } });
		} catch (e) {
			if (e.reason) {
				throw new Meteor.Error(e.error, e.reason);
			}
			throw new Meteor.Error('error', 'Fail to archive assessment');
		}
	},
	'Assessments.restore'(_id) {
		try {
			return Assessments.update(_id, { $set: {
                isArchived: false
            } });
		} catch (e) {
			if (e.reason) {
				throw new Meteor.Error(e.error, e.reason);
			}
			throw new Meteor.Error('error', 'Fail to restore assessment');
		}
	},
	'Assessments.create'(formValues) {
		try {
			formValues.participatingTutorialGroupIds = formValues.participatingTutorialGroups.map((participatingTutorialGroup) => participatingTutorialGroup._id);
			formValues.questionIds = formValues.questions.map((question) => question._id);
			return Assessments.insert(formValues);
		} catch (e) {
			if (e.reason) {
				throw new Meteor.Error(e.error, e.reason);
			}
			throw new Meteor.Error('error', 'Fail to create assessment');
		}
	},
	'Assessments.update'(id, formValues) {
		try {
			formValues.participatingTutorialGroupIds = formValues.participatingTutorialGroups.map((participatingTutorialGroup) => participatingTutorialGroup._id);
			formValues.questionIds = formValues.questions.map((question) => question._id);
			return Assessments.update(new Mongo.ObjectID(id), { $set: { ...formValues } });
		} catch (e) {
			if (e.reason) {
				throw new Meteor.Error(e.error, e.reason);
			}
			throw new Meteor.Error('error', 'Fail to update assessment');
		}
	}
});
