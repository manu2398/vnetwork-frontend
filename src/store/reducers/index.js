import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { alertReducer } from "./alertReducer";
import { commentReducer } from "./commentReducer";
import { detailPostReducer } from "./detailPostReducer";
import { messageReducer } from "./messageReducer";
import { notifyReducer } from "./notifyReducer";
import { profileReducer } from "./profileReducer";
import { postReducer } from "./postReducer";
import { statusReducer } from "./statusReducer";
import { socketReducer } from "./socketReducer";

export default combineReducers({
  auth: authReducer,
  alert: alertReducer,
  profile: profileReducer,
  status: statusReducer,
  homePosts: postReducer,
  comments: commentReducer,
  detailPost: detailPostReducer,
  socket: socketReducer,
  notify: notifyReducer,
  message: messageReducer,
});
