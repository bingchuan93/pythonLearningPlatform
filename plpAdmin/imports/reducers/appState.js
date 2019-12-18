const initialState = {
    isSideMenuOpen: false,
};

const appState = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'SIDE_MENU/OPEN':
            return { ...state, isSideMenuOpen: true };
        case 'SIDE_MENU/CLOSE':
            return { ...state, isSideMenuOpen: false };
        case 'SIDE_MENU/SET':
            return { ...state, isSideMenuOpen: payload.isSideMenuOpen };
        default:
            return { ...initialState };
    }
    return state;
}

export default appState;