import { collections } from 'meteor/bingchuan:plp-collections';

const { Submissions, Questions, Assessments } = collections;

Meteor.methods({
    'Misc.testFlask'(params) {
        try {
            const submission = Submissions.findOne({ _id: new Mongo.ObjectID("d3c78adccd173a2fef234586") });
            const question = Questions.findOne({ _id: new Mongo.ObjectID('1b1ed6aed11e0265e196a87b')})
            const result = HTTP.call('POST', 'http://localhost:5000/testCode', {
                data: {
                    function: submission.answers['1b1ed6aed11e0265e196a87b'],
                    testCases: question.testCases
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(JSON.parse(result.content));
            return result;
        } catch (e) {
            console.log(e);
        }
    }
})