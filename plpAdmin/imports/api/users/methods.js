import { collections } from 'meteor/bingchuan:plp-collections';
import constants from '/imports/constants';

const { TutorialGroups } = collections;

Meteor.methods({
	'Students.list'(params) {
		try {
			const { pageSize, page, filters, fields, sort } = params;
			if (!filters['role']) {
				// filters['roles.plp-admin'] = { $in: ['super-admin', 'admin'] };
				filters['role'] = 'user';
			}
			const students = Meteor.users.find(filters, { fields: fields, sort: sort, skip: page * pageSize, limit: pageSize }).fetch();
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
			const student = Meteor.users.findOne(id);
			student.profile.tutorialGroup = TutorialGroups.findOne(student.profile.tutorialGroupId);
			return student;
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
					isArchived: true,
				},
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
					isArchived: false,
				},
			});
		} catch (e) {
			if (e.reason) {
				throw new Meteor.Error(e.error, e.reason);
			}
			throw new Meteor.Error('error', 'Fail to restore student');
		}
	},
	'Students.import'(formValues) {
		try {
			const failedImports = [];
			formValues.students.forEach((student) => {
				let index = 1;
				let username = student.username;
				let existingStudent = null;
				do {
					existingStudent = Accounts.findUserByUsername(username);
					if (existingStudent) {
						username = username += index;
						index += 1;
					}
				} while (existingStudent);
				let assignedTutorialGroupId = TutorialGroups.findOne({ academicYear: formValues.academicYear, semester: formValues.semester, name: student.class })?._id;
				if (!assignedTutorialGroupId) {
					assignedTutorialGroupId = TutorialGroups.insert({
						name: student.class,
						academicYear: formValues.academicYear,
						semester: formValues.semester,
					});
				}
				try {
					Accounts.createUser({
						username,
						password: constants.defaultPassword,
						profile: {
							fullName: student.name,
							tutorialGroupId: assignedTutorialGroupId,
							nationality: student.nationality,
							studentType: student.studentType,
						},
					});
				} catch (e) {
					failedImports.push({
						...student,
						reason: error,
					});
				}
			});
			if (failedImports.length > 0) {
				return { success: false, data: failedImports };
			} else {
				return { success: true };
			}
		} catch (e) {
			if (e.reason) {
				throw new Meteor.Error(e.error, e.reason);
			}
			throw new Meteor.Error('error', 'Fail to import students');
		}
	},
});

if (Meteor.isServer) {
	Accounts.validateLoginAttempt((attemptInfo) => {
		if (attemptInfo.error) {
			return attemptInfo.error;
		} else if (attemptInfo.user.role != 'super-admin' && attemptInfo.user.role != 'admin') {
			return false;
		}
		return true;
	});
}
