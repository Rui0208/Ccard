import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faHeart,
  faComment,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import firebase from "../../untils/firebase";
import "firebase/firestore";
const Post = ({ item }) => {
  console.log(item);
  const navigate = useNavigate();
  const isCollected = item.collectedBy?.includes(
    firebase.auth().currentUser?.uid
  );
  console.log(item);
  return (
    <div
      className="post"
      key={item.id}
      onClick={() => {
        navigate(`/post/${item.id}`);
      }}
    >
      <div className="leftItem">
        <div className="top">
          <div className="user-img">
            {item.author.photoURL ? (
              <img
                src={item.author.photoURL}
                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faCircleUser}
                style={{ color: "#8f8f8f", width: "30px", height: "30px" }}
              />
            )}
          </div>
          <p>{item.category}・</p>
          <p>{item.author.displayName}・</p>
          {}
          <p>{item.createdAt?.toDate().toLocaleString()}</p>
        </div>

        <article>
          <div className="item">
            <header>{item.title}</header>
            <p rows="1" className="preview-description">
              {item.description}
            </p>

            <div className="datas">
              <FontAwesomeIcon
                icon={faHeart}
                style={{
                  color: "#e91101",
                }}
              />
              <span>{item.likedBy?.length || 0}</span>
              <FontAwesomeIcon icon={faComment} style={{ color: "#2a5ec6" }} />
              <span>{item.commentsCount || 0}</span>
              <FontAwesomeIcon
                icon={faBookmark}
                style={isCollected ? { color: "00588a" } : { color: "#dad8d8" }}
              />
            </div>
          </div>
        </article>
      </div>

      <div className="rightItem">
        {item.imageURL && <img src={item.imageURL} alt="picture" />}
      </div>
    </div>
  );
};

export default Post;
