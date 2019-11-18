const initialState = {
    user: null
};

const userState = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'USER/SET':
            return { ...state, user: payload.user };
        case 'USER/RESET':
            return { ...initialState };
    }
    return state;
}

export default userState;