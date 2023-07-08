import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import firebase from "../untils/firebase";

import "firebase/storage";
import "firebase/firestore";

const NewPost = () => {
  const navigate = useNavigate();
  const [datas, setdatas] = useState([]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isLoding, setIsLoding] = useState(false);
  useEffect(() => {
    firebase
      .firestore()
      .collection("categories")
      .get()
      .then((collectionSnapShot) => {
        const data = collectionSnapShot.docs.map((doc) => {
          return doc.data();
        });
        setdatas(data);
      });
  }, []);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  const handleInputChange = (e) => {
    const text = e.target.value;
    const convertedText = text.replace(/\n/g, "\n");
    setDescription(convertedText);
  };
  const previewUrl = file
    ? URL.createObjectURL(file)
    : "https://react.semantic-ui.com/images/wireframe/image.png";

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoding(true);
    const documentRef = firebase.firestore().collection(`posts`).doc();
    const fileRef = firebase.storage().ref(`post-img/` + documentRef.id);

    if (file !== null) {
      const metadata = {
        contentType: file.type,
      };
      fileRef.put(file, metadata).then(() => {
        fileRef.getDownloadURL().then((imageURL) => {
          documentRef
            .set({
              title,
              description,
              category,
              createdAt: firebase.firestore.Timestamp.now(),
              author: {
                displayName: firebase.auth().currentUser.displayName,
                photoURL: firebase.auth().currentUser.photoURL || "",
                uid: firebase.auth().currentUser.uid,
                email: firebase.auth().currentUser.email,
              },
              imageURL,
            })
            .then(() => {
              setIsLoding(false);
              window.alert("發布成功回到首頁");
              navigate("/");
            })
            .catch((e) => {
              console.log(e);
            });
        });
      });
    } else {
      documentRef
        .set({
          title,
          description,
          category,
          createdAt: firebase.firestore.Timestamp.now(),
          author: {
            displayName: firebase.auth().currentUser.displayName,
            photoURL: firebase.auth().currentUser.photoURL || "",
            uid: firebase.auth().currentUser.uid,
            email: firebase.auth().currentUser.email,
          },
        })
        .then(() => {
          setIsLoding(false);
          window.alert("發布成功回到首頁");
          navigate("/");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div className="newpost-backgrundcontainer">
      <div className="newpost-container">
        <form className="new-post" onSubmit={onSubmit}>
          <div className="setImg">
            <img src={previewUrl} style={{ width: "250px", height: "auto" }} />

            <label htmlFor="post-img">
              <FontAwesomeIcon icon={faImage} style={{ color: "#636569" }} />
            </label>
          </div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value="">選擇發文看板</option>

            {datas &&
              datas.map((item) => {
                return (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                );
              })}
          </select>
          <input
            type="file"
            id="post-img"
            onChange={handleFile}
            style={{ display: "none" }}
          />
          <textarea
            className="new-title"
            type="text"
            placeholder="標題"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <textarea
            className="new-content"
            type="text"
            placeholder="敘述"
            // value={description}
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
          <div className="newpost-control">
            <button
              onClick={() => {
                navigate("/");
              }}
            >
              取消
            </button>

            <button disabled={isLoding} type="submit">
              發布文章
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPost;
