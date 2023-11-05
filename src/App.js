import { BrowserRouter as Router, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { getPosts } from "./store/reducers/postReducer";
import { refreshToken } from "./store/reducers/authReducer";

import Alert from "./components/Alert";
import Home from "./pages/home";
import Header from "./components/header/Header";
import Login from "./pages/login";
import Register from "./pages/register";
import PageRenderer from "./customRouter/PageRenderer";
import PrivateRouter from "./customRouter/PrivateRouter";
import StatusModal from "./components/StatusModal";

import io from "socket.io-client";
// import { SOCKET } from "./store/reducers/socketReducer";
import SocketClient from "./SocketClient";
import { getNotifies } from "./store/reducers/notifyReducer";

function App() {
  const { auth, status } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());

    // const socket = io();
    // dispatch({ type: SOCKET, payload: socket });

    // return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    if (auth?.user?.access_token) {
      dispatch(getPosts(auth?.user?.access_token));
      dispatch(getNotifies({ auth }));
    }
  }, [dispatch, auth?.user?.access_token]);

  return (
    <Router>
      <Alert />

      <div className="App">
        <div className="main">
          {auth?.user?.access_token && <Header />}
          {status && <StatusModal />}

          {auth?.user?.access_token && <SocketClient />}
          <Route
            exact
            path="/"
            component={auth?.user?.access_token ? Home : Login}
          />
          <Route exact path="/register" component={Register} />
          <PrivateRouter exact path="/:page" component={PageRenderer} />
          <PrivateRouter exact path="/:page/:id" component={PageRenderer} />
        </div>
      </div>
    </Router>
  );
}

export default App;
