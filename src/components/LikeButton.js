import React from "react";

const LikeButton = ({ isLike, handleLike, handleUnlike }) => {
  return (
    <>
      {isLike ? (
        <i className="fas fa-heart text-danger" onClick={handleUnlike} />
      ) : (
        <i className="far fa-heart " onClick={handleLike} />
      )}
    </>
  );
};

export default LikeButton;
