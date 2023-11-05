import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ALERT } from "../../store/reducers/alertReducer";
import {
  sendMessage,
  getMessages,
  MESS_TYPES,
} from "../../store/reducers/messageReducer";
import { imageUpload } from "../../utils/imageUpload";

import UserCard from "../UserCard";
import MsgDisplay from "./MsgDisplay";
import LoadIcon from "../../images/loading.gif";

const RightSide = () => {
  const { auth, message, socket } = useSelector((state) => state);
  const [user, setUser] = useState([]);
  const [images, setImages] = useState([]);
  const [text, setText] = useState("");
  const [page, setPage] = useState(0);
  const [loadMedia, setLoadMedia] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const containerRef = useRef();
  const pageEnd = useRef();

  const handleMessageSubmit = async (e) => {
    e.preventDefault();

    let media = [];

    if (!text.trim() && images.length === 0) return;
    setText("");
    setImages("");
    setLoadMedia(true);

    if (images.length > 0) media = await imageUpload(images);

    const msg = {
      sender: auth.user._id,
      recipient: id,
      text,
      media,
      createdAt: new Date().toISOString(),
    };

    setLoadMedia(false);
    await dispatch(sendMessage({ msg, auth, socket }));
    if (containerRef.current)
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
  };

  const removeImg = (idx) => {
    setImages([...images.filter((img, i) => i !== idx)]);
  };

  const handleChangeImages = (e) => {
    let err = "";
    let nImages = [];

    const files = [...e.target.files];
    files.forEach((file) => {
      if (!file) return (err = "File does not exist");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return (err = "File format is incorrect");

      return nImages.push(file);
    });

    if (err)
      dispatch({
        type: ALERT,
        payload: {
          error: { msg: err },
        },
      });

    setImages([...images, ...nImages]);
  };

  useEffect(() => {
    const newUser = message.users.find((user) => user._id === id);
    if (newUser) {
      setUser(newUser);
      setPage(0);
    }
  }, [message.users, id]);

  useEffect(() => {
    if (id) {
      const getMessagesData = async () => {
        dispatch({
          type: MESS_TYPES.GET_MESSAGES,
          payload: { messages: [] },
        });
        setPage(0);
        await dispatch(getMessages({ auth, id }));
        if (containerRef.current)
          containerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
      };

      getMessagesData();
    }
  }, [id, dispatch, auth]);

  //Load more
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(pageEnd.current);
  }, [setPage]);

  useEffect(() => {
    if (message.resultData >= (page - 1) * 9 && page > 1) {
      dispatch(getMessages({ auth, id, page }));
    }
  }, [dispatch, message.resultData, page, id, auth]);

  useEffect(() => {
    if (containerRef.current)
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
  }, [text]);
  return (
    <>
      <div className="message_header">
        {user && user.length !== 0 && (
          <UserCard user={user}>
            <i
              className="fas fa-trash text-secondary text-end"
              style={{ cursor: "pointer" }}
            />
          </UserCard>
        )}
      </div>

      <div
        className="chat_container"
        style={{ height: images.length > 0 ? "calc(100% - 180px)" : "" }}
      >
        <div className="chat_display" ref={containerRef}>
          <button style={{ marginTop: "-25px", opacity: 0 }} ref={pageEnd}>
            LOAD MORE
          </button>

          {message.data.map((msg, idx) => (
            <div key={idx}>
              {msg.sender !== auth.user._id && (
                <div className="chat_row other_message">
                  {user && <MsgDisplay user={user} msg={msg} />}
                </div>
              )}

              {msg.sender === auth.user._id && (
                <div className="chat_row you_message">
                  <MsgDisplay user={auth.user} msg={msg} />
                </div>
              )}
            </div>
          ))}

          {
            <div className="chat_row you_message">
              {loadMedia && <img src={LoadIcon} alt="loading" />}
            </div>
          }
        </div>
      </div>

      <div
        className="show_img"
        style={{ display: images.length > 0 ? "grid" : "none" }}
      >
        {images &&
          images.map((image, idx) => (
            <div id="file_img" key={idx}>
              <img
                src={image.url ? image.url : URL.createObjectURL(image)}
                className="img-thumbnail"
                alt="images"
              />
              <span onClick={() => removeImg(idx)}>&times;</span>
            </div>
          ))}
      </div>

      <form className="chat_input" onSubmit={handleMessageSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your message.."
        />

        <div className="file_upload">
          <i className="fas fa-image text-secondary" />
          <input
            type="file"
            name="file"
            id="file"
            multiple
            accept="image/*"
            onChange={handleChangeImages}
          />
        </div>

        <button
          className="material-icons text-primary"
          type="submit"
          disabled={text || images.length > 0 ? false : true}
        >
          near_me
        </button>
      </form>
    </>
  );
};

export default RightSide;
