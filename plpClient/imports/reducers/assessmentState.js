const initialState = {
    endTime: null
};

const assessmentState = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'ASSESSMENT_MODE/START':
            const endTime = new Date((new Date()).getTime() + (payload.duration * 60000));
            return { ...state, endTime: endTime };
        case 'ASSESSMENT_MODE/EXIT':
            return { ...state, endTime: null };
        default:
            return { ...initialState };
    }
    return state;
}

export default assessmentState;