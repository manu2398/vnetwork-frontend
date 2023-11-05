import React from "react";

import { Redirect, Route } from "react-router-dom";

const PrivateRouter = (props) => {
  const first = localStorage.getItem("firstLogin");
  return first ? <Route {...props} /> : <Redirect to="/" />;
};

export default PrivateRouter;
