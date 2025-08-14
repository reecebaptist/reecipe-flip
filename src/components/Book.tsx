import React from "react";
import HTMLFlipBook from "react-pageflip";
import CoverPage from "./CoverPage";
import RecipePage from "./RecipePage";
import ForewordPage from "./ForewordPage";
import recipe1 from "../assets/images/cover-bg.avif";
import recipe2 from "../assets/images/cover-bg-2.avif";
import recipe3 from "../assets/images/cover-bg-3.avif";
import recipe4 from "../assets/images/cover-bg.jpg";

function Book() {
  // Track viewport size for responsive sizing
  const [vw, setVw] = React.useState<number>(window.innerWidth);
  const [vh, setVh] = React.useState<number>(window.innerHeight);

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
  const recipeData = [
    {
      id: "1",
      title: "Spaghetti Carbonara",
      image: recipe1,
      prepTime: "10 mins",
      cookTime: "15 mins",
      ingredients: [
        "Spaghetti",
        "Eggs",
        "Pancetta",
        "Parmesan Cheese",
        "Black Pepper",
      ],
      instructions:
        "Cook spaghetti. Fry pancetta. Mix eggs and cheese. Combine everything. Serve with pepper.",
    },
    {
      id: "2",
      title: "Chicken Curry",
      image: recipe2,
      prepTime: "15 mins",
      cookTime: "20 mins",
      ingredients: [
        "Chicken Breast",
        "Onion",
        "Garlic",
        "Ginger",
        "Coconut Milk",
        "Curry Powder",
      ],
      instructions:
        "Sauté onions, garlic, and ginger. Add chicken and cook. Stir in curry powder, then add coconut milk. Simmer until chicken is cooked through.",
    },
    {
      id: "3",
      title: "Chocolate Cake",
      image: recipe3,
      prepTime: "20 mins",
      cookTime: "35 mins",
      ingredients: [
        "Flour",
        "Sugar",
        "Cocoa Powder",
        "Baking Soda",
        "Eggs",
        "Milk",
        "Vegetable Oil",
      ],
      instructions:
        "Mix dry ingredients. Add wet ingredients and mix until smooth. Bake at 350°F (175°C) for 30-35 minutes.",
    },
    {
      id: "4",
      title: "Caesar Salad",
      image: recipe4,
      prepTime: "15 mins",
      cookTime: "0 mins",
      ingredients: [
        "Romaine Lettuce",
        "Croutons",
        "Parmesan Cheese",
        "Caesar Dressing",
        "Chicken (optional)",
      ],
      instructions:
        "Toss lettuce with dressing. Top with croutons and cheese. Add grilled chicken if desired.",
    },
  ];

  return (
    <HTMLFlipBook
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

      {/* Blank page after cover */}
      <div className="page" style={{ background: "#ffffff" }}>
        <div className="page-content" />
      </div>

      {/* Foreword page */}
      <div className="page">
        <ForewordPage />
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
            pageNumber={index * 2 + 2}
          />
        </div>,
      ])}
    </HTMLFlipBook>
  );
}

export default Book;
