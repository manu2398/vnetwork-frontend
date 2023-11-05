import React, { useEffect, useState } from "react";
import Send from "../../../images/send.svg";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import LikeButton from "../../LikeButton";

import { likePost, unLikePost } from "../../../store/reducers/postReducer";
import Followers from "../../profile/Followers";

const CardFooter = ({ post }) => {
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleLike = () => {
    if (loadLike) return;
    setIsLike(true);
    setLoadLike(true);
    dispatch(likePost({ post, auth, socket }));
    setLoadLike(false);
  };

  const handleUnLike = () => {
    if (loadLike) return;
    setIsLike(false);
    setLoadLike(true);
    dispatch(unLikePost({ post, auth, socket }));
    setLoadLike(false);
  };

  useEffect(() => {
    if (post.likes.find((user) => user._id === auth.user._id)) {
      setIsLike(true);
    }
  }, [post.likes, auth.user._id]);

  return (
    <div className="card_footer">
      <div className="card_icon_menu">
        <div>
          <LikeButton
            isLike={isLike}
            handleLike={handleLike}
            handleUnlike={handleUnLike}
          />

          <Link to={`/post/${post._id}`} style={{ color: "black" }}>
            <i className="far fa-comment" />
          </Link>

          <img src={Send} alt="send" />
        </div>

        <i className="far fa-bookmark" />
      </div>
      <div className="d-flex justify-content-between">
        <span
          onClick={() => setShowLikes(true)}
          style={{ padding: `0 23px`, fontSize: "14px", cursor: "pointer" }}
        >
          {post.likes.length} likes
        </span>
        {post.likes.length > 0 && showLikes && (
          <Followers
            users={post.likes}
            setShowFollowers={setShowLikes}
            heading="Liked By"
          />
        )}
        <span
          style={{ padding: `0 23px`, fontSize: "14px", cursor: "pointer" }}
        >
          {post.comments.length} comments
        </span>
      </div>
    </div>
  );
};

export default CardFooter;
