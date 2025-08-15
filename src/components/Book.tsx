import React from "react";
import HTMLFlipBook from "react-pageflip";
import CoverPage from "./CoverPage";
import AuthorPage from "./AuthorPage";
import RecipePage from "./RecipePage";
import ForewordPage from "./ForewordPage";
import ContentsPage, { ContentsItem } from "./ContentsPage";
import BackCoverPage from "./BackCoverPage";
import AddRecipeEditor from "./AddRecipeEditor";
import { fetchPublishedRecipes, UIRecipe } from "../lib/recipes";

type BookProps = {
  onLogout?: () => void;
};

function Book({ onLogout }: BookProps) {
  const bookRef = React.useRef<any>(null);
  const [vw, setVw] = React.useState<number>(window.innerWidth);
  const [vh, setVh] = React.useState<number>(window.innerHeight);
  const [addingRecipe, setAddingRecipe] = React.useState<boolean>(false);
  const [editingRecipe, setEditingRecipe] = React.useState<null | {
    title: string;
    prepTime: string;
    cookTime: string;
    ingredients: string[];
    instructions: string;
    image?: string;
  }>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isLocked, setIsLocked] = React.useState<boolean>(false);
  const [pendingNav, setPendingNav] = React.useState<null | "contents">(null);
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const revertingRef = React.useRef<boolean>(false);
  const allowProgrammaticFlipRef = React.useRef<boolean>(false);
  const [recipes, setRecipes] = React.useState<UIRecipe[]>([]);

  // Load recipes from Supabase
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const items = await fetchPublishedRecipes();
        if (mounted) setRecipes(items);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error fetching recipes", e);
        if (mounted) setRecipes([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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

  React.useEffect(() => {
    const mql = window.matchMedia("(orientation: portrait)");
    const handler = () => {
      window.location.reload();
    };
    if (mql.addEventListener) {
      mql.addEventListener("change", handler);
    } else {
      // @ts-ignore Safari < 14
      mql.addListener(handler);
    }
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handler);
      } else {
        // @ts-ignore Safari < 14
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

  // Remount flipbook when orientation or page count changes to avoid DOM reconciliation conflicts
  const flipbookKey = React.useMemo(
    () => `flip-${isPortrait ? "p" : "l"}-${recipes.length}`,
    [isPortrait, recipes.length]
  );

  const isSupabaseConfigured = Boolean(
    process.env.REACT_APP_SUPABASE_URL &&
      process.env.REACT_APP_SUPABASE_ANON_KEY
  );

  const CONTENTS_PAGE_INDEX = 4; // 0-based index of the Contents page in the flipbook
  const goToContents = React.useCallback(() => {
    if (isLocked) return; // prevent navigation while locked
    const api = bookRef.current?.pageFlip?.();
    if (api && typeof api.flip === "function") {
      api.flip(CONTENTS_PAGE_INDEX);
    }
  }, [isLocked]);

  const openAddRecipe = React.useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setAddingRecipe(true);
      setTimeout(() => setLoading(false), 300);
    }, 150);
  }, []);

  // Build dynamic recipe pages to ensure only React elements are passed as children (no null/false)
  const recipePages = React.useMemo(() => {
    if (recipes.length === 0) {
      return [
        <div className="page" key="no-recipes">
          <div className="page-content no-padding">
            <div className="recipe-container" style={{ padding: 16 }}>
              <div className="recipe-title-container">
                <h2 className="recipe-title">No recipes available</h2>
              </div>
              <div className="editor-form-scroll" style={{ paddingTop: 8 }}>
                {!isSupabaseConfigured ? (
                  <p style={{ margin: 0, opacity: 0.85 }}>
                    Supabase is not configured. Set REACT_APP_SUPABASE_URL and
                    REACT_APP_SUPABASE_ANON_KEY, then reload.
                  </p>
                ) : (
                  <p style={{ margin: 0, opacity: 0.85 }}>
                    No published recipes were found. Use “Add recipe” to create
                    your first one.
                  </p>
                )}
                <div style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="contents-add-button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openAddRecipe();
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
              </div>
            </div>
          </div>
        </div>,
      ];
    }
    return recipes.flatMap((recipe, index) => [
      <div className="page" key={`${recipe.id}-img`}>
        <div
          className="recipe-image-full"
          style={{ backgroundImage: `url(${recipe.imageUrl})` }}
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
                image: recipe.imageUrl,
              });
              setAddingRecipe(true);
              setTimeout(() => setLoading(false), 300);
            }, 150);
          }}
          isLocked={isLocked}
          onToggleLock={() => setIsLocked((v) => !v)}
        />
      </div>,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes, isSupabaseConfigured, isLocked]);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const contentsItems: ContentsItem[] = recipes.map((r, index) => ({
    title: r.title,
    page: index * 2 + 4,
  }));

  React.useEffect(() => {
    if (!addingRecipe && pendingNav === "contents") {
      let cancelled = false;
      const tryFlip = (attempt: number) => {
        if (cancelled) return;
        const api = bookRef.current?.pageFlip?.();
        if (api && typeof api.flip === "function") {
          allowProgrammaticFlipRef.current = true;
          api.flip(CONTENTS_PAGE_INDEX);
          setTimeout(() => {
            allowProgrammaticFlipRef.current = false;
          }, 300);
          setPendingNav(null);
        } else if (attempt < 10) {
          setTimeout(() => tryFlip(attempt + 1), 50);
        } else {
          setPendingNav(null);
        }
      };
      tryFlip(0);
      return () => {
        cancelled = true;
      };
    }
  }, [addingRecipe, pendingNav]);

  const RECIPE_FIRST_PAGE_INDEX = CONTENTS_PAGE_INDEX + 2; // first recipe text page index
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

  if (addingRecipe || editingRecipe) {
    return (
      <>
        <AddRecipeEditor
          width={pageWidth}
          height={pageHeight}
          isPortrait={isPortrait}
          onCancel={() => {
            setEditingRecipe(null);
            closeAddRecipe(true);
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
          onDelete={() => {
            // Placeholder: remove recipe from data source here
            console.log("Deleted recipe:", editingRecipe?.title);
            setEditingRecipe(null);
            closeAddRecipe(true);
          }}
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
        className="book-wrapper"
        onPointerDownCapture={stopLockedInteractions}
        onMouseDownCapture={stopLockedInteractions}
        onTouchStartCapture={stopLockedInteractions}
        onClickCapture={stopLockedInteractions}
      >
        <HTMLFlipBook
          key={flipbookKey}
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
            if (
              isLocked &&
              !revertingRef.current &&
              !allowProgrammaticFlipRef.current
            ) {
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

          {recipePages}

          {/* Back cover */}
          <div className="page" style={{ background: "#ffffff" }}>
            <BackCoverPage />
          </div>
        </HTMLFlipBook>
        {/* Top-right actions inside the page area */}
        <button
          type="button"
          className="icon-button contents-link book-logout-btn"
          aria-label="Logout"
          data-allow-locked="true"
          onClick={() => {
            if (typeof onLogout === "function") onLogout();
          }}
          title="Logout"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            logout
          </span>
        </button>
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
