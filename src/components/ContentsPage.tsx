import React from "react";
import "./styles.css";

const contents = [
  { title: "Spaghetti Carbonara", page: 4 },
  { title: "Chicken Curry", page: 6 },
  { title: "Chocolate Cake", page: 8 },
  { title: "Caesar Salad", page: 10 },
];

const ContentsPage = () => {
  return (
    <div className="page-content contents-page">
      <div className="recipe-container">
        <h2 className="recipe-title">Contents</h2>
        <div className="contents-list">
          {contents.map((item) => (
            <div className="contents-item" key={item.title}>
              <span className="title">{item.title}</span>
              <span className="dots"></span>
              <span className="page">{item.page}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentsPage;
