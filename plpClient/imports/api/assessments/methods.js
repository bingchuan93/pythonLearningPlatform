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
    'Assessment.getQuizById' (id) {
        try {
            const quiz = Assessments.findOne({  _id: new Mongo.ObjectID(id), type: 'quiz' });
            if (quiz) {
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
    }
})