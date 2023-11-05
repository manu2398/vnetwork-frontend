import React from "react";

import LoadIcon from "../images/loading.gif";
import Posts from "../components/home/Posts";
import Status from "../components/home/Status";

import { useSelector } from "react-redux";

const Home = () => {
  const { homePosts } = useSelector((state) => state);

  return (
    <div className="home row">
      <div className="col-md-6">
        {/* <Stories /> */}
        <Status />
        {homePosts.loading ? (
          <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
        ) : homePosts.result === 0 ? (
          <p className="col-md-6 mx-auto text-secondary">
            Feed empty! You need to follow people to show on your feed.
          </p>
        ) : (
          <Posts />
        )}
      </div>
      <div className="col-md-6"></div>
    </div>
  );
};

export default Home;
