import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getPost } from "../../store/reducers/postReducer";

import LoadIcon from "../../images/loading.gif";
import PostCard from "../../components/PostCard";

const PostDetail = () => {
  const { id } = useParams();
  const { auth, detailPost } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [post, setPost] = useState([]);

  useEffect(() => {
    dispatch(getPost({ detailPost, id, auth }));

    if (detailPost.length > 0) {
      const myPost = detailPost.filter((item) => item._id === id);
      setPost(myPost);
    }
  }, [detailPost, id, auth, dispatch]);
  return (
    <div className="posts">
      {post.length === 0 && (
        <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
      )}

      {post.map((item) => (
        <PostCard key={item._id} post={item} />
      ))}
    </div>
  );
};

export default PostDetail;
