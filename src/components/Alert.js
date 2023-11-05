import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { ALERT } from "../store/reducers/alertReducer";

import Toast from "./Toast";

function Alert() {
  const { alert } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleShow = () => {
    dispatch({ type: ALERT, payload: {} });
  };

  return (
    <div>
      {alert.loading && (
        <div className="loader_container">
          <div className="loader"></div>
        </div>
      )}

      {alert.success && (
        <Toast msg={alert.msg} handleShow={handleShow} bgColor="bg-success" />
      )}

      {alert.error && (
        <Toast
          msg={alert.error.msg}
          handleShow={handleShow}
          bgColor="bg-danger"
        />
      )}
    </div>
  );
}

export default Alert;
