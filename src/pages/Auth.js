import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "../untils/firebase";
import "firebase/compat/auth";
import Nav from "../components/Nav";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  let [userName, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleUserName = (e) => {
    setUserName(e.target.value);
  };
  const handleAccount = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSwitchForm = () => {
    setIsLogin(!isLogin);
    setUserName("");
    setEmail("");
    setPassword("");
    setErrorMessage("");
  };
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMessage("密碼至少需要6個字元");
      return;
    }

    try {
      if (isLogin) {
        // 登入
        await firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            alert("登入成功導向到首頁");
            navigate("/");
          })
          .catch((error) => {
            // 登录失败，根据错误代码设置自定义错误消息
            switch (error.code) {
              case "auth/invalid-email":
                setErrorMessage("請輸入有效的電子郵件");
                break;
              case "auth/wrong-password":
                setErrorMessage("密碼錯誤");
                break;
              case "auth/user-not-found":
                setErrorMessage("用戶不存在");
                break;
            }
          });
      } else {
        // 註冊
        await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            user.updateProfile({
              displayName: userName,
            });
            setEmail("");
            setPassword("");
            setErrorMessage("");
            window.alert("註冊成功。您現在將被導向到登入頁面");
            setIsLogin(!isLogin);
          })
          .catch((error) => {
            switch (error.code) {
              case "auth/invalid-email":
                setErrorMessage("請輸入有效的電子郵件");
                break;
              case "auth/email-already-in-use":
                setErrorMessage("此信箱已被使用");
                break;
            }
          });
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("登入失敗");
    }
  };
  return (
    <div>
      <div className="login-Container">
        <div className="container">
          <div className="controller">
            <button
              onClick={handleSwitchForm}
              disabled={!isLogin}
              style={{
                backgroundColor: "white",
                borderBottom: !isLogin ? "none" : "1px solid #ddd",
                borderRight: !isLogin ? "1px solid #ddd" : "none",
                color: !isLogin ? "#4266b2" : "black",
              }}
            >
              註冊
            </button>
            <button
              onClick={handleSwitchForm}
              disabled={isLogin}
              style={{
                backgroundColor: "white",
                borderBottom: isLogin ? "none" : "1px solid #ddd",
                borderLeft: isLogin ? "1px solid #ddd" : "none",
                color: isLogin ? "#4266b2" : "black",
              }}
            >
              登入
            </button>
          </div>

          <form>
            {isLogin ? (
              // 登入表單內容
              <div className="loginInput">
                {errorMessage && (
                  <div className="alert-error">{errorMessage}</div>
                )}
                <label htmlFor="">常用信箱</label>
                <input
                  onChange={handleAccount}
                  type="email"
                  name="account"
                  placeholder="輸入電郵"
                  value={email}
                />
                <label htmlFor="">密碼</label>

                <input
                  onChange={handlePassword}
                  type="password"
                  name="password"
                  minLength={6}
                  placeholder="輸入密碼"
                  value={password}
                />
              </div>
            ) : (
              // 註冊表單內容
              <div className="registerInput">
                {errorMessage && (
                  <div className="alert-error">{errorMessage}</div>
                )}
                <label htmlFor="">用戶名</label>

                <input
                  onChange={handleUserName}
                  placeholder="輸入用戶名"
                  type="String"
                  name="username"
                  value={userName}
                  required
                />
                <label htmlFor="">常用信箱</label>

                <input
                  onChange={handleAccount}
                  placeholder="輸入電郵"
                  type="email"
                  name="account"
                  value={email}
                  required
                />
                <label htmlFor="">密碼</label>

                <input
                  onChange={handlePassword}
                  placeholder="輸入密碼最少6個字元"
                  minLength={6}
                  type="password"
                  name="password"
                  value={password}
                  required
                />
              </div>
            )}
            <div className="submit">
              <button onClick={handleAuthSubmit} type="submit">
                {isLogin ? "登入" : "註冊"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
