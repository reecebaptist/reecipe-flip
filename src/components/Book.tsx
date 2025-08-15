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
  const [editingRecipe, setEditingRecipe] = React.useState<null | {
    title: string;
    prepTime: string;
    cookTime: string;
    ingredients: string[];
    instructions: string;
    image?: string;
  }>(null);
  // Loading overlay state
  const [loading, setLoading] = React.useState<boolean>(true);
  // Flip lock state
  const [isLocked, setIsLocked] = React.useState<boolean>(false);
  // Pending navigation target after leaving editor
  const [pendingNav, setPendingNav] = React.useState<null | "contents">(null);
  // Track current page and guard re-entrant revert loops
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const revertingRef = React.useRef<boolean>(false);
  // Allow a one-time programmatic flip to bypass lock revert logic
  const allowProgrammaticFlipRef = React.useRef<boolean>(false);

  // Stop interactions when locked except on elements explicitly allowed
  const stopLockedInteractions = React.useCallback(
    (e: React.SyntheticEvent) => {
      if (!isLocked) return;
      const el = e.target as HTMLElement | null;
      const allowed =
        el && typeof (el as any).closest === "function"
          ? el.closest('[data-allow-locked="true"]')
          : null;
      if (!allowed) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [isLocked]
  );

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

  // Initial loading spinner – hide shortly after mount
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);
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
    if (isLocked) return; // prevent navigation while locked
    const api = bookRef.current?.pageFlip?.();
    if (api && typeof api.flip === "function") {
      api.flip(CONTENTS_PAGE_INDEX);
    }
  }, [isLocked]);

  // After closing the editor, perform pending navigation to Contents
  React.useEffect(() => {
    if (!addingRecipe && pendingNav === "contents") {
      let cancelled = false;
      const tryFlip = (attempt: number) => {
        if (cancelled) return;
        const api = bookRef.current?.pageFlip?.();
        if (api && typeof api.flip === "function") {
          // Temporarily allow the programmatic flip even if locked
          allowProgrammaticFlipRef.current = true;
          api.flip(CONTENTS_PAGE_INDEX);
          // Reset the allow flag shortly after flip completes
          setTimeout(() => {
            allowProgrammaticFlipRef.current = false;
          }, 300);
          setPendingNav(null);
        } else if (attempt < 10) {
          // Retry a few times until the flipbook API is ready
          setTimeout(() => tryFlip(attempt + 1), 50);
        } else {
          // Give up and clear the pending nav to avoid loops
          setPendingNav(null);
        }
      };
      tryFlip(0);
      return () => {
        cancelled = true;
      };
    }
  }, [addingRecipe, pendingNav]);

  const RECIPE_FIRST_PAGE_INDEX = CONTENTS_PAGE_INDEX + 2; // first recipe text page index (skip image)
  const goToRecipe = React.useCallback(
    (recipeIndex: number) => {
      if (isLocked) return; // prevent navigation while locked
      const api = bookRef.current?.pageFlip?.();
      if (api && typeof api.flip === "function") {
        const target = RECIPE_FIRST_PAGE_INDEX + recipeIndex * 2;
        api.flip(target);
      }
    },
    [RECIPE_FIRST_PAGE_INDEX, isLocked]
  );

  // Transition helpers to show spinner when entering/exiting Add Recipe
  const openAddRecipe = React.useCallback(() => {
    setLoading(true);
    // Small delay to display spinner during transition
    setTimeout(() => {
      setAddingRecipe(true);
      // Allow editor to mount, then fade spinner
      setTimeout(() => setLoading(false), 300);
    }, 150);
  }, []);

  const closeAddRecipe = React.useCallback((navigateToContents?: boolean) => {
    setLoading(true);
    setTimeout(() => {
      setAddingRecipe(false);
      if (navigateToContents) {
        setPendingNav("contents");
      }
      setTimeout(() => setLoading(false), 300);
    }, 150);
  }, []);

  // Render Add/Edit Recipe Editor as a dedicated two-page spread with flipping disabled
  if (addingRecipe || editingRecipe) {
    return (
      <>
        <AddRecipeEditor
          width={pageWidth}
          height={pageHeight}
          isPortrait={isPortrait}
          onCancel={() => {
            setEditingRecipe(null);
            closeAddRecipe();
          }}
          onSave={(data) => {
            // Placeholder for future integration
            console.log("Saved draft:", data);
            // Close editor and flip to Contents
            closeAddRecipe(true);
          }}
          mode={editingRecipe ? "edit" : "add"}
          initialRecipe={
            editingRecipe
              ? {
                  title: editingRecipe.title,
                  prepTime: editingRecipe.prepTime,
                  cookTime: editingRecipe.cookTime,
                  ingredients: editingRecipe.ingredients,
                  instructions: editingRecipe.instructions,
                  imageUrl: editingRecipe.image,
                }
              : undefined
          }
        />
        {loading && (
          <div className="loading-overlay" aria-live="polite" aria-busy="true">
            <div className="loading-spinner" />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div
        onPointerDownCapture={stopLockedInteractions}
        onMouseDownCapture={stopLockedInteractions}
        onTouchStartCapture={stopLockedInteractions}
        onClickCapture={stopLockedInteractions}
      >
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
          clickEventForward={!isLocked}
          showPageCorners={false}
          disableFlipByClick={isLocked}
          useMouseEvents={!isLocked}
          swipeDistance={isLocked ? 100000 : 0}
          onFlip={(e: any) => {
            const newPage = typeof e?.data === "number" ? e.data : undefined;
            if (typeof newPage !== "number") return;
            if (isLocked && !revertingRef.current && !allowProgrammaticFlipRef.current) {
              const api = bookRef.current?.pageFlip?.();
              if (api && typeof api.flip === "function") {
                revertingRef.current = true;
                setTimeout(() => {
                  api.flip(currentPage);
                  revertingRef.current = false;
                }, 0);
              }
            } else if (!revertingRef.current) {
              setCurrentPage(newPage);
              // If this was the allowed programmatic flip, clear the flag now
              if (allowProgrammaticFlipRef.current) {
                allowProgrammaticFlipRef.current = false;
              }
            }
          }}
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
              onAddRecipe={openAddRecipe}
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
                onEditRecipe={() => {
                  if (isLocked) return;
                  setLoading(true);
                  setTimeout(() => {
                    setEditingRecipe({
                      title: recipe.title,
                      prepTime: recipe.prepTime,
                      cookTime: recipe.cookTime,
                      ingredients: recipe.ingredients,
                      instructions: recipe.instructions,
                      image: recipe.image,
                    });
                    setAddingRecipe(true);
                    setTimeout(() => setLoading(false), 300);
                  }, 150);
                }}
                isLocked={isLocked}
                onToggleLock={() => setIsLocked((v) => !v)}
              />
            </div>,
          ])}

          {/* Back cover */}
          <div className="page" style={{ background: "#ffffff" }}>
            <BackCoverPage />
          </div>
        </HTMLFlipBook>
      </div>
      {loading && (
        <div className="loading-overlay" aria-live="polite" aria-busy="true">
          <div className="loading-spinner" />
        </div>
      )}
    </>
  );
}

export default Book;
