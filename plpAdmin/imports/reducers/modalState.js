import _ from 'lodash';

const initialState = {
	modal: null,
	modalProps: {},
	prevLocation: null,
	childModals: [],
};

const modalState = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case 'MODAL/ROOT':
			return {
				...state,
				modal: payload.modal,
				modalProps: payload.modalProps || {},
				prevLocation: payload.prevLocation || null,
				childModals: [],
			};
		case 'MODAL/RESET':
			return { ...initialState };
		case 'MODAL/SET_PREV_LOCATION':
			return { ...state, prevLocation: payload.prevLocation };
		case 'MODAL/PUSH':
			return {
				...state,
				childModals: [
					...state.childModals,
					{
						modal: payload.modal,
						modalProps: payload.modalProps || {},
					},
				],
			};
		case 'MODAL/POP':
			const childModals = [...state.childModals];
			childModals.pop();
			return { ...state, childModals: [...childModals] };
	}
	return state;
};

export default modalState;
