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
  isLocked?: boolean;
  onToggleLock?: () => void;
  onEditRecipe?: () => void;
  onLogout?: () => void;
  canEdit?: boolean;
};

function RecipePage({
  title,
  prepTime,
  cookTime,
  ingredients,
  instructions,
  pageNumber,
  onGoToContents,
  isLocked,
  onToggleLock,
  onEditRecipe,
  onLogout,
  canEdit = true,
}: RecipePageProps) {
  const stopFlipCapture = React.useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
  }, []);
  return (
    <div className="page-content">
      {onLogout && (
        <button
          type="button"
          className="icon-button contents-link page-logout-btn"
          aria-label="Logout"
          title="Logout"
          data-allow-locked="true"
          onPointerDownCapture={stopFlipCapture}
          onTouchStartCapture={stopFlipCapture}
          onMouseDownCapture={stopFlipCapture}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onLogout();
          }}
        >
          <span className="material-symbols-outlined" aria-hidden>
            logout
          </span>
        </button>
      )}
      <div className="recipe-container">
        <div className="recipe-title-container">
          <h2 className="recipe-title">{title}</h2>
        </div>
        {(onGoToContents || onEditRecipe || onToggleLock) && (
          <div className="recipe-actions-row">
            {onGoToContents && (
              <button
                type="button"
                className="go-contents-button"
                onPointerDownCapture={stopFlipCapture}
                onTouchStartCapture={stopFlipCapture}
                onMouseDownCapture={stopFlipCapture}
                disabled={!!isLocked}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isLocked) {
                    onGoToContents();
                  }
                }}
                aria-label="Go to contents"
                title="Go to contents"
                aria-disabled={!!isLocked}
              >
                <span className="material-symbols-outlined" aria-hidden>
                  menu_book
                </span>
                <span>Go to contents</span>
              </button>
            )}
            {onEditRecipe && (
              <button
                type="button"
                className="go-contents-button"
                onPointerDownCapture={stopFlipCapture}
                onTouchStartCapture={stopFlipCapture}
                onMouseDownCapture={stopFlipCapture}
                disabled={!!isLocked || !canEdit}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isLocked && canEdit) {
                    onEditRecipe();
                  }
                }}
                aria-label="Edit recipe"
                title="Edit recipe"
                aria-disabled={!!isLocked || !canEdit}
              >
                <span className="material-symbols-outlined" aria-hidden>
                  edit
                </span>
                <span>Edit</span>
              </button>
            )}
            {onToggleLock && (
              <button
                type="button"
                className="go-contents-button"
                data-allow-locked="true"
                onPointerDownCapture={stopFlipCapture}
                onTouchStartCapture={stopFlipCapture}
                onMouseDownCapture={stopFlipCapture}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleLock();
                }}
                aria-label={isLocked ? "Unlock pages" : "Lock pages"}
                title={isLocked ? "Unlock pages" : "Lock pages"}
              >
                <span className="material-symbols-outlined" aria-hidden>
                  {isLocked ? "lock" : "lock_open"}
                </span>
                <span>{isLocked ? "Unlock" : "Lock"}</span>
              </button>
            )}
          </div>
        )}
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
              <span className="material-symbols-outlined">restaurant_menu</span>
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
