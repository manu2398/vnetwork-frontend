import React, { useEffect, useState } from "react";
import PostThumb from "../PostThumb";

const Posts = ({ profile, username }) => {
  const [posts, setPosts] = useState([]);
  const [result, setResult] = useState(9);

  useEffect(() => {
    profile.posts.forEach((data) => {
      if (data.username === username) {
        setPosts(data.posts);
        setResult(data.result);
      }
    });
  }, [profile.posts, username]);

  return (
    <div>
      <PostThumb posts={posts} result={result} />
    </div>
  );
};

export default Posts;
