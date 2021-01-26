import {
  GET_PROFILE,
  PROFILE_FAIL,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  GET_PROFILES,
  GET_REPOS,
} from './types';

import axios from 'axios';
import { setAlert } from './alertAction';

// GET CURRENT PROFILE

export const getCurrentProfile = () => async (dispatch, getState) => {
  try {
    const res = await axios.get('api/profile/me', tokenConfig(getState));

    dispatch({
      type: GET_PROFILE,

      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_FAIL,
      payload: { msg: err.response.statusText, error: err.response.status },
    });
  }
};

// GET ALL PROFILES

export const getAllProfiles = () => async (dispatch) => {
  dispatch(clearProfile());
  try {
    const res = await axios.get('api/profile');

    dispatch({
      type: GET_PROFILES,

      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_FAIL,
      payload: { msg: err.message.statusText, error: err.message.status },
    });
  }
};

// GET PROFILE by ID

export const getProfileByID = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,

      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_FAIL,
      payload: { msg: err.response.statusText, error: err.response.status },
    });
  }
};

// GET github REPOS
export const getGithubRepos = (githubUserName) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/github/${githubUserName}`);

    dispatch({
      type: GET_REPOS,

      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_FAIL,
      payload: { msg: err.response.statusText, error: err.response.status },
    });
  }
};

// create or edit a profile

export const createProfile = (formData, edit = false) => async (
  dispatch,
  getState
) => {
  try {
    const res = await axios.post(
      'api/profile',
      formData,
      tokenConfig(getState)
    );

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    dispatch(
      setAlert(edit ? 'Profile updated' : 'Profile created', 'success', 10000)
    );
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, 'danger'));
      });

      dispatch({
        type: PROFILE_FAIL,
        payload: { msg: err.response.statusText, error: err.response.status },
      });
    }
  }
};

// Add an experience

export const addExperience = (experienceData, history) => async (
  dispatch,
  getState
) => {
  try {
    const res = await axios.put(
      'api/profile/experience',
      experienceData,
      tokenConfig(getState)
    );

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    history.push('/dashboard');
    dispatch(setAlert('Experience added', 'success', 5000));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, 'danger'));
      });

      dispatch({
        type: PROFILE_FAIL,
        payload: { msg: err.response.statusText, error: err.response.status },
      });
    }
  }
};

// Add Education

export const addEducation = (educationData, history) => async (
  dispatch,
  getState
) => {
  try {
    const res = await axios.put(
      'api/profile/education',
      educationData,
      tokenConfig(getState)
    );

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    history.push('/dashboard');
    dispatch(setAlert('Education added', 'success', 5000));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, 'danger'));
      });

      dispatch({
        type: PROFILE_FAIL,
        payload: { msg: err.response.statusText, error: err.response.status },
      });
    }
  }
};

//delete experience

export const deleteExperience = (id) => async (dispatch, getState) => {
  try {
    const res = await axios.delete(
      `api/profile/experience/${id}`,
      tokenConfig(getState)
    );
    console.log(id);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert('Experience removed', 'success', 6000));
  } catch (err) {
    dispatch({
      type: PROFILE_FAIL,
      payload: { msg: err.response.statusText, error: err.response.status },
    });
  }
};

//delete education

export const deleteEducation = (id) => async (dispatch, getState) => {
  try {
    const res = await axios.delete(
      `api/profile/education/${id}`,
      tokenConfig(getState)
    );

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert('Education removed', 'success', 6000));
  } catch (err) {
    dispatch({
      type: PROFILE_FAIL,
      payload: { msg: err.message.statusText, error: err.message.status },
    });
  }
};

// delete acount & profile

export const deleteAcount = () => async (dispatch, getState) => {
  if (window.confirm('are you sure to delete your account ?')) {
    try {
      await axios.delete('api/profile', tokenConfig(getState));

      dispatch(clearProfile());
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(setAlert('your account has been deleted'));
    } catch (err) {
      dispatch({
        type: PROFILE_FAIL,
        payload: { msg: err.message.statusText, error: err.message.status },
      });
    }
  }
};

// Clear the profile

export const clearProfile = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
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
