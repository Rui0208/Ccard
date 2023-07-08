import React, { useState, useEffect } from "react";
import Profilebar from "../components/Profilebar";
import firebase from "../untils/firebase";
const MyProfile = () => {
  const auth = firebase.auth().currentUser;
  const [displayName, setDisplayName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isLoding, setIsLoding] = useState(false);

  const [file, setFile] = useState("");
  const [showEditName, setShowEditName] = useState(false);
  const [showEditImg, setShowEditImg] = useState(false);
  const previewImageUrl = file ? URL.createObjectURL(file) : null;
  console.log(file);
  const onSubmit = () => {
    auth.updateProfile({ displayName }).then(() => {
      setDisplayName("");
      setShowEditName(false);
    });
  };
  const updatePhoto = () => {
    setIsLoding(true);
    const fileRef = firebase.storage().ref(`user-photos/` + auth.uid);
    const metadata = {
      contentType: file.type,
    };
    fileRef.put(file, metadata).then(() => {
      fileRef.getDownloadURL().then((imageUrl) => {
        auth
          .updateProfile({
            photoURL: imageUrl,
          })
          .then(() => {
            setIsLoding(false);
            setFile(null);
            setShowEditImg(false);
          });
      });
    });
  };
  return (
    <div>
      {showEditName && (
        <div className="setName-container">
          <div className="setName">
            <p>請輸入名字</p>
            <input
              type="text"
              onChange={(e) => {
                setDisplayName(e.target.value);
              }}
            />
            <div>
              <button
                onClick={() => {
                  setShowEditName(false);
                }}
              >
                取消
              </button>
              <button onClick={onSubmit}>修改</button>
            </div>
          </div>
          <div className="shadow"></div>
        </div>
      )}
      {showEditImg && (
        <div className="setImg-container">
          <div className="setImg">
            <input
              type="file"
              id="user-photo"
              style={{ display: "none" }}
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
            {previewImageUrl && (
              <img
                src={previewImageUrl}
                alt=""
                style={{ width: "400px", height: "auto" }}
              />
            )}
            <div className="control">
              <label className="update" htmlFor="user-photo">
                上傳
              </label>
              <button
                onClick={() => {
                  setShowEditImg(false);
                  setFile(null);
                }}
              >
                取消
              </button>
              <button onClick={updatePhoto} disabled={isLoding}>
                確認上傳
              </button>
            </div>
          </div>
          <div className="shadow"></div>
        </div>
      )}
      <div className="profile-container">
        <div className="container" style={{ display: "flex" }}>
          <Profilebar />
          <div className="profile">
            <p className="profile-title">會員資料</p>
            <div className="displayName">
              <div>
                <div className="editName">修改姓名</div>
                <p>{auth?.displayName}</p>
              </div>
              <button
                onClick={() => {
                  setShowEditName(true);
                }}
              >
                修改
              </button>
            </div>
            <div className="updateImg">
              <p>上傳個人照片</p>
              <button
                onClick={() => {
                  setShowEditImg(true);
                }}
              >
                上傳
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
