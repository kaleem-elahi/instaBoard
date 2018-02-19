import * as types from '../constants/ActionTypes';

const initialState = {
  accessTokenReceived: false,
};

export default(state = initialState, action) => {
  switch (action.type) {

    case types.ACCESS_TOKEN:
    return {
      ...state,
      accessTokenReceived : action.payload,
    };

    case types.SET_USER_SELF:
    return {
      ...state,
      userSelf: action.payload,
    };

    case types.SET_USER_RECENT_MEDIA:
    return {
      ...state,
      userRecentMedia: action.payload,
    };

    case types.SET_USERS_SEARCH:
      return {
        ...state,
        usersSearch: action.payload,
      };

    default:
      return state;
  }
};
