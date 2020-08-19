const initialState = {
    isSideMenuOpen: false,
    assessmentMode: false,
    assessmentModeEndTime: null
};

const appState = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'SIDE_MENU/OPEN':
            return { ...state, isSideMenuOpen: !state.assessmentMode && true };
        case 'SIDE_MENU/CLOSE':
            return { ...state, isSideMenuOpen: !state.assessmentMode && false };
        case 'SIDE_MENU/SET':
            return { ...state, isSideMenuOpen: payload.isSideMenuOpen };
        case 'ASSESSMENT_MODE/ENTER':
            const endTime = new Date(new Date().getTime + (payload.duration * 60000));
            return { ...state, assessmentMode: true, isSideMenuOpen: false, assessmentModeEndTime: endTime };
        case 'ASSESSMENT_MODE/EXIT':
            return { ...state, assessmentMode: false, assessmentModeEndTime: null };
        default:
            return { ...initialState };
    }
    return state;
}

export default appState;