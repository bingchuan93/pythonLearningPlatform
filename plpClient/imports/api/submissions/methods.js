import _ from 'lodash';
import { collections } from 'meteor/bingchuan:plp-collections';

const { Submissions, Questions, Assessments } = collections;

Meteor.methods({
    'Submissions.submitQuiz'(quizId, submissions) {
        try {
            const student = Meteor.user();
            if (!student) {
                throw new Meteor.Error('error', 'Invalid Student');
            }
            const quiz = Assessments.findOne({ _id: new Mongo.ObjectID(quizId) });
            let marks = 0;
            if (quiz) {
                const relatedQuestions = Questions.find({ _id: { $in: quiz.questionIds } }).fetch();
                if (relatedQuestions.length > 0) {
                    Object.entries(submissions).forEach(([key, value]) => {
                        const relatedQuestion = _.find(relatedQuestions, { _id: new Mongo.ObjectID(key) });
                        if (relatedQuestion) {
                            const correctAnswerId = _.filter(relatedQuestion.answers, { isCorrect: true }).map((correctAnswer) => correctAnswer.id);
                            if (relatedQuestion.type != 'coding') {
                                if (relatedQuestion.type == 'multiple-choice-multi-answer') {
                                    value.forEach((submittedAnswer) => {
                                        if (correctAnswerId.includes(submittedAnswer)) {
                                            marks += relatedQuestion.marksPerCorrectAnswer;
                                        } else {
                                            marks -= relatedQuestion.marksPerCorrectAnswer;
                                        }
                                    });
                                } else {
                                    if (correctAnswerId.includes(value[0])) {
                                        marks += relatedQuestion.marksPerCorrectAnswer;
                                    }
                                }
                            }
                        }
                    })
                }
            }
            ['createdAt', 'services', 'passwordUpdatedAt', 'updatedAt', 'createdAt', 'isArchived'].forEach(key => delete student[key]);

            Submissions.insert({
                student: student,
                assessmentId: quiz._id,
                answers: submissions,
                marks: marks
            });
            return;
        } catch (e) {
            console.log(e);
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to submit quiz');
        }
    }
})