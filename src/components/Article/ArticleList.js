import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Waypoint } from "react-waypoint";
import Post from "./Post";

import Slidebar from "../Slidebar";
import firebase from "../../untils/firebase";
const ArticleList = () => {
  const [posts, setPosts] = useState([]);

  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const currentCategory = urlSearchParams.get("category");
  const lastPost = useRef();
  useEffect(() => {
    if (currentCategory) {
      firebase
        .firestore()
        .collection("posts")
        .where("category", "==", currentCategory)
        .orderBy("createdAt", "desc")
        .limit(4)
        .get()
        .then((collectionSnapShot) => {
          const data = collectionSnapShot.docs.map((docSnapShot) => {
            const id = docSnapShot.id;
            return { ...docSnapShot.data(), id };
          });
          lastPost.current =
            collectionSnapShot.docs[collectionSnapShot.docs.length - 1];
          setPosts(data);
        });
    } else {
      firebase
        .firestore()
        .collection("posts")
        .orderBy("createdAt", "desc")
        .limit(4)
        .get()
        .then((collectionSnapShot) => {
          const data = collectionSnapShot.docs.map((docSnapShot) => {
            const id = docSnapShot.id;
            return { ...docSnapShot.data(), id };
          });
          lastPost.current =
            collectionSnapShot.docs[collectionSnapShot.docs.length - 1];
          setPosts(data);
        });
    }
  }, [currentCategory]);

  return (
    <div className="container" style={{ display: "flex" }}>
      <Slidebar />
      <div className="post-container">
        {currentCategory ? (
          <header className="top-title">{currentCategory}版</header>
        ) : (
          <p className="top-title">所有文章</p>
        )}
        {posts &&
          posts.map((item) => {
            return <Post item={item} key={item.id} />;
          })}
        <Waypoint
          onEnter={() => {
            console.log(1);
            if (lastPost.current) {
              if (currentCategory) {
                firebase
                  .firestore()
                  .collection("posts")
                  .where("category", "==", currentCategory)
                  .orderBy("createdAt", "desc")
                  .startAfter(lastPost.current)
                  .limit(4)
                  .get()
                  .then((collectionSnapShot) => {
                    const data = collectionSnapShot.docs.map((docSnapShot) => {
                      const id = docSnapShot.id;
                      return { ...docSnapShot.data(), id };
                    });
                    lastPost.current =
                      collectionSnapShot.docs[
                        collectionSnapShot.docs.length - 1
                      ];
                    setPosts([...posts, ...data]);
                  });
              } else {
                firebase
                  .firestore()
                  .collection("posts")
                  .orderBy("createdAt", "desc")
                  .startAfter(lastPost.current)
                  .limit(4)
                  .get()
                  .then((collectionSnapShot) => {
                    const data = collectionSnapShot.docs.map((docSnapShot) => {
                      const id = docSnapShot.id;
                      return { ...docSnapShot.data(), id };
                    });
                    lastPost.current =
                      collectionSnapShot.docs[
                        collectionSnapShot.docs.length - 1
                      ];
                    setPosts([...posts, ...data]);
                  });
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default ArticleList;
