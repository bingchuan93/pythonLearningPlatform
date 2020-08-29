import _ from 'lodash';
import moment from 'moment';
import { collections } from 'meteor/bingchuan:plp-collections';
import { getTotalMarks } from '/imports/util';

const { Assessments, Questions, Submissions } = collections;

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
                const relatedSubmissions = Submissions.find({ assessmentId: assessment._id, 'student._id': user._id }).fetch();
                assessment.fullMarks = getTotalMarks(relatedQuestions);
                assessment.prevAttempts = relatedSubmissions;
            })
            const ongoingQuizzes = _.remove(assessments, (assessment) => {
                return moment(assessment.startDate).isSame(new Date(), 'day') || (assessment.startDate < new Date());
            });
            return {
                ongoingQuizzes,
                upcomingQuizzes: assessments
            };
        } catch (e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to get related assessments');
        }
    },
    'Assessment.getStartableQuizById' (id) {
        try {
            const quiz = Assessments.findOne({  _id: new Mongo.ObjectID(id), type: 'quiz' });
            if (quiz) {
                if (quiz.attempts > 0) {
                    const prevSubmissions = Submissions.find({ assessmentId: quiz._id, 'student._id': Meteor.userId() }).fetch();
                    if (prevSubmissions.length >= quiz.attempts) {
                        throw new Meteor.Error('error', 'Max attempts reached');
                    }
                }
                const relatedQuestions = Questions.find({ _id: { $in: quiz.questionIds } }).fetch();
                if (relatedQuestions.length == quiz.questionIds.length) {
                    relatedQuestions.forEach((question) => {
                        question.answers.forEach((answer) => {
                            delete answer.isCorrect;
                        });
                    });
                    quiz.questions = relatedQuestions;
                    return quiz;
                } else {
                    throw new Meteor.Error('error', 'Invalid Quiz');
                }
            } else {
                throw new Meteor.Error('error', 'Invalid Quiz');
            }
        } catch (e) {
            console.log(e);
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to get quiz by id');
        }
    },
})