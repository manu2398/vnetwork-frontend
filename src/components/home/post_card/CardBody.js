import React, { useState } from "react";
import Carousel from "../../Carousel";

const CardBody = ({ post }) => {
  const [readMore, setReadMore] = useState(false);

  return (
    <div className="card_body">
      <div className="card_content mb-2 p-2">
        <span>
          {post.content.length < 60
            ? post.content
            : readMore
            ? post.content + " "
            : post.content.slice(0, 60) + "..."}
        </span>

        {post.content.length > 60 && (
          <span
            className="readMore text-primary"
            style={{ cursor: "pointer", fontSize: "14px" }}
            onClick={() => setReadMore(!readMore)}
          >
            {readMore ? "Hide" : "Show more"}
          </span>
        )}
      </div>

      {post.images.length > 0 && (
        <Carousel
          images={post.images}
          id={post._id}
          link={post.link}
          alias={post.alias}
        />
      )}
    </div>
  );
};

export default CardBody;
