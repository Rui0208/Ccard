import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMagnifyingGlass,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import firebase from "../untils/firebase";
import "firebase/compat/auth";
const Nav = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchData, setSearchData] = useState("");
  console.log(isLoggedIn);
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);
  const handleLogout = async () => {
    const confirmed = window.confirm("確定要登出嗎？");
    if (confirmed) {
      try {
        await firebase.auth().signOut();
        navigate("/");
      } catch (error) {
        console.log("登出失败:", error);
      }
    }
  };
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchData("");
      navigate(`/search?keyword=${searchData}`);
    }
  };
  return (
    <nav className="navbar">
      <ul>
        <li
          className="logo"
          onClick={() => {
            navigate("/");
          }}
        >
          <p>Ccard</p>
        </li>
        <li className="search">
          <input
            type="text"
            placeholder="搜索文章"
            value={searchData}
            onChange={(e) => {
              setSearchData(e.target.value);
            }}
            onKeyDown={handleSearch}
          />
          <button
            onClick={() => {
              navigate(`/search?keyword=${searchData}`);
              setSearchData("");
            }}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{ color: "#ffffff" }}
            />
          </button>
        </li>
        {isLoggedIn && (
          <li
            className="post"
            onClick={() => {
              navigate("/new-post");
            }}
          >
            <FontAwesomeIcon icon={faPen} style={{ color: "#ffffff" }} />
          </li>
        )}
        {isLoggedIn ? (
          <li
            className="user"
            onClick={() => {
              navigate("/my/posts");
            }}
          >
            <FontAwesomeIcon icon={faUser} style={{ color: "#ffffff" }} />
          </li>
        ) : (
          <li
            className="user"
            onClick={() => {
              navigate("/auth");
            }}
          >
            <p>註冊/登入</p>
          </li>
        )}
        {isLoggedIn && (
          <li onClick={handleLogout} className="logout">
            <p>登出</p>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
