import "./styles.css";

type RecipePageProps = {
  id: string;
  name: string;
  types: string[];
  description: string;
};

function RecipePage({ id, name, types, description }: RecipePageProps) {
  return (
    <div className="page-content">
      <div className="pokemon-container">
        <img
          src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${id}.png`}
          alt={name}
        />
        <div className="pokemon-info">
          <h2 className="pokemon-name">{name}</h2>
          <p className="pokemon-number">#{id}</p>
          <div>
            {types.map((type) => (
              <span key={type} className={`pokemon-type type-${type.toLowerCase()}`}>
                {type}
              </span>
            ))}
          </div>
          <p className="pokemon-description">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default RecipePage;
