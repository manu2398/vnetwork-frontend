import React from "react";

export default function Toast({ msg, handleShow, bgColor }) {
  return (
    <div
      className={`toast show position-fixed toast_container text-light ${bgColor}`}
      style={{ right: "5px", top: "5px" }}
    >
      <strong className="toast_message">{msg}</strong>
      <span className="ml-2" onClick={handleShow}>
        &times;
      </span>
    </div>
  );
}
