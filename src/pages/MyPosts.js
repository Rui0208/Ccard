import React, { useEffect, useState } from "react";
import Profilebar from "../components/Profilebar";
import firebase from "../untils/firebase";
import Post from "../components/Article/Post";
const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    firebase
      .firestore()
      .collection("posts")
      .where("author.uid", "==", firebase.auth().currentUser?.uid)
      .orderBy("createdAt")
      .get()
      .then((collectionSnapShot) => {
        const data = collectionSnapShot.docs.map((docSnapShot) => {
          const id = docSnapShot.id;
          return { ...docSnapShot.data(), id };
        });
        console.log(data);
        setPosts(data);
      });
  }, []);

  return (
    <div className="container" style={{ display: "flex" }}>
      <Profilebar />

      <div className="post-container">
        <p className="profile-title">我的文章</p>
        {posts &&
          posts.map((item) => {
            return <Post item={item} key={item.id} />;
          })}
      </div>
    </div>
  );
};

export default MyPosts;
