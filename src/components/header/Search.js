import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import { ALERT } from "../../store/reducers/alertReducer";

import { getDataAPI } from "../../utils/fetchData";

import UserCard from "../UserCard";
import LoadIcon from "../../images/loading.gif";

const Search = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [load, setLoad] = useState(false);

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleClose = () => {
    setSearch("");
    setUsers([]);
  };

  useEffect(() => {
    if (search && auth.user.access_token) {
      setLoad(true);
      getDataAPI(`search-users?username=${search}`, auth.user.access_token)
        .then((res) => {
          setUsers(res.data.users);
          setLoad(false);
        })
        .catch((err) =>
          dispatch({
            type: ALERT,
            payload: { error: err.response.data },
          })
        );
    }
  }, [search, auth.user.access_token, dispatch]);

  return (
    <form className="search_form" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        value={search}
        id="search"
        name="search"
        onChange={(e) =>
          setSearch(e.target.value.toLowerCase().replace(/ /g, ""))
        }
      />

      <div className="search_icon" style={{ opacity: search ? 0 : 0.5 }}>
        <span className="material-icons">search</span>
        <span>Search</span>
      </div>

      <div
        className="clear"
        onClick={handleClose}
        style={{ opacity: users.length === 0 ? 0 : 1 }}
      >
        &times;
      </div>

      {load && <img className="loading" src={LoadIcon} alt="loading" />}

      <div className="users">
        {search &&
          users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              border="border"
              handleClose={handleClose}
            />
          ))}
      </div>
    </form>
  );
};

export default Search;
