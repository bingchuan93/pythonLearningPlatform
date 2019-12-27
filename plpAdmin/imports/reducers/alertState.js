const initialState = {
    alertProps: null,
};

const alertState = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'ALERT/OPEN':
            return {
                ...state,
                alertProps: payload.alertProps || null,
            };
        case 'ALERT/CLOSE':
            return { ...initialState };
    }
    return state;
};

export default alertState;
