import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import { login } from "../store/reducers/authReducer";

export default function Login() {
  const { auth } = useSelector((state) => state);
  const history = useHistory();
  const dispatch = useDispatch();

  const initialState = { email: "", password: "" };
  const [userData, setUserData] = useState(initialState);
  const [showPass, setshowPass] = useState(false);
  const { email, password } = userData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(userData));
  };

  useEffect(() => {
    if (auth?.user?.access_token) history.push("/");
  }, [auth?.user?.access_token, history]);

  return (
    <div className="auth_page">
      <form onSubmit={handleSubmit}>
        <h3 className="text-uppercase text-center mb-2">v-network</h3>
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
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChangeInput}
            />
            <small onClick={() => setshowPass(!showPass)}>
              {showPass ? "hide" : "show"}
            </small>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-dark w-100 mb-2"
          disabled={!email || !password ? true : false}
        >
          Login
        </button>
        <p>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "crimson" }}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
