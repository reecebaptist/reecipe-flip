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
    imageFile?: File | null;
  }) => void;
  mode?: "add" | "edit";
  initialRecipe?: {
    id?: string;
    title: string;
    prepTime: string;
    cookTime: string;
    ingredients: string[];
    instructions: string;
    imageUrl?: string;
  };
  onDelete?: () => void;
};

const AddRecipeEditor: React.FC<AddRecipeEditorProps> = ({
  width,
  height,
  isPortrait,
  onCancel,
  onSave,
  mode = "add",
  initialRecipe,
  onDelete,
}) => {
  const editorRef = React.useRef<any>(null);
  const [draftImageUrl, setDraftImageUrl] = React.useState<string>(
    initialRecipe?.imageUrl || ""
  );
  const [draftFile, setDraftFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const titleRef = React.useRef<HTMLInputElement | null>(null);
  const prepRef = React.useRef<HTMLInputElement | null>(null);
  const cookRef = React.useRef<HTMLInputElement | null>(null);
  const ingredientsRef = React.useRef<HTMLTextAreaElement | null>(null);
  const instructionsRef = React.useRef<HTMLTextAreaElement | null>(null);

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
      if (draftImageUrl && draftImageUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(draftImageUrl);
        } catch {}
      }
      const url = URL.createObjectURL(f);
      setDraftImageUrl(url);
      setDraftFile(f);
    }
  };
  const handleDelete = () => {
    if (draftImageUrl && draftImageUrl.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(draftImageUrl);
      } catch {}
    }
    setDraftImageUrl("");
    setDraftFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="editor-wrapper" style={{ position: "relative" }}>
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
              style={
                preview ? { backgroundImage: `url(${preview})` } : undefined
              }
              aria-label={preview ? "Recipe image" : "Upload recipe image"}
              title={
                preview ? "Click to change image" : "Click to upload image"
              }
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

        {/* Right page: read-only editor hint (form moved to side panel) */}
        <div className="page editor-page">
          <div className="page-content no-padding">
            <div className="recipe-container editor-recipe-container">
              <div className="recipe-title-container">
                <h2 className="recipe-title">
                  {mode === "edit" ? "Edit recipe" : "Add a new recipe"}
                </h2>
              </div>
              {/* Hint instead of inline form */}
              <div className="editor-form-scroll" style={{ padding: 16 }}>
                <p style={{ margin: 0, opacity: 0.8 }}>
                  Use the editor panel to the right to edit fields. Your book
                  page will update after you press Save.
                </p>
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

      <div
        className="editor-side-panel"
        style={{
          position: "absolute",
          top: 0,
          left: isPortrait ? 0 : width,
          height: height,
          width: width,
          background: "#fff",
          padding: "32px 32px 32px 32px",
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
        }}
      >
        <div className="recipe-title-container" style={{ marginBottom: 8 }}>
          <h2 className="recipe-title">
            {mode === "edit" ? "Edit recipe" : "Add a new recipe"}
          </h2>
        </div>

        <div
          className="editor-form-scroll"
          style={{ flex: 1, overflowY: "auto" }}
        >
          <label style={{ display: "block" }}>
            <span className="editor-field-label">Title</span>
            <input
              ref={titleRef}
              type="text"
              defaultValue={initialRecipe?.title || ""}
              className="editor-input"
              placeholder="Recipe title"
            />
          </label>

          <div className="editor-grid-2">
            <label style={{ display: "block" }}>
              <span className="editor-field-label">Prep Time</span>
              <input
                ref={prepRef}
                type="text"
                defaultValue={initialRecipe?.prepTime || ""}
                className="editor-input"
                placeholder="e.g. 15 mins"
              />
            </label>
            <label style={{ display: "block" }}>
              <span className="editor-field-label">Cook Time</span>
              <input
                ref={cookRef}
                type="text"
                defaultValue={initialRecipe?.cookTime || ""}
                className="editor-input"
                placeholder="e.g. 30 mins"
              />
            </label>
          </div>

          <label style={{ display: "block" }}>
            <span className="editor-field-label">
              Ingredients (one per line)
            </span>
            <textarea
              ref={ingredientsRef}
              defaultValue={(initialRecipe?.ingredients || []).join("\n")}
              className="editor-textarea ingredients"
              placeholder={"Flour\nSugar\nEggs"}
            />
          </label>

          <label style={{ display: "block" }}>
            <span className="editor-field-label">Steps</span>
            <textarea
              ref={instructionsRef}
              defaultValue={initialRecipe?.instructions || ""}
              className="editor-textarea steps"
              placeholder="Step-by-step instructions"
            />
          </label>
        </div>

        <div
          className="editor-actions"
          style={{ paddingTop: 8, marginTop: "auto" }}
        >
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
          {mode === "edit" && (
            <button
              type="button"
              className="icon-button contents-link is-danger"
              onClick={() => onDelete?.()}
              aria-label="Delete"
              title="Delete"
            >
              <span className="material-symbols-outlined">delete</span>
              <span className="btn-label">Delete</span>
            </button>
          )}
          <button
            type="button"
            className="icon-button contents-link is-success"
            onClick={() => {
              const title = (titleRef.current?.value || "").trim();
              const prepTime = (prepRef.current?.value || "").trim();
              const cookTime = (cookRef.current?.value || "").trim();
              const ingredients = (ingredientsRef.current?.value || "")
                .split(/\r?\n/)
                .map((s) => s.trim())
                .filter(Boolean);
              const instructions = (
                instructionsRef.current?.value || ""
              ).trim();

              onSave?.({
                title,
                prepTime,
                cookTime,
                ingredients,
                instructions,
                imageUrl: draftImageUrl || undefined,
                imageFile: draftFile,
              });
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
  );
};

export default AddRecipeEditor;
