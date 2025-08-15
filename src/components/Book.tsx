import React from "react";
import HTMLFlipBook from "react-pageflip";
import CoverPage from "./CoverPage";
import AuthorPage from "./AuthorPage";
import RecipePage from "./RecipePage";
import ForewordPage from "./ForewordPage";
import ContentsPage, { ContentsItem } from "./ContentsPage";
import BackCoverPage from "./BackCoverPage";
import AddRecipeEditor from "./AddRecipeEditor";
import recipe1 from "../assets/images/cover-bg.avif";
import recipe2 from "../assets/images/cover-bg-2.avif";
import recipe3 from "../assets/images/cover-bg-3.avif";
import recipe4 from "../assets/images/cover-bg.jpg";

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
    {
      id: "5",
      title: "Beef Stroganoff",
      image: recipe3,
      prepTime: "15 mins",
      cookTime: "25 mins",
      ingredients: [
        "Beef Strips",
        "Mushrooms",
        "Onion",
        "Garlic",
        "Sour Cream",
        "Beef Stock",
        "Paprika",
        "Butter",
        "Parsley",
      ],
      instructions:
        "Sear beef, set aside. Sauté onions and mushrooms in butter, add garlic and paprika. Deglaze with stock, simmer, return beef and finish with sour cream. Serve over buttered noodles.",
    },
    {
      id: "6",
      title: "Margherita Pizza",
      image: recipe2,
      prepTime: "20 mins",
      cookTime: "12 mins",
      ingredients: [
        "Pizza Dough",
        "Tomato Sauce",
        "Fresh Mozzarella",
        "Basil Leaves",
        "Olive Oil",
        "Salt",
      ],
      instructions:
        "Stretch dough, spread sauce, add mozzarella. Bake hot until crust is golden, then top with basil and a drizzle of olive oil.",
    },
    {
      id: "7",
      title: "Vegetable Stir-Fry",
      image: recipe4,
      prepTime: "10 mins",
      cookTime: "10 mins",
      ingredients: [
        "Mixed Vegetables",
        "Soy Sauce",
        "Garlic",
        "Ginger",
        "Sesame Oil",
        "Rice",
      ],
      instructions:
        "Stir-fry garlic and ginger, add vegetables, toss with soy sauce and sesame oil. Serve over steamed rice.",
    },
    {
      id: "8",
      title: "Classic Pancakes",
      image: recipe1,
      prepTime: "10 mins",
      cookTime: "15 mins",
      ingredients: [
        "Flour",
        "Milk",
        "Eggs",
        "Baking Powder",
        "Sugar",
        "Butter",
      ],
      instructions:
        "Whisk dry and wet separately, combine to a batter. Cook on griddle until bubbles form; flip and finish.",
    },
    {
      id: "9",
      title: "Grilled Salmon",
      image: recipe2,
      prepTime: "10 mins",
      cookTime: "12 mins",
      ingredients: [
        "Salmon Fillets",
        "Lemon",
        "Olive Oil",
        "Salt",
        "Pepper",
        "Dill",
      ],
      instructions:
        "Season salmon, grill skin-side down until nearly done, flip briefly. Finish with lemon and dill.",
    },
    {
      id: "10",
      title: "Tacos al Pastor",
      image: recipe3,
      prepTime: "30 mins",
      cookTime: "20 mins",
      ingredients: [
        "Pork",
        "Achiote Paste",
        "Pineapple",
        "Onion",
        "Corn Tortillas",
        "Cilantro",
      ],
      instructions:
        "Marinate pork with achiote, grill with pineapple, slice thin, and serve on tortillas with onions and cilantro.",
    },
    {
      id: "11",
      title: "Lentil Soup",
      image: recipe4,
      prepTime: "10 mins",
      cookTime: "35 mins",
      ingredients: [
        "Lentils",
        "Carrot",
        "Celery",
        "Onion",
        "Tomatoes",
        "Stock",
      ],
      instructions:
        "Sauté aromatics, add lentils and stock, simmer until tender. Season and serve warm.",
    },
    {
      id: "12",
      title: "Greek Salad",
      image: recipe1,
      prepTime: "15 mins",
      cookTime: "0 mins",
      ingredients: [
        "Tomatoes",
        "Cucumber",
        "Red Onion",
        "Feta",
        "Olives",
        "Olive Oil",
      ],
      instructions:
        "Chop vegetables, toss with olives and feta, dress with olive oil, lemon, and oregano.",
    },
    {
      id: "13",
      title: "Banana Bread",
      image: recipe2,
      prepTime: "15 mins",
      cookTime: "55 mins",
      ingredients: [
        "Bananas",
        "Flour",
        "Sugar",
        "Eggs",
        "Butter",
        "Baking Soda",
      ],
      instructions:
        "Mash bananas, mix with remaining ingredients, pour into loaf pan and bake until a tester comes out clean.",
    },
    {
      id: "14",
      title: "Shrimp Scampi",
      image: recipe3,
      prepTime: "10 mins",
      cookTime: "10 mins",
      ingredients: [
        "Shrimp",
        "Garlic",
        "Butter",
        "White Wine",
        "Lemon",
        "Parsley",
      ],
      instructions:
        "Sauté garlic in butter, add shrimp and cook briefly. Deglaze with wine, finish with lemon and parsley.",
    },
    {
      id: "15",
      title: "Veggie Omelette",
      image: recipe4,
      prepTime: "10 mins",
      cookTime: "8 mins",
      ingredients: [
        "Eggs",
        "Bell Pepper",
        "Spinach",
        "Cheese",
        "Salt",
        "Pepper",
      ],
      instructions:
        "Whisk eggs, pour into pan, add veggies and cheese, fold when set and serve.",
    },
    {
      id: "16",
      title: "Chili Con Carne",
      image: recipe1,
      prepTime: "15 mins",
      cookTime: "45 mins",
      ingredients: [
        "Ground Beef",
        "Beans",
        "Tomatoes",
        "Onion",
        "Chili Powder",
        "Cumin",
      ],
      instructions:
        "Brown beef with onions, add spices, tomatoes, and beans. Simmer until thick and flavorful.",
    },
    {
      id: "17",
      title: "Fried Rice",
      image: recipe2,
      prepTime: "10 mins",
      cookTime: "10 mins",
      ingredients: [
        "Cooked Rice",
        "Eggs",
        "Peas",
        "Carrots",
        "Soy Sauce",
        "Green Onions",
      ],
      instructions:
        "Scramble eggs, stir-fry veggies, add rice and soy sauce, toss until heated through, finish with green onions.",
    },
    {
      id: "18",
      title: "BBQ Ribs",
      image: recipe3,
      prepTime: "15 mins",
      cookTime: "2 hrs",
      ingredients: [
        "Pork Ribs",
        "BBQ Sauce",
        "Brown Sugar",
        "Paprika",
        "Garlic Powder",
        "Salt",
      ],
      instructions:
        "Rub ribs, bake low and slow until tender, brush with sauce and finish under broiler or grill.",
    },
    {
      id: "19",
      title: "Quinoa Salad",
      image: recipe4,
      prepTime: "15 mins",
      cookTime: "15 mins",
      ingredients: [
        "Quinoa",
        "Cherry Tomatoes",
        "Cucumber",
        "Feta",
        "Lemon",
        "Olive Oil",
      ],
      instructions:
        "Cook quinoa, cool, toss with chopped veggies, feta, lemon juice, and olive oil.",
    },
    {
      id: "20",
      title: "Beef Burgers",
      image: recipe1,
      prepTime: "10 mins",
      cookTime: "10 mins",
      ingredients: [
        "Ground Beef",
        "Burger Buns",
        "Cheese",
        "Lettuce",
        "Tomato",
        "Onion",
      ],
      instructions:
        "Form patties, season, and grill. Assemble on buns with cheese and toppings.",
    },
    {
      id: "21",
      title: "Mushroom Risotto",
      image: recipe2,
      prepTime: "15 mins",
      cookTime: "30 mins",
      ingredients: [
        "Arborio Rice",
        "Mushrooms",
        "Onion",
        "White Wine",
        "Stock",
        "Parmesan",
      ],
      instructions:
        "Sauté onions and mushrooms, toast rice, deglaze with wine, add stock gradually while stirring, finish with parmesan.",
    },
    {
      id: "22",
      title: "Chicken Alfredo",
      image: recipe3,
      prepTime: "10 mins",
      cookTime: "20 mins",
      ingredients: [
        "Fettuccine",
        "Chicken",
        "Cream",
        "Butter",
        "Parmesan",
        "Garlic",
      ],
      instructions:
        "Cook pasta. Sauté chicken, make creamy garlic sauce, toss with pasta and cheese.",
    },
    {
      id: "23",
      title: "Tomato Basil Soup",
      image: recipe4,
      prepTime: "10 mins",
      cookTime: "25 mins",
      ingredients: ["Tomatoes", "Onion", "Garlic", "Basil", "Stock", "Cream"],
      instructions:
        "Simmer tomatoes with aromatics and stock, blend smooth, add cream and basil.",
    },
    {
      id: "24",
      title: "Pesto Pasta",
      image: recipe1,
      prepTime: "10 mins",
      cookTime: "10 mins",
      ingredients: [
        "Pasta",
        "Basil",
        "Pine Nuts",
        "Parmesan",
        "Garlic",
        "Olive Oil",
      ],
      instructions:
        "Blend pesto ingredients, toss with hot pasta and a splash of pasta water.",
    },
    {
      id: "25",
      title: "Stuffed Peppers",
      image: recipe2,
      prepTime: "20 mins",
      cookTime: "35 mins",
      ingredients: [
        "Bell Peppers",
        "Rice",
        "Ground Beef",
        "Tomato Sauce",
        "Onion",
        "Cheese",
      ],
      instructions:
        "Stuff peppers with seasoned beef and rice, top with sauce and cheese, bake until tender.",
    },
    {
      id: "26",
      title: "Avocado Toast",
      image: recipe3,
      prepTime: "5 mins",
      cookTime: "5 mins",
      ingredients: [
        "Bread",
        "Avocado",
        "Lemon",
        "Chili Flakes",
        "Salt",
        "Pepper",
      ],
      instructions:
        "Toast bread, mash avocado with lemon, spread, and top with chili flakes and seasoning.",
    },
    {
      id: "27",
      title: "Baked Ziti",
      image: recipe4,
      prepTime: "15 mins",
      cookTime: "30 mins",
      ingredients: [
        "Ziti",
        "Marinara",
        "Ricotta",
        "Mozzarella",
        "Parmesan",
        "Basil",
      ],
      instructions:
        "Mix cooked ziti with sauce and cheeses, bake until bubbly and golden.",
    },
    {
      id: "28",
      title: "Fish Tacos",
      image: recipe1,
      prepTime: "15 mins",
      cookTime: "10 mins",
      ingredients: [
        "White Fish",
        "Tortillas",
        "Cabbage",
        "Lime",
        "Crema",
        "Cilantro",
      ],
      instructions:
        "Season and pan-fry fish, assemble in tortillas with slaw and crema, squeeze with lime.",
    },
    {
      id: "29",
      title: "Eggplant Parmesan",
      image: recipe2,
      prepTime: "25 mins",
      cookTime: "40 mins",
      ingredients: [
        "Eggplant",
        "Breadcrumbs",
        "Marinara",
        "Mozzarella",
        "Parmesan",
        "Basil",
      ],
      instructions:
        "Bread and bake eggplant slices, layer with sauce and cheese, bake until melted and tender.",
    },
    {
      id: "30",
      title: "Pad Thai",
      image: recipe3,
      prepTime: "15 mins",
      cookTime: "10 mins",
      ingredients: [
        "Rice Noodles",
        "Shrimp",
        "Eggs",
        "Bean Sprouts",
        "Peanuts",
        "Tamarind Sauce",
      ],
      instructions:
        "Stir-fry noodles with sauce, add shrimp and eggs, toss with sprouts and peanuts.",
    },
    {
      id: "31",
      title: "Shakshuka",
      image: recipe4,
      prepTime: "10 mins",
      cookTime: "20 mins",
      ingredients: [
        "Eggs",
        "Tomatoes",
        "Bell Pepper",
        "Onion",
        "Cumin",
        "Paprika",
      ],
      instructions:
        "Simmer spiced tomato-pepper sauce, nest eggs and cook until set. Serve with crusty bread.",
    },
    {
      id: "32",
      title: "Falafel Wraps",
      image: recipe1,
      prepTime: "20 mins",
      cookTime: "15 mins",
      ingredients: [
        "Falafel",
        "Pita",
        "Lettuce",
        "Tomato",
        "Cucumber",
        "Tahini Sauce",
      ],
      instructions:
        "Warm pitas, add falafel and veggies, drizzle with tahini sauce and wrap.",
    },
    {
      id: "33",
      title: "Pumpkin Soup",
      image: recipe2,
      prepTime: "10 mins",
      cookTime: "25 mins",
      ingredients: ["Pumpkin", "Onion", "Garlic", "Stock", "Cream", "Nutmeg"],
      instructions:
        "Simmer pumpkin with aromatics and stock, blend, finish with cream and nutmeg.",
    },
    {
      id: "34",
      title: "Chicken Fajitas",
      image: recipe3,
      prepTime: "15 mins",
      cookTime: "15 mins",
      ingredients: [
        "Chicken",
        "Bell Peppers",
        "Onion",
        "Fajita Seasoning",
        "Tortillas",
        "Lime",
      ],
      instructions:
        "Sear seasoned chicken and peppers, serve sizzling with warm tortillas and lime.",
    },
    {
      id: "35",
      title: "Berry Parfait",
      image: recipe4,
      prepTime: "10 mins",
      cookTime: "0 mins",
      ingredients: [
        "Greek Yogurt",
        "Mixed Berries",
        "Granola",
        "Honey",
        "Mint",
      ],
      instructions:
        "Layer yogurt, berries, and granola in a glass, drizzle with honey and garnish with mint.",
    },
  ];

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
