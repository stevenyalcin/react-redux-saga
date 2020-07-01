import { all, call, put, takeEvery } from 'redux-saga/effects';
import {
  requestDog,
  requestDogError,
  requestDogSuccess
} from '../actions/actionCreators';
import { TYPES } from '../types';

function* helloSaga() {
  yield console.log('Hello Sagas!');
}

// Watcher saga takes the dispatched action and calls the worker saga (fetchDogAsync)
function* watchFetchDog() {
  yield takeEvery(TYPES.FETCHED_DOG, fetchDogAsync);
}

const delay = ms => new Promise(res => setTimeout(res, ms));

// Worker saga
export function* fetchDogAsync() {
  yield delay(1000);
  try {
    yield put(requestDog());
    const data = yield call(() => {
      return fetch('https://dog.ceo/api/breeds/image/random').then(res =>
        res.json()
      );
    });
    yield put(requestDogSuccess(data));
  } catch (error) {
    yield put(requestDogError());
  }
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([helloSaga(), watchFetchDog()]);
}
