import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import UserCard from "../UserCard";

import { getDataAPI } from "../../utils/fetchData";
import { ALERT } from "../../store/reducers/alertReducer";
import {
  addUserToChatList,
  getConversations,
} from "../../store/reducers/messageReducer";

const LeftSide = () => {
  const [search, setSearch] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const history = useHistory();
  const { id } = useParams();
  const { auth, message } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search) return setSearchUsers([]);

    getDataAPI(`search-users?username=${search}`, auth.user.access_token)
      .then((res) => {
        setSearchUsers(res.data.users);
      })
      .catch((err) =>
        dispatch({
          type: ALERT,
          payload: { error: err.response.data },
        })
      );
  };

  const handleAddUser = (user) => {
    setSearch("");
    setSearchUsers([]);

    dispatch(addUserToChatList({ auth, user, message }));
    return history.push(`/message/${user._id}`);
  };

  const isActive = (user) => {
    if (user._id === id) return "active";
    return "";
  };

  useEffect(() => {
    if (!search) setSearchUsers([]);
  }, [search]);

  useEffect(() => {
    if (message.firstLoad) return;
    dispatch(getConversations({ auth }));
  }, [message.firstLoad, auth, dispatch]);

  return (
    <>
      <form className="message_header" onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search.."
        />
        <button type="submit" id="search">
          Search
        </button>
      </form>

      <div className="message_chat_list">
        {searchUsers.length !== 0 ? (
          <>
            {searchUsers.map((user) => (
              <div
                key={user._id}
                className={`message_user ${isActive(user)}`}
                onClick={() => handleAddUser(user)}
              >
                <UserCard user={user} />
              </div>
            ))}
          </>
        ) : (
          <>
            {message.users.map((user, idx) => (
              <div
                className={`message_user ${isActive(user)}`}
                key={idx}
                onClick={() => history.push(`/message/${user._id}`)}
              >
                <UserCard user={user} msg={true}>
                  <i className="fas fa-circle" />
                </UserCard>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default LeftSide;
