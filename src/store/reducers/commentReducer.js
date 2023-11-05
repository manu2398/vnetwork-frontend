import {
  deleteDataAPI,
  patchDataAPI,
  postDataAPI,
} from "../../utils/fetchData";
import { ALERT } from "./alertReducer";
import { POST_TYPES } from "./postReducer";
import { EditData } from "./globalTypes";
import { createNotify, removeNotify } from "./notifyReducer";

//actionTypes
export const CREATE_COMMENT = "CREATE_COMMENT";

//action creators
export const createComment =
  ({ post, auth, newComment, socket }) =>
  async (dispatch) => {
    try {
      const data = {
        ...newComment,
        postId: post._id,
        postUserId: post.user._id,
      };

      const res = await postDataAPI("comment", data, auth.token);

      const newData = { ...res.data.newComment, user: auth.user };
      const newPost = { ...post, comments: [...post.comments, newData] };

      dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

      const msg = {
        id: res.data.newComment._id,
        text: newComment.reply
          ? "Mentioned you in a comment"
          : "Commented on your post",
        recepients: newComment.reply
          ? [newComment.tag._id]
          : [newPost.user._id],
        url: `/post/${newPost._id}`,
        content: newComment.content,
        image: newPost.images[0].url,
      };

      dispatch(createNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

export const updateComment =
  ({ comment, post, auth, content }) =>
  async (dispatch) => {
    const newComments = EditData(post.comments, comment._id, {
      ...comment,
      content,
    });

    const newPost = { ...post, comments: newComments };

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    try {
      await patchDataAPI(
        `comment/${comment._id}`,
        { content },
        auth.user.token
      );
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

export const likeComment =
  ({ comment, post, auth }) =>
  async (dispatch) => {
    const newComment = { ...comment, likes: [...comment.likes, auth.user] };

    const newComments = EditData(post.comments, comment._id, newComment);

    const newPost = { ...post, comments: newComments };

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    try {
      await patchDataAPI(`comment/${comment._id}/like`, null, auth.token);
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

export const unlikeComment =
  ({ comment, post, auth }) =>
  async (dispatch) => {
    const newComment = {
      ...comment,
      likes: [...comment.likes].filter((user) => user._id !== auth.user._id),
    };

    const newComments = EditData(post.comments, comment._id, newComment);

    const newPost = { ...post, comments: newComments };

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    try {
      await patchDataAPI(`comment/${comment._id}/unlike`, null, auth.token);
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

export const commentRemove =
  ({ post, comment, auth, socket }) =>
  async (dispatch) => {
    const tobeDeletedArr = [
      ...post.comments.filter((cm) => cm.reply === comment._id),
      comment,
    ];

    const newPost = {
      ...post,
      comments: [
        ...post.comments.filter(
          (cm) => !tobeDeletedArr.find((da) => da._id === cm._id)
        ),
      ],
    };

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    try {
      tobeDeletedArr.forEach((item) => {
        deleteDataAPI(`comment/${item._id}`, auth.user.token);

        const msg = {
          id: item._id,
          text: comment.reply
            ? "Mentioned you in a comment"
            : "Commented on your post",
          recepients: comment.reply ? [comment.tag._id] : [newPost.user._id],
          url: `/post/${newPost._id}`,
        };

        dispatch(removeNotify({ msg, auth, socket }));
      });
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

// reducer
const initialState = {};

export const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_COMMENT:
      return action.payload;
    default:
      return state;
  }
};
