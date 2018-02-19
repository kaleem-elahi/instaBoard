import * as types from '../constants/ActionTypes';




export const  setAccessToken = (data) => {
  return dispatch => {
    dispatch({
      type: types.ACCESS_TOKEN,
      payload: data
    })
  };
};

export const  setUserSelfAction = (data) => {
  return dispatch => {
    dispatch({
      type: types.SET_USER_SELF,
      payload: data
    })
  };
};

export const  setUserRecentMediaAction = (data) => {
  return dispatch => {
    dispatch({
      type: types.SET_USER_RECENT_MEDIA,
      payload: data
    })
  };
};


export const  setUsersSearchAction = (data) => {
  return dispatch => {
    dispatch({
      type: types.SET_USERS_SEARCH,
      payload: data
    })
  };
};
