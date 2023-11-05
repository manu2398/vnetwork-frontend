import React, { useState, useEffect } from "react";

import CommentCard from "./CommentCard";

const CommentDisplay = ({ comment, post, replyCm }) => {
  const [showReply, setShowReply] = useState([]);
  const [next, setNext] = useState(1);

  useEffect(() => {
    setShowReply(
      replyCm.slice(replyCm.length - next < 0 ? 0 : replyCm.length - next)
    );
  }, [replyCm, next]);

  return (
    <div className="comment_display">
      <CommentCard comment={comment} post={post} commentId={comment._id}>
        <div className="pl-4">
          {showReply.map(
            (item, idx) =>
              item.reply && (
                <CommentCard
                  key={idx}
                  comment={item}
                  post={post}
                  commentId={comment._id}
                />
              )
          )}

          {replyCm.length - next > 0 ? (
            <div
              className="p-1"
              style={{ cursor: "pointer", color: "crimson" }}
              onClick={() => setNext(next + 2)}
            >
              See more replies...
            </div>
          ) : (
            replyCm.length > 1 && (
              <div
                className="p-1"
                style={{ cursor: "pointer", color: "crimson" }}
                onClick={() => setNext(1)}
              >
                Hide replies...
              </div>
            )
          )}
        </div>
      </CommentCard>
    </div>
  );
};

export default CommentDisplay;
