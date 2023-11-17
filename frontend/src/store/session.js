import { csrfFetch } from './csrf';

const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';

export const actionSetUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  }
}

export const actionRemoveUser = () => {
  return {
    type: REMOVE_USER
  }
}

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password
    })
  });
  const data = await response.json();
  dispatch(actionSetUser(data.user));
  return response;
};

const initialState = { user: null }

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER: {
      return { ...state, user: action.payload };
    }
    case REMOVE_USER: {
      return { ...state, user: null };
    }
    default:
      return state;
  }
}

export default sessionReducer;
