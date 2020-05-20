import { matchPath } from 'react-router';
import _ from 'lodash';
import moment from 'moment';
import constants from '/imports/constants';

const semesterDetails = [
	{
		// to shift to settings
		sem: 'one',
		date: {
			start: {
				day: 12,
				month: 8,
			},
			end: {
				day: 15,
				month: 11,
			},
		},
	},
	{
		sem: 'two',
		date: {
			start: {
				day: 13,
				month: 1,
			},
			end: {
				day: 17,
				month: 4,
			},
		},
	},
	{
		sem: 'special-term-1',
		date: {
			start: {
				day: 11,
				month: 5,
			},
			end: {
				day: 12,
				month: 6,
			},
		},
	},
	{
		sem: 'special-term-2',
		date: {
			start: {
				day: 22,
				month: 6,
			},
			end: {
				day: 24,
				month: 7,
			},
		},
	},
];

export const getSemOneDate = (semId) => {
	const semester = _.find(semesterDetails, (semesterDetail) => {
		return semesterDetail.sem == semId;
	});
	const startDate = moment().set({
		year: new Date().getFullYear(),
		month: semester.date.start.month - 1,
		date: semester.date.start.day,
	});

	const endDate = moment().set({
		year: new Date().getFullYear(),
		month: semester.date.end.month - 1,
		date: semester.date.end.day,
	});

	return {
		startDate,
		endDate,
	};
};

export const getRegRemoveSpecialChar = (value) => {
	return new RegExp('^.*' + value.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&') + '.*$', 'i');
};

export const composeSubscriptionFiltersFieldsSort = (columns, filtered, sorted) => {
	const filters = {};
	filtered.forEach((f) => {
		const searchAlgorithm = _.find(columns, function (o) {
			return o.id == f.id || o.accessor == f.id;
		}).searchAlgorithm;
		if (searchAlgorithm == 'text') {
			const inputArr = _.compact(f.value.toLowerCase().split(' '));
			filters.$text = { $search: '"' + inputArr.join('"') + '"' };
		} else if (searchAlgorithm == 'boolean') {
			if (f.value !== 'boolean-all') {
				filters[f.id] = f.value === 'true' ? true : false;
			}
		} else if (searchAlgorithm == 'number') {
			filters[f.id] = Number(f.value);
		} else if (searchAlgorithm == 'date') {
			if (f.value) {
				filters[f.id] = { $eq: new Date(f.value) };
			}
		} else if (searchAlgorithm == 'minDate') {
			if (f.value) {
				filters[f.id] = { $gte: new Date(f.value.setHours(0, 0, 0, 0)) };
			}
		} else if (searchAlgorithm == 'maxDate') {
			if (f.value) {
				filters[f.id] = { $lte: new Date(f.value.setHours(24, 0, 0, -1)) };
			}
		} else if (searchAlgorithm == 'string') {
			filters[f.id] = String(f.value);
		} else if (searchAlgorithm == 'regexp') {
			filters[f.id] = { $regex: new RegExp(f.value, 'i') };
		} else {
			filters[f.id] = { $regex: getRegRemoveSpecialChar(f.value) };
		}
	});
	let fields = {};
	if (filters.$text) {
		fields = {
			score: { $meta: 'textScore' },
		};
	}

	let sort = {};
	if (filters.$text) {
		sort = {
			score: { $meta: 'textScore' },
		};
	}

	if (sorted.length == 1) {
		sort[sorted[0].id] = sorted[0].desc ? -1 : 1;
	}
	return { filters, fields, sort };
};

export const getMatchedRoute = (route, matchingRoutes) => {
	for (var key in matchingRoutes) {
		const matched = matchPath(route, matchingRoutes[key]);
		if (matched) {
			return { ...matchingRoutes[key], matched };
		}
	}
	return false;
};

export const getSemesterTypeOptions = () => {
	const options = Object.keys(constants.semesterTypes).map((key) => {
		return {
			value: key,
			label: constants.semesterTypes[key],
		};
	});
	return options;
};

export const getAssessmentTypeOptions = () => {
	const options = Object.keys(constants.assessmentTypes).map((key) => {
		return {
			value: key,
			label: constants.assessmentTypes[key],
		};
	});
	return options;
};

export const getTutorialGroupOptions = (callback) => {
	Meteor.call('TutorialGroups.getAll', (error, result) => {
		const options = [];
		if (!error) {
			result.forEach((element) => {
				options.push({
					label: element.name,
					value: element._id.valueOf(),
				});
			});
			callback(options);
		}
	});
};

export const getFileExtension = (filename) => {
	return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
};

export const getStudentArrFromXLSXData = (rawXLSXStudentData) => {
	const students = [];
	rawXLSXStudentData.forEach((student) => {
		const studentObj = {};
		Object.keys(student).map((studentKey, key) => {
			if (Array.isArray(constants.excelStudentKeys[key])) {
				const classDataArr = student[studentKey].split(' ');
				classDataArr.map((classData, classDataKey) => {
					studentObj[constants.excelStudentKeys[key][classDataKey]] = classData;
				});
			} else {
				studentObj[constants.excelStudentKeys[key]] = student[studentKey];
			}
			if (constants.excelStudentKeys[key] == 'name') {
				const nameArr = student[studentKey].split(' ');
				const username = nameArr
					.map((word, wordKey) => {
						if (wordKey == 0) {
							return word + '.';
						} else {
							return word[0];
						}
					})
					.join('');
				studentObj['username'] = username;
			}
		});
		students.push(studentObj);
    });
    return students;
};
