const initialState = {
    alertProps: null,
    isOpened: false, 
};

const alertState = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'ALERT/OPEN':
            return {
                ...state,
                alertProps: payload.alertProps || null,
                isOpened: true,
            };
        case 'ALERT/CLOSE':
            return { ...initialState };
    }
    return state;
};

export default alertState;
