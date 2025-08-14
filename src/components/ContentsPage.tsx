import React from "react";
import "./styles.css";

export type ContentsItem = { title: string; page: number };

type ContentsPageProps = {
  items: ContentsItem[];
  startIndex?: number;
  onSelect?: (globalIndex: number) => void;
  romanIndex?: number; // 1-based index for roman page numbering
  onAddRecipe?: () => void; // optional handler for Add Recipe button
  isLastPage?: boolean; // only show Add button on the last contents page
};

function toRoman(num: number): string {
  if (!num || num < 1) return "";
  const map: [number, string][] = [
    [1000, "m"],
    [900, "cm"],
    [500, "d"],
    [400, "cd"],
    [100, "c"],
    [90, "xc"],
    [50, "l"],
    [40, "xl"],
    [10, "x"],
    [9, "ix"],
    [5, "v"],
    [4, "iv"],
    [1, "i"],
  ];
  let res = "";
  for (const [val, sym] of map) {
    while (num >= val) {
      res += sym;
      num -= val;
    }
  }
  return res;
}

const ContentsPage: React.FC<ContentsPageProps> = ({
  items,
  startIndex = 0,
  onSelect,
  romanIndex,
  onAddRecipe,
  isLastPage = false,
}) => {
  const hasItems = items && items.length > 0;
  const roman = romanIndex ? toRoman(romanIndex) : "";
  const listClass = `contents-list${isLastPage ? " is-last" : ""}`;
  return (
    <div className="page-content contents-page">
      <div className="recipe-container">
        {hasItems && (
          <>
            <h2 className="recipe-title">Contents</h2>
            <div className={listClass}>
              {items.map((item, idx) => (
                <div
                  className="contents-item"
                  key={item.title}
                  onClick={
                    onSelect ? () => onSelect(startIndex + idx) : undefined
                  }
                  role={onSelect ? "button" : undefined}
                  tabIndex={onSelect ? 0 : undefined}
                >
                  <span className="title">{item.title}</span>
                  <span className="dots"></span>
                  <span className="page">{item.page}</span>
                </div>
              ))}
            </div>
            {isLastPage && onAddRecipe && (
              <div className="contents-actions">
                <button
                  type="button"
                  className="contents-add-button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAddRecipe?.();
                  }}
                  aria-label="Add recipe"
                  title="Add recipe"
                >
                  <span className="material-symbols-outlined" aria-hidden>
                    add
                  </span>
                  <span>Add recipe</span>
                </button>
              </div>
            )}
          </>
        )}
        {roman && <div className="page-number">{roman}</div>}
      </div>
    </div>
  );
};

export default ContentsPage;
