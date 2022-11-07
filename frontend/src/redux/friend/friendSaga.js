import { put, takeLatest, call, fork } from 'redux-saga/effects';
import { axiosInStanceJWT } from '../axiosJWT';
import api from '../../common/environment/environment';
import { paging } from '../../common/environment/environment';
import {
  acceptFailed,
  acceptSaga,
  acceptSagaSuccess,
  acceptStart,
  acceptSuccess,
  addFriendFailed,
  addFriendSaga,
  addFriendSagaSuccess,
  addFriendStart,
  addFriendSuccess,
  denyFailed,
  denySaga,
  denySagaSuccess,
  denyStart,
  denySuccess,
  getAllFriendForMainUserSuccess,
  getRequestSuccess,
  unfriendFailed,
  unfriendSaga,
  unfriendSagaSuccess,
  unfriendStart,
  unfriendSuccess,
} from './friendSlice';
import { getFriendSuggestionSuccess } from '../profile/profileSlice';
import { notifyService } from '../../services/notifyService';

// #region friend requests
export function* refreshFriendRequest() {
  yield takeLatest(
    [acceptSagaSuccess.type, denySagaSuccess.type],
    handleRefreshRequestSaga
  );
}
function* handleRefreshRequestSaga(data) {
  try {
    const getAll = yield call(getAllRequestSaga, data);
    yield put(getRequestSuccess(getAll.data));
  } catch (error) {
    console.log(error);
  }
}
async function getAllRequestSaga(data) {
  const { accessToken, refreshToken } = data.payload;
  try {
    const res = await axiosInStanceJWT.post(
      `${api.friend}/request/all`,
      paging,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        ACCESS_PARAM: accessToken,
        REFRESH_PARAM: refreshToken,
      }
    );
    if (!res.data.message) {
      return res;
    } else {
    }
  } catch (error) {
    console.log(error);
  }
}

export function* acceptFriendReq() {
  yield takeLatest(acceptSaga.type, handleAcceptFriend);
}
function* handleAcceptFriend(data) {
  try {
    const accept = yield call(acceptSagaRequest, data);
    yield put(acceptSuccess(accept.data));
  } catch (error) {
    console.log(error);
  }
}
async function acceptSagaRequest(data) {
  const { accessToken, refreshToken, id, dispatch } = data.payload;
  //   dispatch(acceptStart());
  try {
    const res = await axiosInStanceJWT.post(
      `${api.friend}/acceptFriendRequest/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        ACCESS_PARAM: accessToken,
        REFRESH_PARAM: refreshToken,
      }
    );
    if (!res.data.message) {
      dispatch(acceptSagaSuccess({ accessToken, refreshToken }));
      return res;
    } else {
      dispatch(acceptFailed());
    }
  } catch (error) {
    dispatch(acceptFailed());
  }
}

export function* denyFriendReq() {
  yield takeLatest(denySaga.type, handleDenyFriend);
}
function* handleDenyFriend(data) {
  try {
    const deny = yield call(denySagaRequest, data);
    yield put(denySuccess(deny.data));
  } catch (error) {
    console.log(error);
  }
}
async function denySagaRequest(data) {
  const { accessToken, refreshToken, id, dispatch } = data.payload;
  // dispatch(denyStart());
  try {
    const res = await axiosInStanceJWT.post(
      `${api.friend}/denyFriendRequest/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        ACCESS_PARAM: accessToken,
        REFRESH_PARAM: refreshToken,
      }
    );
    if (!res.data.message) {
      dispatch(denySagaSuccess({ accessToken, refreshToken }));
      return res;
    } else {
      dispatch(denyFailed());
    }
  } catch (error) {
    dispatch(denyFailed());
  }
}
// #endregion

// #region get all friends
export function* refreshAllFriend() {
  yield takeLatest([unfriendSagaSuccess.type], handleRefreshAllSaga);
}
function* handleRefreshAllSaga(data) {
  try {
    const getAll = yield call(getAllSaga, data);
    yield put(getAllFriendForMainUserSuccess(getAll.data));
  } catch (error) {
    console.log(error);
  }
}
async function getAllSaga(data) {
  const { accessToken, refreshToken, id } = data.payload;
  try {
    const res = await axiosInStanceJWT.post(
      `${api.friend}/all/${id}`,
      paging,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        ACCESS_PARAM: accessToken,
        REFRESH_PARAM: refreshToken,
      }
    );
    if (!res.data.message) {
      return res;
    } else {
    }
  } catch (error) {
    console.log(error);
  }
}

export function* unfriend() {
  yield takeLatest(unfriendSaga.type, handleUnfriend);
}
function* handleUnfriend(data) {
  try {
    const unf = yield call(unfriendSagaRequest, data);
    yield put(unfriendSuccess(unf.data));
  } catch (error) {
    console.log(error);
  }
}
async function unfriendSagaRequest(data) {
  const { accessToken, refreshToken, id, dispatch } = data.payload;
  //   dispatch(unfriendStart());
  try {
    const res = await axiosInStanceJWT.post(
      `${api.friend}/unfriend/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        ACCESS_PARAM: accessToken,
        REFRESH_PARAM: refreshToken,
      }
    );
    if (!res.data.message) {
      dispatch(
        unfriendSagaSuccess({ accessToken, refreshToken, id })
      );
      return res;
    } else {
      dispatch(unfriendFailed());
    }
  } catch (error) {
    dispatch(unfriendFailed());
  }
}
// #endregion

// #region friend suggestions
export function* refreshFriendSuggestion() {
  yield takeLatest(
    [addFriendSagaSuccess.type],
    handleRefreshSuggestionSaga
  );
}
function* handleRefreshSuggestionSaga(data) {
  try {
    const getAll = yield call(getAllSuggestionSaga, data);
    yield put(getFriendSuggestionSuccess(getAll.data));
  } catch (error) {
    console.log(error);
  }
}
async function getAllSuggestionSaga(data) {
  const { accessToken, refreshToken } = data.payload;
  try {
    const res = await axiosInStanceJWT.post(
      `${api.profile}/friendSuggestion`,
      paging,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        ACCESS_PARAM: accessToken,
        REFRESH_PARAM: refreshToken,
      }
    );
    if (!res.data.message) {
      return res;
    } else {
    }
  } catch (error) {
    console.log(error);
  }
}

export function* addFriend() {
  yield takeLatest(addFriendSaga.type, handleAddFriend);
}
function* handleAddFriend(data) {
  try {
    const unf = yield call(addFriendSagaRequest, data);
    yield put(addFriendSuccess(unf.data));
  } catch (error) {
    console.log(error);
  }
}
async function addFriendSagaRequest(data) {
  const { accessToken, refreshToken, id, dispatch } = data.payload;
  // dispatch(addFriendStart());
  try {
    const res = await axiosInStanceJWT.post(
      `${api.friend}/sendFriendRequest/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        ACCESS_PARAM: accessToken,
        REFRESH_PARAM: refreshToken,
      }
    );
    if (!res.data.message) {
      dispatch(
        addFriendSagaSuccess({ accessToken, refreshToken, id })
      );
      notifyService.showSuccess("Add Friend Successfully")
      return res;
    } else {
      dispatch(addFriendFailed());
    }
  } catch (error) {
    dispatch(addFriendFailed());
  }
}
// #endregion
