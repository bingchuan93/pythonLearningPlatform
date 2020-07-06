import { all, put, select, takeEvery } from 'redux-saga/effects';
import { push, replace } from 'connected-react-router';

function* watchCloseModal() {
	yield takeEvery('MODAL/CLOSE', function*({ payload = { doNotPushToPrevLocation: false } }) {
        const childModals = yield select(state => state.modalState.childModals);
		if (childModals.length > 0) {
			yield put({ type: 'MODAL/POP' });
		} else {
			let prevLocation = yield select(state => state.modalState.prevLocation);
			if (prevLocation && !payload.doNotPushToPrevLocation) {
				if (prevLocation.useReplace) {
					yield put(replace(prevLocation));
				} else {
					yield put(push(prevLocation));
				}
				if (prevLocation.title) {
					document.title = prevLocation.title;
				}
			}
			yield put({ type: 'MODAL/RESET' });
		}
	});
}

function* watchOpenModal() {
	yield takeEvery('MODAL/OPEN', function*({ payload }) {
        const modal = yield select(state => state.modalState.modal);
		if (modal) {
			yield put({ type: 'MODAL/PUSH', payload });
		} else {
			yield put({ type: 'MODAL/ROOT', payload });
		}
	});
}

export default function* modalSaga() {
	yield all([watchOpenModal(), watchCloseModal()]);
}
