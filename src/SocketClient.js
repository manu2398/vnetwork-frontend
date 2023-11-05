import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MESS_TYPES } from "./store/reducers/messageReducer";
import { CREATE_NOTIFY, DELETE_NOTIFY } from "./store/reducers/notifyReducer";

import { POST_TYPES } from "./store/reducers/postReducer";

const SocketClient = () => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  // Joinuser
  useEffect(() => {
    socket.emit("joinUser", auth.user._id);
  }, [socket, auth.user._id]);

  // Like
  useEffect(() => {
    socket.on("likeToClient", (post) => {
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: post });

      return () => socket.off("likeToClient");
    });
  }, [socket, dispatch]);

  // unLike
  useEffect(() => {
    socket.on("unlikeToClient", (post) => {
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: post });

      return () => socket.off("unlikeToClient");
    });
  }, [socket, dispatch]);

  // notify
  useEffect(() => {
    socket.on("createNotifyToClient", (msg) => {
      dispatch({ type: CREATE_NOTIFY, payload: msg });

      return () => socket.off("createNotifyToClient");
    });
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on("deleteNotifyToClient", (msg) => {
      dispatch({ type: DELETE_NOTIFY, payload: msg });

      return () => socket.off("deleteNotifyToClient");
    });
  }, [socket, dispatch]);

  //msg
  useEffect(() => {
    socket.on("addMessageToClient", (msg) => {
      dispatch({ type: MESS_TYPES.ADD_MESSAGE, payload: msg });

      return () => socket.off("addMessageToClient");
    });
  }, [socket, dispatch]);

  return <></>;
};

export default SocketClient;
