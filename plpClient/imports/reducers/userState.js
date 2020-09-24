import _ from 'lodash';

const initialState = {
    user: null,
    assessmentEndTime: null,
    assessmentSubmission: null,
};

const userState = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'USER/SET':
            return { ...state, user: payload.user };
        case 'USER/RESET':
            Meteor.logout();
            return { ...initialState };
        case 'ASSESSMENT_MODE/START':
            const endTime = new Date((new Date()).getTime() + (payload.duration * 60000));
            return { ...state, assessmentEndTime: endTime, assessmentSubmission: { quizId: payload.quizId, submittedAnswers: {} } };
        case 'ASSESSMENT_MODE/EXIT':
            return { ...state, assessmentEndTime: null, assessmentSubmission: null };
        case 'ASSESSMENT/ANSWER':
            const clonedAnswers = _.cloneDeep(state.assessmentSubmission.submittedAnswers);
            clonedAnswers[payload.questionId] = payload.answers;
            return { ...state, assessmentSubmission: { ...state.assessmentSubmission, submittedAnswers: clonedAnswers}}
    }
    return state;
}

export default userState;