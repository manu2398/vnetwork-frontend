import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ALERT } from "../../store/reducers/alertReducer";

import { updateProfileUser } from "../../store/reducers/profileReducer";

import { checkImage } from "../../utils/imageUpload";

const EditProfile = ({ closeEdit }) => {
  const initialState = {
    fullname: "",
    website: "",
    bio: "",
    alias: "",
  };

  const [userData, setUserData] = useState(initialState);
  const { fullname, website, bio, alias } = userData;

  const [avatar, setAvatar] = useState("");

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    const err = checkImage(file);
    if (err) return dispatch({ type: ALERT, payload: { error: { msg: err } } });
    setAvatar(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfileUser({ userData, avatar, auth }));
  };

  useEffect(() => {
    setUserData(auth.user);
  }, [auth.user]);

  return (
    <div className="edit_profile">
      <span
        className="material-icons close_btn"
        onClick={() => closeEdit(false)}
      >
        close
      </span>

      <form onSubmit={handleSubmit}>
        <div className="info_avatar">
          <img
            src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
            alt="avatar"
          />
          <span>
            <i className="fas fa-camera" />
            <p>Change</p>
            <input
              type="file"
              name="file"
              id="file_up"
              accept="image/*"
              onChange={changeAvatar}
            />
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="fullname">Full Name</label>
          <div className="position-relative">
            <input
              type="text"
              className="form-control"
              id="fullname"
              name="fullname"
              value={fullname}
              onChange={handleInput}
            />
            <small
              className="text-danger position-absolute"
              style={{
                top: "50%",
                right: "5px",
                transform: "translateY(-50%)",
              }}
            >
              {fullname.length}/25
            </small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="website">Enter Website URL</label>

          <input
            type="url"
            className="form-control"
            id="website"
            name="website"
            value={website}
            onChange={handleInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="alias">Alias for website</label>

          <input
            type="text"
            className="form-control"
            id="alias"
            name="alias"
            value={alias}
            onChange={handleInput}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Enter bio</label>
          <div className="position-relative">
            <textarea
              type="text"
              className="form-control"
              id="bio"
              name="bio"
              value={bio}
              onChange={handleInput}
              cols={30}
            />
            <small
              className="text-danger position-absolute "
              style={{
                right: "5px",
              }}
            >
              {bio?.length ? `${bio.length}/100` : "0/100"}
            </small>
          </div>
        </div>

        <button className="btn btn-info w-100 mt-2" type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
