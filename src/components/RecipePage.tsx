import "./styles.css";
import React from "react";

type RecipePageProps = {
  title: string;
  prepTime: string;
  cookTime: string;
  ingredients: string[];
  instructions: string;
};

function RecipePage({
  title,
  prepTime,
  cookTime,
  ingredients,
  instructions,
}: RecipePageProps) {
  const [checkedItems, setCheckedItems] = React.useState<
    Record<string, boolean>
  >({});

  const handleCheckboxChange = (ingredient: string) => {
    setCheckedItems((prev) => ({ ...prev, [ingredient]: !prev[ingredient] }));
  };

  return (
    <div className="page-content">
      <div className="recipe-container">
        <h2 className="recipe-title">{title}</h2>
        <div className="recipe-times">
          <div className="time-block">
            <div className="time-title">
              <span className="material-symbols-outlined">timer</span>
              <strong>Prep Time</strong>
            </div>
            <div className="time-value">
              <span>{prepTime}</span>
            </div>
          </div>
          <div className="time-block">
            <div className="time-title">
              <span className="material-symbols-outlined">skillet</span>
              <strong>Cook Time</strong>
            </div>
            <div className="time-value">
              <span>{cookTime}</span>
            </div>
          </div>
        </div>
        <div className="recipe-details">
          <div className="detail-header">
            <span className="material-symbols-outlined">restaurant_menu</span>
            <h3>Ingredients</h3>
          </div>
          <div className="recipe-ingredients">
            {ingredients.map((ingredient) => (
              <div key={ingredient} className="ingredient-item">
                <input
                  type="checkbox"
                  id={ingredient}
                  checked={checkedItems[ingredient] || false}
                  onChange={() => handleCheckboxChange(ingredient)}
                />
                <label
                  htmlFor={ingredient}
                  className={checkedItems[ingredient] ? "checked" : ""}
                >
                  {ingredient}
                </label>
              </div>
            ))}
          </div>
          <div className="detail-header">
            <span className="material-symbols-outlined">soup_kitchen</span>
            <h3>Instructions</h3>
          </div>
          <p className="recipe-instructions">{instructions}</p>
        </div>
      </div>
    </div>
  );
}

export default RecipePage;
