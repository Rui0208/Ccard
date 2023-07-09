import React, { useState, useEffect, Component } from "react";
import Slidebar from "../components/Slidebar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import firebase from "../untils/firebase";
import "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faEllipsisVertical,
  faBookmark,
  faCircleUser,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
const DetailPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState({ author: {} });
  console.log(post);
  const [showControl, setShowControl] = useState(false);
  const [showEditComment, setShowEditComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [updateComment, setUpdataComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const auth = firebase.auth().currentUser;
  useEffect(() => {
    firebase
      .firestore()
      .collection("posts")
      .doc(postId)
      .onSnapshot((docSnapShot) => {
        const data = docSnapShot.data();
        setPost(data);
      });
    // .get()
    // .then((docSnapShot) => {
    //   const data = docSnapShot.data();
    //   setPost(data);
    // });
  }, []);

  useEffect(() => {
    firebase
      .firestore()
      .collection("posts")
      .doc(postId)
      .collection(`comments`)
      .orderBy("createdAt")
      .onSnapshot((collectionSnapShot) => {
        const data = collectionSnapShot.docs.map((doc) => {
          const id = doc.id;
          return { ...doc.data(), id };
        });
        setComments(data);
      });
  }, []);
  const toggle = (isActive, field) => {
    const uid = firebase.auth().currentUser.uid;
    firebase
      .firestore()
      .collection("posts")
      .doc(postId)
      .update({
        [field]: isActive
          ? firebase.firestore.FieldValue.arrayRemove(uid)
          : firebase.firestore.FieldValue.arrayUnion(uid),
      });
  };
  const toggleCollected = () => {
    toggle(isCollected, "collectedBy");
  };

  const isCollected = post?.collectedBy?.includes(
    firebase.auth().currentUser?.uid
  );

  const toggleLiked = () => {
    toggle(isLiked, "likedBy");
  };
  const isLiked = firebase.auth().currentUser?.uid
    ? post?.likedBy?.includes(firebase.auth().currentUser.uid)
    : "";

  const onSubmit = (e) => {
    e.preventDefault();
    if (!auth) {
      alert("請先登入");
      navigate("/auth");
      return;
    }
    setIsLoading(true);
    const firestore = firebase.firestore();
    const batch = firestore.batch();
    const postRef = firestore.collection("posts").doc(postId);
    batch.update(postRef, {
      commentsCount: firebase.firestore.FieldValue.increment(1),
    });
    const commentRef = postRef.collection("comments").doc();
    batch.set(commentRef, {
      content: commentContent,
      createdAt: firebase.firestore.Timestamp.now(),
      author: {
        uid: firebase.auth().currentUser.uid,
        displayName: firebase.auth().currentUser.displayName,
        photoURL: firebase.auth().currentUser.photoURL || "",
      },
    });
    batch.commit().then(() => {
      setIsLoading(false);
      setCommentContent("");
      textarea.style.height = "3vh";
      message.style.height = "10vh";
      setShowControl(false);
    });
  };

  const textarea = document.querySelector("textarea");
  const message = document.querySelector(".message");
  console.log(message);
  const handleMessage = (e) => {
    e.preventDefault();
    textarea.style.height = "16vh";
    message.style.height = "25vh";
    setShowControl(true);
  };
  const handleCancel = (e) => {
    e.preventDefault();
    textarea.style.height = "5vh";
    message.style.height = "12vh";
    setShowControl(false);
  };
  const handleDropDown = () => {
    const dropDown = document.querySelector("#dropDown");
    dropDown.classList.toggle("dropDown");
  };
  const handleMypostDropDown = () => {
    const myPostdropDown = document.querySelector("#myPostdropDown");
    console.log(myPostdropDown);

    myPostdropDown.classList.toggle("myPostdropDown");
  };
  const handleDeleteComment = (commentID) => {
    const firestore = firebase.firestore();
    const batch = firestore.batch();
    const postRef = firestore.collection("posts").doc(postId);
    batch.update(postRef, {
      commentsCount: firebase.firestore.FieldValue.increment(-1),
    });
    const commentRef = postRef.collection("comments").doc(commentID);
    batch.delete(commentRef);
    batch.commit();
  };
  const handleUpdateComment = (commentID) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentID)
      .update({
        content: updateComment,
      })
      .then(() => {
        setShowEditComment(false);
      });
  };
  const handleDeletePost = () => {
    const result = window.confirm("確定刪除此貼文？");
    if (result) {
      firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .delete()
        .then(() => {
          navigate("/");
        });
    } else {
      return null;
    }
  };
  return (
    <div className="detail-container">
      <div className="container" style={{ display: "flex" }}>
        <Slidebar />
        {post && (
          <div className="right">
            <div className="detail">
              {post?.author.photoURL ? (
                <img
                  src={post.author.photoURL}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleUser}
                  style={{ width: "40px", height: "40px", color: "#8f8f8f" }}
                />
              )}
              <span className="displayname">{post?.author?.displayName}</span>
              {post?.author?.uid === auth?.uid && (
                <span
                  className="edit-post"
                  onClick={() => {
                    handleMypostDropDown();
                  }}
                >
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    style={{ color: "#000000" }}
                  />
                  <ul id="myPostdropDown" className="myPostdropDown">
                    <li onClick={handleDeletePost}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ color: "#df3434" }}
                      />{" "}
                      刪除
                    </li>
                  </ul>
                </span>
              )}
              <h1>{post?.title}</h1>
              <p>
                <span
                  className="category"
                  onClick={() => {
                    navigate(`/?catrgory=${post?.category}`);
                  }}
                >
                  {post.category}
                </span>
                ·
                <span className="date">
                  {post.createdAt?.toDate().toLocaleString()}
                </span>
              </p>
              {post.imageURL && (
                <img
                  src={post.imageURL}
                  alt="pic"
                  style={{ width: "400px", height: "auto" }}
                />
              )}
              <p className="description">{post.description}</p>
              <div className="like-comment">
                按讚 {post.likedBy?.length || 0}・留言 {post.commentsCount || 0}
                <div className="items">
                  <FontAwesomeIcon
                    onClick={toggleLiked}
                    icon={faHeart}
                    style={
                      isLiked ? { color: "#e91101" } : { color: "#dad8d8" }
                    }
                  />

                  <FontAwesomeIcon
                    onClick={toggleCollected}
                    icon={faBookmark}
                    style={
                      isCollected ? { color: "00588a" } : { color: "#dad8d8" }
                    }
                  />
                </div>
              </div>
            </div>

            <div className="comments">
              <div className="count">
                共 {post.commentsCount ? post.commentsCount : 0} 則留言
              </div>
              {comments.map((item, index) => {
                return (
                  <div className="comment">
                    {item.author?.photoURL ? (
                      <img
                        className="userimg"
                        src={item.author?.photoURL}
                        alt="pic"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        className="userimg"
                        icon={faCircleUser}
                        style={{
                          color: "#8f8f8f",
                          width: "30px",
                          height: "30px",
                        }}
                      />
                    )}
                    <span>{item.author.displayName}</span>
                    {item.author.uid === auth?.uid && (
                      <span className="edit-comment" onClick={handleDropDown}>
                        <FontAwesomeIcon
                          icon={faEllipsisVertical}
                          style={{ color: "#000000" }}
                        />
                        {showEditComment && (
                          <div className="setName-container">
                            <div
                              className="setName"
                              style={{ width: "40vw", height: "40vh" }}
                            >
                              <p>更改留言</p>
                              <textarea
                                style={{
                                  width: "30vw",
                                  height: "30vh",
                                  fontSize: "1.25rem",
                                  padding: "0.5rem",
                                }}
                                type="text"
                                onChange={(e) => {
                                  setUpdataComment(e.target.value);
                                }}
                              />
                              <div>
                                <button
                                  onClick={() => {
                                    setShowEditComment(false);
                                  }}
                                >
                                  取消
                                </button>
                                <button
                                  onClick={() => {
                                    handleUpdateComment(item.id);
                                  }}
                                >
                                  修改
                                </button>
                              </div>
                            </div>
                            <div className="shadow"></div>
                          </div>
                        )}
                        <ul id="dropDown" className="dropDown">
                          <li
                            onClick={() => {
                              setShowEditComment(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} /> {""}
                            編輯
                          </li>
                          <li
                            onClick={() => {
                              handleDeleteComment(item.id);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              style={{ color: "#df3434" }}
                            />{" "}
                            刪除
                          </li>
                        </ul>
                      </span>
                    )}
                    <div className="content">{item.content}</div>
                    <div className="floor">
                      <span>B{index + 1}・</span>
                      <span>{item.createdAt.toDate().toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <form className="message">
              <div style={{ display: "flex" }}>
                {auth?.photoURL ? (
                  <img
                    className="userimg"
                    src={auth.photoURL}
                    alt="pic"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faCircleUser}
                    style={{ color: "#8f8f8f", width: "30px", height: "30px" }}
                  />
                )}
                <textarea
                  type="text"
                  placeholder="留言..."
                  value={commentContent}
                  onChange={(e) => {
                    setCommentContent(e.target.value);
                  }}
                  onClick={handleMessage}
                />
              </div>
              {showControl && (
                <div className="message-control">
                  <button onClick={handleCancel} disabled={isLoading}>
                    取消
                  </button>
                  <button onClick={onSubmit} disabled={isLoading}>
                    送出
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPost;
