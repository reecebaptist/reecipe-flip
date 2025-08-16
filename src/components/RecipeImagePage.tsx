import React from "react";

type RecipeImagePageProps = {
  src: string;
  placeholder: string;
};

// Displays a placeholder image until the real image has loaded, then swaps in.
const RecipeImagePage: React.FC<RecipeImagePageProps> = ({ src, placeholder }) => {
  const [displayUrl, setDisplayUrl] = React.useState<string>(placeholder);

  React.useEffect(() => {
    let cancelled = false;
    // Reset to placeholder first
    setDisplayUrl(placeholder);
    if (src && src.trim()) {
      const img = new Image();
      img.onload = () => {
        if (!cancelled) setDisplayUrl(src);
      };
      img.onerror = () => {
        if (!cancelled) setDisplayUrl(placeholder);
      };
      img.src = src;
    }
    return () => {
      cancelled = true;
    };
  }, [src, placeholder]);

  return <div className="recipe-image-full" style={{ backgroundImage: `url(${displayUrl})` }} />;
};

export default RecipeImagePage;
