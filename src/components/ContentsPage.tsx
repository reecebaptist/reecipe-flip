import React from "react";
import "./styles.css";

export type ContentsItem = { title: string; page: number };

type ContentsPageProps = {
  items: ContentsItem[];
  startIndex?: number;
  onSelect?: (globalIndex: number) => void;
};

const ContentsPage: React.FC<ContentsPageProps> = ({ items, startIndex = 0, onSelect }) => {
  const hasItems = items && items.length > 0;
  return (
    <div className="page-content contents-page">
      <div className="recipe-container">
        {hasItems && (
          <>
            <h2 className="recipe-title">Contents</h2>
            <div className="contents-list">
              {items.map((item, idx) => (
                <div
                  className="contents-item"
                  key={item.title}
                  onClick={onSelect ? () => onSelect(startIndex + idx) : undefined}
                  role={onSelect ? "button" : undefined}
                  tabIndex={onSelect ? 0 : undefined}
                >
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
