import constants from '/imports/constants';

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
	},
	'Students.import'(students) {
		try {
			students.forEach((student) => {
				const studentObj = {};
				Object.keys(student).map((studentKey, key) => {
					if (Array.isArray(constants.excelStudentKeys[key])) {
						const classDataArr = student[studentKey].split(' ');
						classDataArr.map((classData, classDataKey) => {
							studentObj[constants.excelStudentKeys[key][classDataKey]] = classData;
						})
					} else {
						studentObj[constants.excelStudentKeys[key]] = student[studentKey];
					}
					if (constants.excelStudentKeys[key] == 'name') {
						const nameArr = student[studentKey].split(' ');
						const username = nameArr.map((word, wordKey) => {
							if (wordKey == 0) {
								return word + '.';
							} else {
								return word[0];
							}
						}).join('');
						studentObj['username'] = username;
					}
				});
				Accounts.createUser({ username: studentObj.username, password: constants.defaultPassword, profile: {} }, (error) => {
					console.log(error);
					// to check for error when having same username
				})
			})
		} catch (e) {
			if (e.reason) {
				throw new Meteor.Error(e.error, e.reason);
			}
			throw new Meteor.Error('error', 'Fail to import students');
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
