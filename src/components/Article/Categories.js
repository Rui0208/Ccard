import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "../../untils/firebase";
import "firebase/firestore";

const Categories = () => {
  const navigate = useNavigate();
  const [datas, setdatas] = useState([]);
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

  return (
    <>
      {datas &&
        datas.map((item) => {
          return (
            <li
              key={item.name}
              onClick={() => {
                navigate(`/?category=${item.name}`);
              }}
            >
              {item.name}
            </li>
          );
        })}
    </>
  );
};

export default Categories;
