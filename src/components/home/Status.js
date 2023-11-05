import React from "react";

import { useSelector, useDispatch } from "react-redux";

import { STATUS } from "../../store/reducers/statusReducer";

import Avatar from "../Avatar";

const Status = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <div className="status my-3 d-flex">
      <Avatar src={auth.user.avatar} size="big_avatar" />
      <button
        className="statusbtn flex-fill"
        onClick={() => dispatch({ type: STATUS, payload: true })}
      >
        Hey {auth.user.username} ! What are you thinking today?
      </button>
    </div>
  );
};

export default Status;
