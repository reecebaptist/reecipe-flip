import "./styles.css";

type RecipePageProps = {
  title: string;
  image: string;
  ingredients: string[];
  instructions: string;
};

function RecipePage({ title, image, ingredients, instructions }: RecipePageProps) {
  return (
    <div className="page-content">
      <div className="recipe-container">
        <h2 className="recipe-title">{title}</h2>
        <img src={image} alt={title} className="recipe-image" />
        <div className="recipe-details">
          <h3>Ingredients</h3>
          <ul className="recipe-ingredients">
            {ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
          <h3>Instructions</h3>
          <p className="recipe-instructions">{instructions}</p>
        </div>
      </div>
    </div>
  );
}

export default RecipePage;
