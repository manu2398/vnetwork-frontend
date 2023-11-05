import React from "react";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";

import { STATUS } from "../../../store/reducers/statusReducer";

import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../Avatar";
import { deletePost } from "../../../store/reducers/postReducer";

const CardHeader = ({ post }) => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleEditPost = () => {
    dispatch({ type: STATUS, payload: { ...post, onEdit: true } });
  };

  const handleDeletePost = () => {
    if (window.confirm("êtes-vous sûr ? ")) {
      dispatch(deletePost({ post, auth, socket }));
      return history.push("/");
    }
  };

  return (
    <div className="card_header">
      <div className="d-flex align-items-center">
        <Avatar src={post.user.avatar} size="big_avatar" />

        <div className="card_name ml-2">
          <h6 className="m-0">
            <Link to={`/profile/${post.user.username}`} className="text-dark">
              {post.user.username}
            </Link>
          </h6>
          <small className="text-muted">
            {moment(post.createdAt).fromNow()}
          </small>
        </div>
      </div>

      <div className="nav-item dropdown" style={{ cursor: "pointer" }}>
        <span className="material-icons" id="moreLink" data-toggle="dropdown">
          more_horiz
        </span>

        <div className="dropdown-menu">
          {auth.user._id === post.user._id && (
            <>
              <div className="dropdown-item" onClick={handleEditPost}>
                <span className="material-icons">create</span>
                Edit
              </div>
              <div className="dropdown-item" onClick={handleDeletePost}>
                <span className="material-icons">delete_outline</span>Delete
              </div>
            </>
          )}
          <div className="dropdown-item">
            <span className="material-icons">content_copy</span>Copy
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
