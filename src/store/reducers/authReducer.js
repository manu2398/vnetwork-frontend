import { postDataAPI } from "../../utils/fetchData";
import { ALERT } from "./alertReducer";

//actionTypes
export const AUTH = "AUTH";

//actionCreators
export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: ALERT, payload: { loading: true } });
    const res = await postDataAPI("login", data);
    dispatch({
      type: AUTH,
      payload: { user: res.data },
    });

    localStorage.setItem("firstLogin", true);
    localStorage.setItem("token", JSON.stringify(res.data.access_token));

    dispatch({
      type: ALERT,
      payload: {
        success: true,
        msg: "Login Successfull",
      },
    });
  } catch (err) {
    dispatch({ type: ALERT, payload: { error: err.response.data } });
  }
};

export const register = (data) => async (dispatch) => {
  try {
    dispatch({ type: ALERT, payload: { loading: true } });
    const res = await postDataAPI("register", data);
    dispatch({
      type: AUTH,
      payload: { user: res.data },
    });
    localStorage.setItem("firstLogin", true);
    localStorage.setItem("token", JSON.stringify(res.data.access_token));

    dispatch({
      type: ALERT,
      payload: {
        success: true,
        msg: "Register Successfull",
      },
    });
  } catch (err) {
    dispatch({ type: ALERT, payload: { error: err.response.data } });
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: ALERT, payload: { loading: true } });
    localStorage.removeItem("firstLogin");
    localStorage.removeItem("token");
    await postDataAPI("logout");

    dispatch({
      type: ALERT,
      payload: {
        success: true,
        msg: "Logged out successfully",
      },
    });
    window.location.href = "/";
  } catch (err) {
    dispatch({ type: ALERT, payload: { error: err.response.data } });
  }
};

export const refreshToken = () => async (dispatch) => {
  const firstLogin = localStorage.getItem("firstLogin");

  if (firstLogin) {
    const token = JSON.parse(localStorage.getItem("token"));
    console.log("mytoooo", token);
    dispatch({ type: ALERT, payload: { loading: true } });
    try {
      const res = await postDataAPI("refreshtoken", null, token);
      dispatch({
        type: AUTH,
        payload: { user: res.data },
      });
      dispatch({ type: ALERT, payload: {} });
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  }
};

// reducer
const initialState = {};
export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH:
      return action.payload;
    default:
      return state;
  }
};
