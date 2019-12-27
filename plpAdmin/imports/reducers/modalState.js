const initialState = {
    modal: null,
    modalProps: {},
    prevLocation: null,
};

const modalState = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'MODAL/OPEN':
            return {
                ...state,
                modal: payload.modal,
                modalProps: payload.modalProps || {},
                prevLocation: payload.prevLocation,
            };
        case 'MODAL/RESET':
            return { ...initialState };
        case 'MODAL/SET_PREV_LOCATION':
            return { ...state, prevLocation: payload.prevLocation };
    }
    return state;
};

export default modalState;
