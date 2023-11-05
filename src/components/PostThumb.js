import React from "react";
import { Link } from "react-router-dom";

const PostThumb = ({ posts, result }) => {
  if (result === 0)
    return <h5 className=" mt-2 text-center text-secondary">No Posts</h5>;
  return (
    <div className="post_thumb">
      {posts.map((post) => (
        <Link key={post._id} to={`/post/${post._id}`}>
          <div className="post_thumb_display">
            <img src={post.images[0].url} alt={post.images[0].url} />

            <div className="post_thumb_menu">
              <i className="far fa-heart">{" " + post.likes.length}</i>
              <i className="far fa-comment">{" " + post.comments.length}</i>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostThumb;
