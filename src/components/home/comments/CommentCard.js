import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

import Avatar from "../../Avatar";
import CommentMenu from "./CommentMenu";
import Followers from "../../profile/Followers";
import InputComment from "../InputComment";
import LikeButton from "../../LikeButton";

import {
  updateComment,
  likeComment,
  unlikeComment,
} from "../../../store/reducers/commentReducer";

const CommentCard = ({ children, comment, post, commentId }) => {
  const [readMore, setReadMore] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [content, setContent] = useState("");
  const [showLikes, setShowLikes] = useState(false);
  const [onReply, setOnReply] = useState(false);

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleLike = async () => {
    if (loadLike) return;
    setIsLike(true);
    setLoadLike(true);
    await dispatch(likeComment({ comment, post, auth }));
    setLoadLike(false);
  };

  const handleUnlike = async () => {
    if (loadLike) return;
    setIsLike(false);
    setLoadLike(true);
    await dispatch(unlikeComment({ comment, post, auth }));
    setLoadLike(false);
  };

  const handleReply = () => {
    if (onReply) return setOnReply(false);
    setOnReply({ ...comment, commentId });
  };

  const handleUpdateComment = () => {
    if (!content) return;
    if (comment.content !== content) {
      dispatch(updateComment({ comment, post, auth, content }));
      setOnEdit(false);
    } else {
      setOnEdit(false);
    }
  };

  useEffect(() => {
    setContent(comment.content);
    setIsLike(false);
    setOnReply(false);
    if (comment.likes.find((like) => like._id === auth.user._id)) {
      setIsLike(true);
    }
  }, [comment.likes, auth.user._id, comment.content]);

  // const styleCard = {
  //   opacity: comment._id ? 1 : 0.5,
  //   pointerEvents: comment._id ? "inherit" : "none",
  // };

  return (
    <div
      className="comment_card mt-2"
      style={{ opacity: comment._id ? 1 : 0.5 }}
    >
      <Link
        to={`/profile/${comment.user.username}`}
        className="d-flex text-dark"
      >
        <Avatar src={comment.user.avatar} size="small_avatar" />
        <h6 className="mx-1">{comment.user.username}</h6>
      </Link>
      <div className="comment_content">
        <div className="flex-fill">
          {onEdit ? (
            <textarea
              value={content}
              rows="5"
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <div>
              {comment.tag && comment.tag._id !== comment.user._id && (
                <Link to={`/profile/${comment.tag.username}`} className="mr-1">
                  @{comment.tag.username}
                </Link>
              )}
              <span>
                {content?.length < 100
                  ? content
                  : readMore
                  ? content + " "
                  : content?.slice(0, 100) + "...."}
              </span>
              {content?.length > 100 && (
                <span
                  className="readMore"
                  onClick={() => setReadMore(!readMore)}
                >
                  {readMore ? "Hide content" : "Read more"}
                </span>
              )}
            </div>
          )}

          <div className="like_reply">
            <small className="text-sm text-muted mr-3">
              {moment(comment.createdAt).fromNow()}
            </small>
            <span
              className="font-weight-bold mr-3"
              onClick={() => setShowLikes(true)}
            >
              {comment.likes.length} likes
            </span>
            {comment.likes.length > 0 && showLikes && (
              <Followers
                users={comment.likes}
                setShowFollowers={setShowLikes}
                heading="Liked by"
              />
            )}
            {onEdit ? (
              <>
                <span
                  className="font-weight-bold mr-3"
                  onClick={handleUpdateComment}
                >
                  update
                </span>
                <span
                  className="font-weight-bold"
                  onClick={() => {
                    setOnEdit(false);
                  }}
                >
                  cancel
                </span>
              </>
            ) : (
              <span className="font-weight-bold" onClick={handleReply}>
                {onReply ? "cancel" : "reply"}
              </span>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div style={{ cursor: "pointer" }}>
            <LikeButton
              isLike={isLike}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
            />
          </div>
          <CommentMenu post={post} comment={comment} setOnEdit={setOnEdit} />
        </div>
      </div>

      {onReply && (
        <InputComment post={post} onReply={onReply} setOnReply={setOnReply}>
          <Link to={`/profile/${onReply.user.username}`} className="mr-1">
            @{onReply.user.username}:
          </Link>
        </InputComment>
      )}

      {children}
    </div>
  );
};

export default CommentCard;
