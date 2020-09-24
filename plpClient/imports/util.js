import { matchPath } from 'react-router-dom';

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

export const getTotalMarks = (questions) => {
    return questions.reduce((accumulator, currentValue) => {
        if (currentValue.type != 'coding') {
            currentValue.answers.forEach((answer) => {
                if (answer.isCorrect) {
                    accumulator += currentValue.marksPerCorrectAnswer;
                }
            });
        } else {
            accumulator += currentValue.testCases.length * currentValue.marksPerCorrectTestCase;
        }
        return accumulator;
    }, 0);
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
