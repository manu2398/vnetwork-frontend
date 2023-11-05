import React, { memo, useEffect, useState } from "react";
import CommentDisplay from "./comments/CommentDisplay";

const Comments = memo(({ post }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [next, setNext] = useState(2);

  const [replyComments, setReplyComments] = useState([]);

  useEffect(() => {
    const newComm = post.comments.filter((cm) => !cm.reply);
    setComments(newComm);
    setShowComments(
      newComm.slice(newComm.length - next < 0 ? 0 : newComm.length - next)
    );
  }, [post.comments, next]);

  useEffect(() => {
    const newComm = post.comments.filter((cm) => cm.reply);
    setReplyComments(newComm);
  }, [post.comments]);

  return (
    <div className="comments">
      {showComments.map((comment, idx) => (
        <CommentDisplay
          key={idx}
          comment={comment}
          post={post}
          replyCm={replyComments.filter((item) => item.reply === comment._id)}
        />
      ))}

      {comments.length - next > 0 ? (
        <div
          className="p-1"
          style={{ cursor: "pointer", color: "crimson" }}
          onClick={() => setNext(next + 10)}
        >
          See more comments...
        </div>
      ) : (
        comments.length > 2 && (
          <div
            className="p-1"
            style={{ cursor: "pointer", color: "crimson" }}
            onClick={() => setNext(2)}
          >
            Hide comments...
          </div>
        )
      )}
    </div>
  );
});

export default Comments;
