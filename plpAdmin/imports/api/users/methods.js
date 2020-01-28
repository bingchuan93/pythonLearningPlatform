Meteor.methods({
	'Students.list'(params) {
		try {
			const { pageSize, page, filters, fields, sort } = params;
			if (!filters['role']) {
				// filters['roles.plp-admin'] = { $in: ['super-admin', 'admin'] };
				filters['role'] = 'user';
			}
			const students = Meteor.users
				.find(filters, { fields: fields, sort: sort, skip: page * pageSize, limit: pageSize })
				.fetch();
			const count = Meteor.users.find(filters).count();
			return { data: students, count: count };
		} catch (e) {
			if (e.reason) {
				throw new Meteor.Error(e.error, e.reason);
			}
			throw new Meteor.Error('error', 'Fail to list students');
		}
	},
	'Students.getById'(id) {
		try {
			return Meteor.users.findOne(id);
		} catch (e) {
			if (e.reason) {
				throw new Meteor.Error(e.error, e.reason);
			}
			throw new Meteor.Error('error', 'Fail to get student');
		}
	},
	'Students.archive'(id) {
		try {
			return Meteor.users.update(id, {
				$set: {
					isArchived: true
				}
			});
		} catch (e) {
			if (e.reason) {
				throw new Meteor.Error(e.error, e.reason);
			}
			throw new Meteor.Error('error', 'Fail to archive student');
		}
	},
	'Students.restore'(id) {
		try {
			return Meteor.users.update(id, {
				$set: {
					isArchived: false
				}
			});
		} catch (e) {
			if (e.reason) {
				throw new Meteor.Error(e.error, e.reason);
			}
			throw new Meteor.Error('error', 'Fail to restore student');
		}
	}
});

if (Meteor.isServer) {
	Accounts.validateLoginAttempt(attemptInfo => {
		if (attemptInfo.error) {
			return attemptInfo.error;
		} else if (attemptInfo.user.role != 'super-admin' && attemptInfo.user.role != 'admin') {
			return false;
		}
		return true;
	});
}
