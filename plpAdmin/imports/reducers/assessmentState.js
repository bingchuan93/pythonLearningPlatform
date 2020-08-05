import _ from 'lodash';

const initialState = {
    questionIds: [],
};

const assessmentState = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'ASSESSMENT/ADD_QUESTION':
            const clonedQuestionIds = _.cloneDeep(state.questionIds);
            clonedQuestionIds.push(payload.questionId);
            return {
                ...state,
                questionIds: clonedQuestionIds,
            };
        case 'ASSESSMENT/REST':
            return { ...initialState };
    }
    return state;
};

export default assessmentState;
