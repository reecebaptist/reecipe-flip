import "./styles.css";
import React from "react";

type RecipePageProps = {
  title: string;
  prepTime: string;
  cookTime: string;
  ingredients: string[];
  instructions: string;
  pageNumber: number;
  onGoToContents?: () => void;
};

function RecipePage({
  title,
  prepTime,
  cookTime,
  ingredients,
  instructions,
  pageNumber,
  onGoToContents,
}: RecipePageProps) {
  return (
    <div className="page-content">
      <div className="recipe-container">
        <div className="recipe-title-container">
          <h2 className="recipe-title">{title}</h2>
          {onGoToContents && (
            <button
              type="button"
              className="icon-button contents-link"
              onClick={onGoToContents}
              aria-label="Go to contents"
              title="Go to contents"
            >
              <span className="material-symbols-outlined">menu_book</span>
            </button>
          )}
        </div>
        <div className="recipe-body">
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
              <span className="material-symbols-outlined">
                restaurant_menu
              </span>
              <h3>Ingredients</h3>
            </div>
            <ul className="recipe-ingredients">
              {ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
            <div className="detail-header">
              <span className="material-symbols-outlined">soup_kitchen</span>
              <h3>Instructions</h3>
            </div>
            <p className="recipe-instructions">{instructions}</p>
          </div>
        </div>
        <div className="page-number">{pageNumber}</div>
      </div>
    </div>
  );
}

export default RecipePage;
