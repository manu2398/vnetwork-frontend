import React from "react";
import { useSelector } from "react-redux";

import UserCard from "../UserCard";
import FollowBtn from "../FollowBtn";

const Followers = ({ users, setShowFollowers, heading }) => {
  const { auth } = useSelector((state) => state);
  return (
    <div className="follow">
      <div className="follow_box">
        <h5 className="text-center">{heading}</h5>
        <hr />
        {users.map((user, idx) => (
          <UserCard key={idx} user={user} setShowFollowers={setShowFollowers}>
            {auth.user._id !== user._id && <FollowBtn user={user} />}
          </UserCard>
        ))}
        <div className="close" onClick={() => setShowFollowers(false)}>
          &times;
        </div>
      </div>
    </div>
  );
};

export default Followers;
