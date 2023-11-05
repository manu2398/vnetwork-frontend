import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createComment } from "../../store/reducers/commentReducer";

const InputComment = ({ children, post, onReply, setOnReply }) => {
  const [content, setContent] = useState("");
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      return;
    }

    const newComment = {
      content,
      likes: [],
      user: auth.user,
      createdAt: new Date().toISOString(),
      reply: onReply?.commentId,
      tag: onReply?.user,
    };

    dispatch(createComment({ post, auth, newComment, socket }));
    setContent("");
    if (onReply) return setOnReply(false);
  };
  return (
    <form className="card-footer comment_input" onSubmit={handleSubmit}>
      {children}
      <input
        type="text"
        placeholder="Add your comment.."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="submit"
        className="postBtn"
        disabled={!content.trim() ? true : false}
      >
        Add
      </button>
    </form>
  );
};

export default InputComment;
