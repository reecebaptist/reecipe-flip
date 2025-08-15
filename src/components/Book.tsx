import React from "react";
import HTMLFlipBook from "react-pageflip";
import CoverPage from "./CoverPage";
import AuthorPage from "./AuthorPage";
import RecipePage from "./RecipePage";
import ForewordPage from "./ForewordPage";
import ContentsPage, { ContentsItem } from "./ContentsPage";
import BackCoverPage from "./BackCoverPage";
import AddRecipeEditor from "./AddRecipeEditor";
import { recipeData } from "../data/recipes";

function Book() {
  const bookRef = React.useRef<any>(null);
  // Track viewport size for responsive sizing
  const [vw, setVw] = React.useState<number>(window.innerWidth);
  const [vh, setVh] = React.useState<number>(window.innerHeight);
  // Add Recipe editor mode state
  const [addingRecipe, setAddingRecipe] = React.useState<boolean>(false);

  React.useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Refresh page on orientation change (portrait ↔ landscape)
  React.useEffect(() => {
    const mql = window.matchMedia("(orientation: portrait)");
    const handler = () => {
      // Reload to force a clean layout recalculation after orientation switch
      window.location.reload();
    };
    if (mql.addEventListener) {
      mql.addEventListener("change", handler);
    } else {
      // Safari < 14
      // @ts-ignore
      mql.addListener(handler);
    }
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handler);
      } else {
        // @ts-ignore
        mql.removeListener(handler);
      }
    };
  }, []);

  // Responsive sizing: one page ~ half screen width, preserve aspect, shrink on small windows
  const H_GAP = 16; // horizontal gap from viewport edges
  const V_GAP = 16; // vertical gap from top/bottom
  const PAGE_ASPECT = 1.414; // height / width (approx A-series paper aspect)

  const isPortrait = vh >= vw; // viewport orientation

  // In portrait: single page uses nearly full width; in landscape: half the width (for two pages)
  const targetSingleWidth = isPortrait ? vw - H_GAP * 2 : (vw - H_GAP * 2) / 2;

  let calcWidth = Math.floor(targetSingleWidth); // single-page width
  let calcHeight = Math.floor(calcWidth * PAGE_ASPECT);
  const maxHeight = Math.floor(vh - V_GAP * 2);

  // Fit height within viewport
  if (calcHeight > maxHeight) {
    calcHeight = maxHeight;
    calcWidth = Math.floor(calcHeight / PAGE_ASPECT);
  }

  const pageWidth = Math.max(240, calcWidth);
  const pageHeight = Math.max(320, calcHeight);
  // recipeData is imported from ../data/recipes

  // Build Contents items from recipeData (image page is before each recipe page)
  const contentsItems: ContentsItem[] = recipeData.map((r, index) => ({
    title: r.title,
    page: index * 2 + 4,
  }));

  // Single-page Contents (scrolls within page)

  // (Navigation to specific pages removed as requested)

  const CONTENTS_PAGE_INDEX = 4; // 0-based index of the Contents page in the flipbook
  const goToContents = React.useCallback(() => {
    const api = bookRef.current?.pageFlip?.();
    if (api && typeof api.flip === "function") {
      api.flip(CONTENTS_PAGE_INDEX);
    }
  }, []);

  const RECIPE_FIRST_PAGE_INDEX = CONTENTS_PAGE_INDEX + 2; // first recipe text page index (skip image)
  const goToRecipe = React.useCallback((recipeIndex: number) => {
    const api = bookRef.current?.pageFlip?.();
    if (api && typeof api.flip === "function") {
      const target = RECIPE_FIRST_PAGE_INDEX + recipeIndex * 2;
      api.flip(target);
    }
  }, [RECIPE_FIRST_PAGE_INDEX]);

  // Render Add Recipe Editor as a dedicated two-page spread with flipping disabled
  if (addingRecipe) {
    return (
      <AddRecipeEditor
        width={pageWidth}
        height={pageHeight}
        isPortrait={isPortrait}
        onCancel={() => setAddingRecipe(false)}
        onSave={(data) => {
          // Placeholder for future integration
          console.log("Saved draft:", data);
        }}
      />
    );
  }

  return (
    <HTMLFlipBook
      ref={bookRef}
      width={pageWidth}
      height={pageHeight}
      maxShadowOpacity={0.5}
      drawShadow={true}
      showCover={true}
      size="fixed"
      className={""}
      style={{}}
      startPage={0}
      minWidth={pageWidth}
      maxWidth={pageWidth}
      minHeight={pageHeight}
      maxHeight={pageHeight}
      flippingTime={500}
      usePortrait={isPortrait}
      startZIndex={0}
      autoSize={false}
      mobileScrollSupport={true}
      clickEventForward={true}
      useMouseEvents={true}
      swipeDistance={0}
      showPageCorners={false}
      disableFlipByClick={false}
    >
      <div className="page" style={{ background: "transparent" }}>
        <CoverPage />
      </div>

      {/* Empty page before Author */}
      <div className="page" style={{ background: "#ffffff" }} />

      {/* Author page after empty */}
      <div className="page" style={{ background: "#ffffff" }}>
        <AuthorPage />
      </div>

      {/* Foreword page */}
      <div className="page">
        <ForewordPage romanIndex={1} />
      </div>

      {/* Contents page (single, scrollable) */}
      <div className="page" key={`contents-single`}>
        <ContentsPage
          items={contentsItems}
          startIndex={0}
          romanIndex={2}
          isLastPage={true}
          onAddRecipe={() => {
            setAddingRecipe(true);
          }}
          onSelect={goToRecipe}
          // onSelect removed per request
        />
      </div>

      {recipeData.flatMap((recipe, index) => [
        <div className="page" key={`${recipe.id}-img`}>
          <div
            className="recipe-image-full"
            style={{ backgroundImage: `url(${recipe.image})` }}
          />
        </div>,
        <div className="page" key={recipe.id}>
          <RecipePage
            title={recipe.title}
            prepTime={recipe.prepTime}
            cookTime={recipe.cookTime}
            ingredients={recipe.ingredients}
            instructions={recipe.instructions}
            pageNumber={index * 2 + 4}
            onGoToContents={goToContents}
          />
        </div>,
      ])}

      {/* Back cover */}
      <div className="page" style={{ background: "#ffffff" }}>
        <BackCoverPage />
      </div>
    </HTMLFlipBook>
  );
}

export default Book;
