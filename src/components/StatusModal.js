import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ALERT } from "../store/reducers/alertReducer";
import { createPost, updatePost } from "../store/reducers/postReducer";
import { STATUS } from "../store/reducers/statusReducer";

const StatusModal = () => {
  const dispatch = useDispatch();
  const { auth, status, socket } = useSelector((state) => state);

  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [alias, setAlias] = useState("");
  const [images, setImages] = useState([]);

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

  const removeImg = (idx) => {
    setImages([...images.filter((img, i) => i !== idx)]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (images.length === 0)
      return dispatch({
        type: ALERT,
        payload: { error: { msg: "Please add atleast one photo" } },
      });

    if (status.onEdit) {
      dispatch(updatePost({ content, link, alias, images, auth, status }));
    } else {
      dispatch(createPost({ content, link, alias, images, auth, socket }));
    }

    setContent("");
    setImages([]);
    dispatch({ type: STATUS, payload: false });
  };

  useEffect(() => {
    if (status.onEdit) {
      setContent(status.content);
      setImages(status.images);
      setAlias(status.alias);
      setLink(status.link);
    }
  }, [status]);

  return (
    <div className="status_modal">
      <form onSubmit={handleSubmit}>
        <div className="status_header">
          <h5 className="m-0">Create Post</h5>
          <span onClick={() => dispatch({ type: STATUS, payload: false })}>
            &times;
          </span>
        </div>

        <div className="status_body">
          <textarea
            name="content"
            placeholder={`Hey ${auth.user.username} ! What are you thinking today?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />

          <div className="show_images">
            {images.map((image, idx) => (
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

          <div className="input_images">
            <div className="file_upload">
              <i className="fas fa-image" />
              <input
                type="file"
                name="file"
                id="file"
                multiple
                accept="image/*"
                onChange={handleChangeImages}
              />
            </div>
          </div>
        </div>

        <div className="links_modal ">
          <input
            placeholder="Affiliate link for the product.(http:// or https://)"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <input
            placeholder="Alias to the link"
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
        </div>

        <div className="status_footer my-2 ">
          <button type="submit" className="btn btn-secondary w-100">
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatusModal;
