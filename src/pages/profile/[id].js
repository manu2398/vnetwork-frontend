import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Info from "../../components/profile/Info";
import LoadIcon from "../../images/loading.gif";
import Posts from "../../components/profile/Posts";

import { getProfileUsers } from "../../store/reducers/profileReducer";

import { useParams } from "react-router-dom";

const Profile = () => {
  const { id: username } = useParams();

  const { auth, profile } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (profile.usernames.every((item) => item !== username)) {
      dispatch(getProfileUsers({ users: profile.users, username, auth }));
    }
  }, [profile.usernames, profile.users, dispatch, auth, username]);

  return (
    <div className="profile">
      <Info auth={auth} profile={profile} username={username} />
      {profile.loading ? (
        <img
          className="d-block mx-auto my-3"
          src={LoadIcon}
          alt="loading"
          style={{ margin: "auto" }}
        />
      ) : (
        <Posts profile={profile} username={username} />
      )}
    </div>
  );
};

export default Profile;
