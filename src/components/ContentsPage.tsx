import React from "react";
import "./styles.css";

export type ContentsItem = { title: string; page: number };

type ContentsPageProps = {
  items: ContentsItem[];
};

const ContentsPage: React.FC<ContentsPageProps> = ({ items }) => {
  const hasItems = items && items.length > 0;
  return (
    <div className="page-content contents-page">
      <div className="recipe-container">
        {hasItems && (
          <>
            <h2 className="recipe-title">Contents</h2>
            <div className="contents-list">
              {items.map((item) => (
                <div className="contents-item" key={item.title}>
                  <span className="title">{item.title}</span>
                  <span className="dots"></span>
                  <span className="page">{item.page}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentsPage;
