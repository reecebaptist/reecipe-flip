import React from "react";
import HTMLFlipBook from "react-pageflip";

type AddRecipeEditorProps = {
  width: number;
  height: number;
  isPortrait: boolean;
  onCancel: () => void;
  onSave?: (data: {
    title: string;
    prepTime: string;
    cookTime: string;
    ingredients: string[];
    instructions: string;
    imageUrl?: string;
  }) => void;
  mode?: "add" | "edit";
  initialRecipe?: {
    title: string;
    prepTime: string;
    cookTime: string;
    ingredients: string[];
    instructions: string;
    imageUrl?: string;
  };
};

const AddRecipeEditor: React.FC<AddRecipeEditorProps> = ({
  width,
  height,
  isPortrait,
  onCancel,
  onSave,
  mode = "add",
  initialRecipe,
}) => {
  const editorRef = React.useRef<any>(null);
  const [draftImageUrl, setDraftImageUrl] = React.useState<string>(
    initialRecipe?.imageUrl || ""
  );
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [draftTitle, setDraftTitle] = React.useState<string>(
    initialRecipe?.title || ""
  );
  const [draftPrep, setDraftPrep] = React.useState<string>(
    initialRecipe?.prepTime || ""
  );
  const [draftCook, setDraftCook] = React.useState<string>(
    initialRecipe?.cookTime || ""
  );
  const [draftIngredients, setDraftIngredients] = React.useState<string>(
    initialRecipe?.ingredients?.join("\n") || ""
  );
  const [draftInstructions, setDraftInstructions] = React.useState<string>(
    initialRecipe?.instructions || ""
  );

  // Cleanup object URLs
  React.useEffect(() => {
    return () => {
      if (draftImageUrl?.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(draftImageUrl);
        } catch {}
      }
    };
  }, [draftImageUrl]);

  const preview = draftImageUrl;

  const openFilePicker = () => fileInputRef.current?.click();
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      // Revoke previous blob URL if any
      if (draftImageUrl && draftImageUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(draftImageUrl);
        } catch {}
      }
      const url = URL.createObjectURL(f);
      setDraftImageUrl(url);
    }
  };
  const handleDelete = () => {
    if (draftImageUrl && draftImageUrl.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(draftImageUrl);
      } catch {}
    }
    setDraftImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <HTMLFlipBook
      ref={editorRef}
      width={width}
      height={height}
      maxShadowOpacity={0}
      drawShadow={false}
      showCover={false}
      size="fixed"
      className={""}
      style={{}}
      startPage={0}
      startZIndex={0}
      minWidth={width}
      maxWidth={width}
      minHeight={height}
      maxHeight={height}
      flippingTime={250}
      usePortrait={isPortrait}
      autoSize={false}
      mobileScrollSupport={true}
      clickEventForward={false}
      useMouseEvents={isPortrait}
      swipeDistance={isPortrait ? 30 : 9999}
      showPageCorners={isPortrait}
      disableFlipByClick={false}
    >
  {/* Left page: photo upload/preview with inset spacing */}
  <div className="page editor-page">
        <div className="editor-image-wrapper">
          <div
            onClick={openFilePicker}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openFilePicker();
              }
            }}
            role="button"
            tabIndex={0}
            className={`editor-image-area ${preview ? "" : "is-empty"}`}
            style={preview ? { backgroundImage: `url(${preview})` } : undefined}
            aria-label={preview ? "Recipe image" : "Upload recipe image"}
            title={preview ? "Click to change image" : "Click to upload image"}
          >
            {!preview && <span>Click anywhere to upload a photo</span>}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {preview && (
              <div className="editor-image-actions">
                <button
                  type="button"
                  className="icon-button contents-link white-bg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openFilePicker();
                  }}
                  title="Change photo"
                  aria-label="Change photo"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                  type="button"
                  className="icon-button contents-link white-bg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete();
                  }}
                  title="Delete photo"
                  aria-label="Delete photo"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
        {isPortrait && (
          <button
            type="button"
            className="icon-button contents-link editor-edge-btn editor-edge-btn--right"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                editorRef.current?.pageFlip()?.flipNext();
              } catch {}
            }}
            aria-label="Next page"
            title="Next page"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        )}
      </div>

      {/* Right page: details form */}
      <div className="page editor-page">
        <div className="page-content no-padding">
          <div
            className="recipe-container editor-recipe-container"
          >
            <div className="recipe-title-container">
                <h2 className="recipe-title">{mode === "edit" ? "Edit recipe" : "Add a new recipe"}</h2>
              
            </div>

            {/* Scrollable form content */}
            <div className="editor-form-scroll">
              {/* Title full-width */}
              <label style={{ display: "block" }}>
                <span className="editor-field-label">
                  Title
                </span>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="editor-input"
                  placeholder="Recipe title"
                />
              </label>

              {/* Prep and Cook on one line, half each */}
              <div className="editor-grid-2">
                <label style={{ display: "block" }}>
                  <span className="editor-field-label">
                    Prep Time
                  </span>
                  <input
                    type="text"
                    value={draftPrep}
                    onChange={(e) => setDraftPrep(e.target.value)}
                    className="editor-input"
                    placeholder="e.g. 15 mins"
                  />
                </label>
                <label style={{ display: "block" }}>
                  <span className="editor-field-label">
                    Cook Time
                  </span>
                  <input
                    type="text"
                    value={draftCook}
                    onChange={(e) => setDraftCook(e.target.value)}
                    className="editor-input"
                    placeholder="e.g. 30 mins"
                  />
                </label>
              </div>

              {/* Ingredients full-width */}
              <label style={{ display: "block" }}>
                <span className="editor-field-label">
                  Ingredients (one per line)
                </span>
                <textarea
                  value={draftIngredients}
                  onChange={(e) => setDraftIngredients(e.target.value)}
                  className="editor-textarea ingredients"
                  placeholder={"Flour\nSugar\nEggs"}
                />
              </label>

              {/* Steps (Instructions) full-width textarea */}
              <label style={{ display: "block" }}>
                <span className="editor-field-label">
                  Steps
                </span>
                <textarea
                  value={draftInstructions}
                  onChange={(e) => setDraftInstructions(e.target.value)}
                  className="editor-textarea steps"
                  placeholder="Step-by-step instructions"
                />
              </label>
            </div>

            {/* Buttons pinned to bottom */}
            <div className="editor-actions">
              <button
                type="button"
                className="icon-button contents-link is-danger"
                onClick={onCancel}
                aria-label="Cancel"
                title="Cancel"
              >
                <span className="material-symbols-outlined">close</span>
                <span className="btn-label">Cancel</span>
              </button>
              <button
                type="button"
                className="icon-button contents-link is-success"
                onClick={() => {
                  onSave?.({
                    title: draftTitle.trim(),
                    prepTime: draftPrep.trim(),
                    cookTime: draftCook.trim(),
                    ingredients: draftIngredients
                      .split(/\r?\n/)
                      .map((s) => s.trim())
                      .filter(Boolean),
                    instructions: draftInstructions.trim(),
                    imageUrl: draftImageUrl || undefined,
                  });
                  onCancel();
                }}
                aria-label="Save"
                title="Save"
              >
                <span className="material-symbols-outlined">save</span>
                <span className="btn-label">Save</span>
              </button>
            </div>
          </div>
        </div>
        {isPortrait && (
          <button
            type="button"
            className="icon-button contents-link editor-edge-btn editor-edge-btn--right"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                editorRef.current?.pageFlip()?.flipNext();
              } catch {}
            }}
            aria-label="Next page"
            title="Next page"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        )}
      </div>
    </HTMLFlipBook>
  );
};

export default AddRecipeEditor;
