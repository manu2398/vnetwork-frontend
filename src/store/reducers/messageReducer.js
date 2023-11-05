import { getDataAPI, postDataAPI } from "../../utils/fetchData";
import { ALERT } from "./alertReducer";
// types
export const MESS_TYPES = {
  ADD_USER: "ADD_USER",
  ADD_MESSAGE: "ADD_MESSAGE",
  GET_CONVERSATIONS: "GET_CONVERSATIONS",
  GET_MESSAGES: "GET_MESSAGES",
};

//actions

export const addUserToChatList =
  ({ auth, user, message }) =>
  (dispatch) => {
    if (message.users.every((item) => item._id !== user._id)) {
      dispatch({ type: MESS_TYPES.ADD_USER, payload: user });
    }
  };

export const sendMessage =
  ({ msg, auth, socket }) =>
  async (dispatch) => {
    dispatch({ type: MESS_TYPES.ADD_MESSAGE, payload: msg });
    socket.emit("addMessage", msg);
    try {
      await postDataAPI("message", msg, auth.user.access_token);
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

export const getConversations =
  ({ auth }) =>
  async (dispatch) => {
    let newArr = [];

    try {
      const res = await getDataAPI("conversations", auth.user.access_token);

      res.data.conversations.forEach((item) => {
        item.recipients.forEach((cv) => {
          if (cv._id !== auth.user._id) {
            newArr.push({ ...cv, text: item.text, media: item.media });
          }
        });
      });

      dispatch({
        type: MESS_TYPES.GET_CONVERSATIONS,
        payload: { newArr, result: res.data.result },
      });
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

export const getMessages =
  ({ auth, id, page = 1 }) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI(
        `message/${id}?limit=${page * 9}`,
        auth.user.access_token
      );
      dispatch({
        type: MESS_TYPES.GET_MESSAGES,
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

//reducer

const initialState = {
  users: [],
  data: [],
  firstLoad: false,
  resultUsers: 0,
  resultData: 0,
};

export const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case MESS_TYPES.ADD_USER:
      return {
        ...state,
        users: [action.payload, ...state.users],
      };
    case MESS_TYPES.ADD_MESSAGE:
      return {
        ...state,
        data: [...state.data, action.payload],
        users: state.users.map((user) =>
          user._id === action.payload.recipient ||
          user._id === action.payload.sender
            ? {
                ...user,
                text: action.payload.text,
                images: action.payload.media,
              }
            : user
        ),
      };

    case MESS_TYPES.GET_CONVERSATIONS:
      return {
        ...state,
        users: action.payload.newArr,
        resultUsers: action.payload.result,
        firstLoad: true,
      };

    case MESS_TYPES.GET_MESSAGES:
      return {
        ...state,
        data: action.payload.messages.reverse(),
        resultData: action.payload.result,
      };

    default:
      return state;
  }
};
