import React, { useEffect, useState } from "react";
import Avatar from "../Avatar";

import EditProfile from "./EditProfile";
import FollowBtn from "../FollowBtn";
import Followers from "./Followers";
import Following from "./Following";

const Info = ({ username, profile, auth }) => {
  const [userData, setUserData] = useState([]);
  const [onEdit, setOnEdit] = useState(false);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    const newData = profile.users.filter((user) => user.username === username);
    setUserData(newData);
  }, [auth, username, profile.users]);

  return (
    <div className="info">
      {userData.map((user) => (
        <div className="info_container" key={user._id}>
          <Avatar src={user.avatar} size="super_avatar" />

          <div className="info_body">
            <div className="info_content">
              <div className="info_content_title">
                <h2>{user.username}</h2>
                {auth.user.username === username ? (
                  <span
                    onClick={() => setOnEdit(true)}
                    className="material-icons"
                  >
                    edit
                  </span>
                ) : (
                  <FollowBtn user={user} />
                )}
              </div>

              <div className="follow_btn mt-2 mb-2">
                <span className="mr-4" onClick={() => setShowFollowers(true)}>
                  {user.followers.length} followers
                </span>

                <span className="ml-4" onClick={() => setShowFollowing(true)}>
                  {user.following.length} following
                </span>
              </div>

              <h6>{user.fullname}</h6>
              <p className="m-0">{user.bio}</p>

              <a href={user.website} target="_blank" rel="noreferrer">
                {user.alias}
              </a>
            </div>
          </div>

          {onEdit && <EditProfile closeEdit={setOnEdit} />}
          {showFollowers && (
            <Followers
              users={user.followers}
              setShowFollowers={setShowFollowers}
              heading="Followers"
            />
          )}
          {showFollowing && (
            <Following
              users={user.following}
              setShowFollowing={setShowFollowing}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Info;
