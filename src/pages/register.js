import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Link, useHistory } from "react-router-dom";
import { ALERT } from "../store/reducers/alertReducer";

import { register } from "../store/reducers/authReducer";

export default function Register() {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  const initialState = {
    fullname: "",
    email: "",
    password: "",
    username: "",
    cf_password: "",
    gender: "male",
  };

  const [userData, setUserData] = useState(initialState);
  const [showPass, setshowPass] = useState(false);
  const { fullname, username, email, password, cf_password } = userData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userData.cf_password !== password)
      return dispatch({
        type: ALERT,
        payload: { error: { msg: "Confirm Password field does not match" } },
      });
    dispatch(register(userData));
  };

  useEffect(() => {
    if (auth?.user?.access_token) history.push("/");
  }, [auth?.user?.access_token, history]);

  return (
    <div className="auth_page">
      <form onSubmit={handleSubmit}>
        <h3 className="text-uppercase text-center mb-2">v-network</h3>
        <div className="form-group">
          <label htmlFor="fullname">Fullname</label>
          <input
            type="text"
            className="form-control"
            id="fullname"
            placeholder="Enter full name"
            name="fullname"
            value={fullname}
            onChange={handleChangeInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter user name"
            name="username"
            value={username}
            onChange={handleChangeInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={email}
            onChange={handleChangeInput}
            placeholder="Enter email"
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="pass">
            <input
              type={showPass ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="Enter password"
              name="password"
              value={password}
              onChange={handleChangeInput}
            />
            <small onClick={() => setshowPass(!showPass)}>
              {showPass ? "hide" : "show"}
            </small>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="cf_password">Confirm Password</label>
          <div className="pass">
            <input
              type={showPass ? "text" : "password"}
              className="form-control"
              id="cf_password"
              placeholder="Enter same password again"
              name="cf_password"
              value={cf_password}
              onChange={handleChangeInput}
            />
            <small onClick={() => setshowPass(!showPass)}>
              {showPass ? "hide" : "show"}
            </small>
          </div>
        </div>

        <div className="row justify-content-between mx-0 mb-1">
          <label htmlFor="male">
            Male:{" "}
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              defaultChecked
              onChange={handleChangeInput}
            />
          </label>

          <label htmlFor="female">
            Female:{" "}
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              onChange={handleChangeInput}
            />
          </label>

          <label htmlFor="other">
            Other:{" "}
            <input
              type="radio"
              id="other"
              name="gender"
              value="other"
              onChange={handleChangeInput}
            />
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-dark w-100 mb-2"
          disabled={
            !email || !password || !username || !fullname ? true : false
          }
        >
          Register
        </button>
        <p>
          Don't have an account?{" "}
          <Link to="/" style={{ color: "crimson" }}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
