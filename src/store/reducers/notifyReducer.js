import { deleteDataAPI, getDataAPI, postDataAPI } from "../../utils/fetchData";
import { ALERT } from "./alertReducer";

//types
export const CREATE_NOTIFY = "CREATE_NOTIFY";
export const GET_NOTIFIES = "GET_NOTIFIES";
export const DELETE_NOTIFY = "DELETE_NOTIFY";

//actionTypes
export const createNotify =
  ({ msg, auth, socket }) =>
  async (dispatch) => {
    try {
      const res = await postDataAPI("notify", msg, auth.user.access_token);
      socket.emit("createNotify", {
        ...res.data.newNotify,
        user: {
          username: auth.user.username,
          avatar: auth.user.avatar,
        },
      });
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

export const getNotifies =
  ({ auth }) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI("notifies", auth.user.access_token);
      dispatch({ type: GET_NOTIFIES, payload: res.data.notifies });
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

export const removeNotify =
  ({ msg, auth, socket }) =>
  async (dispatch) => {
    try {
      const res = await deleteDataAPI(
        `notify/${msg.id}?url=${msg.url}`,
        auth.user.token
      );

      dispatch({ type: DELETE_NOTIFY, payload: res.data.notify });

      socket.emit("deleteNotify", res.data.notify);
    } catch (err) {
      dispatch({ type: ALERT, payload: { error: err.response.data } });
    }
  };

//reducer

const initialState = {
  loading: false,
  data: [],
  sound: false,
};
export const notifyReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_NOTIFY:
      return {
        ...state,
        data: [action.payload, ...state.data],
      };

    case GET_NOTIFIES:
      return {
        ...state,
        data: action.payload,
      };

    case DELETE_NOTIFY:
      return {
        ...state,
        data: state.data.filter(
          (item) =>
            item._id !== action.payload._id || item.url !== action.payload.url
        ),
      };

    default:
      return state;
  }
};
