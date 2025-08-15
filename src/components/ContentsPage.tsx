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
  const [showSearch, setShowSearch] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const stopFlipCapture = React.useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
  }, []);

  React.useEffect(() => {
    if (showSearch) {
      // Defer focus slightly to ensure element exists
      const id = requestAnimationFrame(() => searchInputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [showSearch]);

  const displayedItems = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => it.title.toLowerCase().includes(q));
  }, [items, query]);
  return (
    <div className="page-content contents-page">
      <div className="recipe-container">
        {hasItems && (
          <>
            <div className="recipe-title-container">
              <h2 className="recipe-title">Contents</h2>
            </div>
            <div className="contents-search-row">
              {onAddRecipe && (
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
              )}
              <button
                type="button"
                className="icon-button contents-link"
                onClick={() => {
                  setShowSearch((s) => !s);
                }}
                onPointerDownCapture={stopFlipCapture}
                onTouchStartCapture={stopFlipCapture}
                onMouseDownCapture={stopFlipCapture}
                aria-label={showSearch ? "Close search" : "Search"}
                title={showSearch ? "Close search" : "Search"}
              >
                <span className="material-symbols-outlined">
                  {showSearch ? "close" : "search"}
                </span>
              </button>
              {showSearch && (
                <div className="contents-search-input-wrapper">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onPointerDownCapture={stopFlipCapture}
                    onTouchStartCapture={stopFlipCapture}
                    onMouseDownCapture={stopFlipCapture}
                    className="contents-search-input with-clear"
                    placeholder="Search recipes"
                    aria-label="Search recipes"
                  />
                  {query && (
                    <button
                      type="button"
                      className="contents-search-clear"
                      onClick={() => {
                        setQuery("");
                        searchInputRef.current?.focus();
                      }}
                      onPointerDownCapture={stopFlipCapture}
                      onTouchStartCapture={stopFlipCapture}
                      onMouseDownCapture={stopFlipCapture}
                      aria-label="Clear search"
                      title="Clear search"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="contents-scroll">
              <div className={listClass}>
                {displayedItems.map((item, idx) => (
                  <div
                    className="contents-item"
                    key={`${item.title}-${item.page}`}
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
            </div>
          </>
        )}
        {roman && <div className="page-number">{roman}</div>}
      </div>
    </div>
  );
};

export default ContentsPage;
