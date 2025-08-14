import React from "react";
import HTMLFlipBook from "react-pageflip";
import CoverPage from "./CoverPage";
import RecipePage from "./RecipePage";
import ForewordPage from "./ForewordPage";

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
  const pokemonData = [
    {
      id: "006",
      name: "Charizard",
      types: ["Fire", "Flying"],
      description:
        "Flies in search of strong opponents. Breathes extremely hot fire that melts anything, but never uses it on weaker foes.",
    },
    {
      id: "025",
      name: "Pikachu",
      types: ["Electric"],
      description:
        "When Pikachu meet, they touch tails to exchange electricity as a greeting.",
    },
    {
      id: "125",
      name: "Electabuzz",
      types: ["Electric"],
      description:
        "Often kept at power plants to regulate electricity. Competes with others to attract lightning during storms.",
    },
    {
      id: "185",
      name: "Sudowoodo",
      types: ["Rock"],
      description:
        "Despite looking like a tree, its body is more like rock. Hates water and hides when it rains.",
    },
    {
      id: "448",
      name: "Lucario",
      types: ["Fighting", "Steel"],
      description:
        "Can read thoughts and movements by sensing others' aura. No foe can hide from Lucario.",
    },
    {
      id: "658",
      name: "Greninja",
      types: ["Water", "Dark"],
      description:
        "Creates throwing stars from compressed water that can slice through metal when thrown at high speed.",
    },
    {
      id: "491",
      name: "Darkrai",
      types: ["Dark"],
      description:
        "A legendary Pokémon that appears on moonless nights, putting people to sleep and giving them nightmares.",
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
      flippingTime={750}
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

      {pokemonData.map((pokemon) => (
        <div className="page" key={pokemon.id}>
          <RecipePage
            id={pokemon.id}
            name={pokemon.name}
            types={pokemon.types}
            description={pokemon.description}
          />
        </div>
      ))}
    </HTMLFlipBook>
  );
}

export default Book;
