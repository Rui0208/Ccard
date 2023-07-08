import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import Slidebar from "../components/Slidebar";
import ArticleList from "../components/Article/ArticleList";
const Layout = () => {
  return (
    <>
      <Nav />
      <Outlet />

      {/* <Footer /> */}
    </>
  );
};

export default Layout;
