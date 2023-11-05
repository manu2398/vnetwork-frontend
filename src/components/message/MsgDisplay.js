import React from "react";
import Avatar from "../Avatar";

const MsgDisplay = ({ user, msg }) => {
  return (
    <>
      <div className="chat_title">
        <Avatar src={user.avatar} size="small_avatar" />
      </div>

      {msg.text && <div className="chat_text">{msg.text}</div>}

      {msg.media.length > 0 &&
        msg.media.map((image, idx) => (
          <div id="file_img" key={idx}>
            <img
              src={image.url ? image.url : URL.createObjectURL(image)}
              className="img-thumbnail"
              alt="images"
            />
          </div>
        ))}
      <div className="chat_time">
        {new Date(msg.createdAt).toLocaleString()}
      </div>
    </>
  );
};

export default MsgDisplay;
