import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import firebase from "../untils/firebase";
import "firebase/compat/auth";
import { useNavigate } from "react-router-dom";
const Profilebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  console.log(user);
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  <div></div>;
  return (
    <div>
      <nav className="userbar">
        {user?.photoURL ? (
          <img
            src={user?.photoURL}
            className="user-img"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
        ) : (
          <FontAwesomeIcon
            icon={faCircleUser}
            className="user-img"
            style={{ width: "150px", height: "150px", color: "#8f8f8f" }}
          />
        )}
        <p>{user?.displayName}</p>
        <ul>
          <li
            onClick={() => {
              navigate("/my/profile");
            }}
          >
            會員資料
          </li>
          <li onClick={() => navigate("/my/posts")}>我的文章</li>
          <li onClick={() => navigate("/my/collections")}>我的收藏</li>
        </ul>
      </nav>
    </div>
  );
};

export default Profilebar;
