import axios from 'axios';
import { setAlert } from './alertAction';
import { clearProfile } from './profileActions';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
} from './types';

//register user

export const register = ({ name, email, password }) => async (dispatch) => {
  //Headers

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Request body

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, 'danger'));
      });
    }

    dispatch({ type: REGISTER_FAIL });
  }
};

//login user

export const login = ({ email, password }) => async (dispatch) => {
  //Headers

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Request body

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, 'danger'));
      });
    }

    dispatch({ type: LOGIN_FAIL });
  }
};

// check token & load user

export const loadUser = () => async (dispatch, getState) => {
  // user loading

  try {
    const res = await axios.get('/api/auth/user', tokenConfig(getState));

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Logout

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT_SUCCESS });

  dispatch(clearProfile());
};

// setup config/headers and token

export const tokenConfig = (getState) => {
  //get token from local storage

  const token = getState().auth.token;

  //Headers

  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  // If token add to headers

  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
};
