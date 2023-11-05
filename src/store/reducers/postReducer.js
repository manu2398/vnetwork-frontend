import { imageUpload } from "../../utils/imageUpload";
import {
  getDataAPI,
  postDataAPI,
  patchDataAPI,
  deleteDataAPI,
} from "../../utils/fetchData";

import { ALERT } from "./alertReducer";
import { EditData } from "./globalTypes";

import { createNotify, removeNotify } from "./notifyReducer";

//actionTypes
export const POST_TYPES = {
  LOADING_POST: "LOADING_POST",
  CREATE_POST: "CREATE_POST",
  GET_POST: "GET_POST",
  GET_POSTS: "GET_POSTS",
  UPDATE_POST: "UPDATE_POST",
  LIKE_POST: "LIKE_POST",
  UNLIKE_POST: "UNLIKE_POST",
  DELETE_POST: "DELETE_POST",
};

//action Types
export const createPost =
  ({ content, link, alias, images, auth, socket }) =>
  async (dispatch) => {
    let media = [];

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      if (images.length > 0) {
        media = await imageUpload(images);
      }

      const res = await postDataAPI(
        "posts",
        { content, alias, link, images: media },
        auth.token
      );

      dispatch({ type: POST_TYPES.CREATE_POST, payload: res.data.newPost });
      dispatch({
        type: ALERT,
        payload: { success: true, msg: "Posted Successfully" },
      });

      //notify
      const msg = {
        id: res.data.newPost._id,
        text: "Added a new post",
        recepients: res.data.newPost.user.followers,
        url: `/post/${res.data.newPost._id}`,
        content,
        image: media[0].url,
      };
      dispatch(createNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

export const getPosts = (token) => async (dispatch) => {
  try {
    dispatch({ type: POST_TYPES.LOADING_POST, payload: true });
    const res = await getDataAPI("posts", token);
    dispatch({ type: POST_TYPES.GET_POSTS, payload: res.data });
    dispatch({ type: POST_TYPES.LOADING_POST, payload: false });
  } catch (err) {
    dispatch({ type: ALERT, payload: { error: err.response.data } });
  }
};

export const updatePost =
  ({ content, link, alias, images, auth, status }) =>
  async (dispatch) => {
    let media = [];

    let oldImages = images.filter((img) => img.url);
    let newImages = images.filter((img) => !img.url);

    if (
      content === status.content &&
      newImages.length === 0 &&
      oldImages.length === status.images.length &&
      alias === status.alias &&
      link === status.link
    )
      return;

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      if (newImages.length > 0) {
        media = await imageUpload(newImages);
      }

      const res = await patchDataAPI(
        `posts/${status._id}`,
        { content, alias, link, images: [...oldImages, ...media] },
        auth.token
      );

      dispatch({ type: POST_TYPES.UPDATE_POST, payload: res.data.newPost });
      dispatch({
        type: ALERT,
        payload: { success: true, msg: "Post Updated Successfully" },
      });
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

export const likePost =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    const newPost = { ...post, likes: [...post.likes, auth.user] };
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    socket.emit("likePost", newPost);

    const msg = {
      id: auth.user._id,
      text: "Liked your post",
      recepients: [newPost.user._id],
      url: `/post/${newPost._id}`,
      content: newPost.content,
      image: newPost.images[0].url,
    };

    dispatch(createNotify({ msg, auth, socket }));

    try {
      await patchDataAPI(`posts-like/${post._id}`, null, auth.token);
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

export const unLikePost =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    const newPost = {
      ...post,
      likes: [...post.likes].filter((user) => user._id !== auth.user._id),
    };
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    socket.emit("unlikePost", newPost);

    try {
      await patchDataAPI(`posts-unlike/${post._id}`, null, auth.token);

      const msg = {
        id: auth.user._id,
        text: "Liked your post",
        recepients: [newPost.user._id],
        url: `/post/${newPost._id}`,
      };

      dispatch(removeNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

export const getPost =
  ({ detailPost, id, auth }) =>
  async (dispatch) => {
    if (detailPost.every((post) => post._id !== id)) {
      try {
        const res = await getDataAPI(`post/${id}`, auth.user.token);
        dispatch({ type: POST_TYPES.GET_POST, payload: res.data.post });
      } catch (err) {
        dispatch({ type: ALERT, payload: { error: err.response.data } });
      }
    }
  };

export const deletePost =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    dispatch({ type: POST_TYPES.DELETE_POST, payload: post });
    try {
      await deleteDataAPI(`post/${post._id}`, auth.user.token);

      const msg = {
        id: post._id,
        recepients: post.user.followers,
        url: `/post/${post._id}`,
      };

      dispatch(removeNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

// reducer
const initialState = {
  posts: [],
  result: 0,
  page: 2,
  loading: false,
};

export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_TYPES.LOADING_POST:
      return {
        ...state,
        loading: action.payload,
      };

    case POST_TYPES.CREATE_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    case POST_TYPES.GET_POSTS:
      return {
        ...state,
        posts: action.payload.posts,
        result: action.payload.result,
      };
    case POST_TYPES.UPDATE_POST:
      return {
        ...state,
        posts: EditData(state.posts, action.payload._id, action.payload),
      };

    case POST_TYPES.DELETE_POST:
      return {
        ...state,
        posts: [...state.posts].filter(
          (item) => item._id !== action.payload._id
        ),
      };

    default:
      return state;
  }
};
