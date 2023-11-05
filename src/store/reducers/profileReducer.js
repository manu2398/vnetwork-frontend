import { getDataAPI, patchDataAPI } from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload";

import { ALERT } from "./alertReducer";
import { AUTH } from "./authReducer";
import { createNotify, removeNotify } from "./notifyReducer";

//actionTypes
export const PROFILETYPES = {
  LOADING: "LOADING",
  GET_PROFILE_USER: "GET_PROFILE_USER",
  FOLLOW: "FOLLOW",
  UNFOLLOW: "UNFOLLOW",
  GET_USERNAMES: "GET_USERNAMES",
  GET_PROFILE_POSTS: "GET_PROFILE_POSTS",
};

//actionCreators
export const getProfileUsers =
  ({ users, username, auth }) =>
  async (dispatch) => {
    dispatch({ type: PROFILETYPES.GET_USERNAMES, payload: username });

    try {
      dispatch({ type: PROFILETYPES.LOADING, payload: true });
      const res = getDataAPI(`get-user/${username}`, auth.user.access_token);

      const res1 = getDataAPI(
        `/user-posts/${username}`,
        auth.user.access_token
      );

      const users = await res;
      const posts = await res1;

      dispatch({ type: PROFILETYPES.GET_PROFILE_USER, payload: users.data });
      dispatch({
        type: PROFILETYPES.GET_PROFILE_POSTS,
        payload: { ...posts.data, page: 2, username },
      });

      dispatch({ type: PROFILETYPES.LOADING, payload: false });
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
      dispatch({ type: PROFILETYPES.LOADING, payload: false });
    }
  };

export const updateProfileUser =
  ({ userData, avatar, auth }) =>
  async (dispatch) => {
    if (!userData.fullname)
      return dispatch({
        type: ALERT,
        payload: { error: { msg: "Please enter your full name" } },
      });

    if (userData.fullname.length > 25)
      return dispatch({
        type: ALERT,
        payload: {
          error: { msg: "Maximum characters for name cannot exceed 25" },
        },
      });

    if (userData.bio && userData.bio.length > 100)
      return dispatch({
        type: ALERT,
        payload: {
          error: { msg: "Maximum characters for bio cannot exceed 100" },
        },
      });

    try {
      let media;

      dispatch({ type: ALERT, payload: { loading: true } });

      if (avatar) media = await imageUpload([avatar]);

      const res = await patchDataAPI(
        "user",
        {
          ...userData,
          avatar: avatar ? media[0].url : auth.user.avatar,
        },
        auth.token
      );

      dispatch({
        type: AUTH,
        payload: {
          ...auth,
          user: {
            ...auth.user,
            ...userData,
            avatar: avatar ? media[0].url : auth.user.avatar,
          },
        },
      });

      dispatch({ type: ALERT, payload: { loading: false } });
      dispatch({
        type: ALERT,
        payload: {
          success: true,
          msg: res.data.msg,
        },
      });
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

export const follow =
  ({ user, auth, socket }) =>
  async (dispatch) => {
    let newUser = { ...user, followers: [...user.followers, auth.user] };
    dispatch({ type: PROFILETYPES.FOLLOW, payload: newUser });

    let authUser = {
      ...auth.user,
      following: [...auth.user.following, newUser],
    };
    dispatch({ type: AUTH, payload: { user: authUser } });

    try {
      await patchDataAPI(`user/follow/${user.username}`, null, auth.token);

      // notify
      const msg = {
        id: auth.user._id,
        text: "Followed you",
        recepients: [newUser._id],
        url: `/profile/${auth.user.username}`,
      };

      dispatch(createNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({
        type: ALERT,
        payload: { error: err.response.data },
      });
    }
  };

export const unFollow =
  ({ user, auth, socket }) =>
  async (dispatch) => {
    let newUser = {
      ...user,
      followers: user.followers.filter((user) => user._id !== auth.user._id),
    };
    dispatch({ type: PROFILETYPES.UNFOLLOW, payload: newUser });

    let authUser = {
      ...auth.user,
      following: [...auth.user.following].filter(
        (item) => item._id !== newUser._id
      ),
    };
    dispatch({ type: AUTH, payload: { user: authUser } });

    try {
      await patchDataAPI(`user/un-follow/${user.username}`, null, auth.token);

      // notify
      const msg = {
        id: auth.user._id,
        text: "Followed you",
        recepients: [newUser._id],
        url: `/profile/${auth.user.username}`,
      };

      dispatch(removeNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({
        type: ALERT,
        payload: { error: err.response.data },
      });
    }
  };

// reducer
const initialState = {
  loading: false,
  users: [],
  posts: [],
  usernames: [],
};

export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFILETYPES.LOADING:
      return { ...state, loading: action.payload };
    case PROFILETYPES.GET_PROFILE_USER:
      return {
        ...state,
        users: [...state.users, action.payload.user[0]],
      };
    case PROFILETYPES.FOLLOW:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
      };
    case PROFILETYPES.UNFOLLOW:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
      };

    case PROFILETYPES.GET_USERNAMES:
      return {
        ...state,
        usernames: [...state.usernames, action.payload],
      };
    case PROFILETYPES.GET_PROFILE_POSTS:
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    default:
      return state;
  }
};
