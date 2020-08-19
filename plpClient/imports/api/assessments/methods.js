import _ from 'lodash';
import moment from 'moment';
import { collections } from 'meteor/bingchuan:plp-collections';
import { getTotalMarks } from '/imports/util';

const { Assessments, Questions } = collections;

Meteor.methods({
    'Assessments.getRelatedQuizzes'() {
        try {
            const user = Meteor.user();
            if (!user) {
                throw new Meteor.Error('error', 'Invalid user');
            }
            const assessments = Assessments.find({ type: 'quiz', endDate: { $gt: new Date() }, participatingTutorialGroupIds: user.profile.tutorialGroupId }).fetch();
            assessments.forEach((assessment) => {
                const relatedQuestions = Questions.find({ _id: { $in: assessment.questionIds } }).fetch();
                assessment.fullMarks = getTotalMarks(relatedQuestions);
            })
            const ongoingAssessments = _.remove(assessments, (assessment) => {
                return moment(assessment.startDate).isSame(new Date(), 'day') || assessments.startDate < new Date();
            })
            return {
                ongoingAssessments,
                upcomingAssessments: assessments
            };
        } catch (e) {
            console.log(e);
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to get related assessments');
        }
    },
})