import { collections } from 'meteor/bingchuan:plp-collections';

const { Assessments } = collections;

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
			return Assessments.findOne(_id);
		} catch (e) {
			if (e.reason) {
				throw new Meteor.Error(e.error, e.reason);
			}
			throw new Meteor.Error('error', 'Fail to get assessment');
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
	}
});
