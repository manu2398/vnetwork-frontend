import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { follow, unFollow } from "../store/reducers/profileReducer";

const FollowBtn = ({ user }) => {
  const [followed, setFollowed] = useState(false);

  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleFollow = () => {
    setFollowed(true);
    dispatch(follow({ user, auth, socket }));
  };

  const handleUnfollow = () => {
    dispatch(unFollow({ user, auth, socket }));
    setFollowed(false);
  };

  useEffect(() => {
    if (auth.user.following.find((item) => item._id === user._id)) {
      setFollowed(true);
    }
  }, [auth.user.following, user._id]);

  return (
    <>
      {followed ? (
        <div className="btn btn-outline-danger ml-4" onClick={handleUnfollow}>
          Unfollow
        </div>
      ) : (
        <div className="btn btn-outline-info ml-4" onClick={handleFollow}>
          Follow
        </div>
      )}
    </>
  );
};
export default FollowBtn;
