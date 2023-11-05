import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

import Avatar from "./Avatar";

const NotifyModal = () => {
  const { notify } = useSelector((state) => state);
  // const dispatch = useDispatch();

  return (
    <div style={{ minWidth: "290px" }}>
      <div className="d-flex align-items-center justify-content-between px-3">
        <h5>Notification</h5>
        {notify.sound ? (
          <i
            className="fas fa-bell text-danger"
            style={{ cursor: "pointer", fontSize: "1rem" }}
          />
        ) : (
          <i
            className="fas fa-bell-slash text-danger"
            style={{ cursor: "pointer", fontSize: "1rem" }}
          />
        )}
      </div>
      <hr />
      {notify.data.length === 0 && (
        <i
          className="fas fa-bell-slash text-secondary text-center w-100 mx-auto"
          style={{ fontSize: "3rem", opacity: "0.6" }}
        />
      )}

      <div style={{ maxHeight: "calc(100vh -200px)", overflow: "auto" }}>
        {notify.data.map((msg, idx) => (
          <div key={idx} className="mb-3 px-2">
            <Link
              to={`${msg.url}`}
              className="d-flex align-items-center text-dark"
            >
              <Avatar src={msg.user.avatar} size="medium_avatar" />

              <div className="mx-1 flex-fill">
                <small>
                  <strong className="mr-1">{msg.user.username}</strong>
                  <span>{`${msg.text} `} </span>
                </small>
                {msg.content && (
                  <small
                    className="text-danger"
                    style={{ fontFamily: "cursive" }}
                  >
                    {msg.content.slice(0, 20)}...
                  </small>
                )}
              </div>
              <div>
                {msg.image && (
                  <img
                    src={msg.image}
                    style={{
                      height: "25px",
                      width: "25px",
                      objectFit: "cover",
                    }}
                    alt="post_image"
                  />
                )}
              </div>
            </Link>
            <small className="d-flex align-items-center justify-content-between px-2">
              <small>{moment(msg.createdAt).fromNow()}</small>
              {!msg.isRead && (
                <i
                  className="fas fa-circle text-primary"
                  style={{ fontSize: "10px" }}
                />
              )}
            </small>
          </div>
        ))}

        <hr />
        <div
          className="text-right text-danger mr-2"
          style={{ fontSize: "12px", cursor: "pointer" }}
        >
          Clear all
        </div>
      </div>
    </div>
  );
};

export default NotifyModal;
