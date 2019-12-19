const initialState = {
    fetchableTableForceFetchToggler: false,
};

const contentState = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'CONTENT/FETCHABLE_TABLE_FORCE_FETCH':
            return { ...state, fetchableTableForceFetchToggler: !state.fetchableTableForceFetchToggler };
    }
    return state;
};

export default contentState;