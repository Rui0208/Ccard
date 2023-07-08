import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Slidebar from "../components/Slidebar";
import firebase from "../untils/firebase";
import Post from "../components/Article/Post";
const Search = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const urlSearchParams = new URLSearchParams(location.search);
  const currentKeyword = urlSearchParams.get("keyword").toLowerCase();
  console.log(currentKeyword);
  useEffect(() => {
    firebase
      .firestore()
      .collection("posts")
      .where("title", ">=", currentKeyword)
      .where("title", "<=", currentKeyword + "\uf8ff")
      .orderBy("title")
      .get()
      .then((collectionSnapShot) => {
        const data = collectionSnapShot.docs.map((docSnapShot) => {
          const id = docSnapShot.id;
          return { ...docSnapShot.data(), id };
        });
        console.log(data);
        setPosts(data);
      });
  }, [currentKeyword]);
  return (
    <div className="container" style={{ display: "flex" }}>
      <Slidebar />

      <div className="post-container">
        {posts &&
          posts.map((item) => {
            return <Post item={item} key={item.id} />;
          })}
      </div>
    </div>
  );
};

export default Search;
