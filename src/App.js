import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./pages/Layout";
import Auth from "./pages/Auth";
import "./styles/style.css";

import ArticleList from "./components/Article/ArticleList";
import Post from "./pages/NewPost";
import DetailPost from "./pages/DetailPost";
import MyPosts from "./pages/MyPosts";
import MyProfile from "./pages/MyProfile";
import MyCollectinos from "./pages/MyCollectinos";
import Search from "./pages/Search";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ArticleList />}></Route>
          <Route path="/auth" element={<Auth />}></Route>
          <Route path="/my/posts" element={<MyPosts />}></Route>
          <Route path="/my/collections" element={<MyCollectinos />}></Route>
          <Route path="/my/profile" element={<MyProfile />}></Route>
          <Route path="/new-post" element={<Post />}></Route>
          <Route path="/post/:postId" element={<DetailPost />}></Route>
          <Route path="/search" element={<Search />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
