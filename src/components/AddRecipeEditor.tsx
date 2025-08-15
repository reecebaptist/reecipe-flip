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
  const [missingFields, setMissingFields] = React.useState<string[]>([]);
  const [showMissingModal, setShowMissingModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [nextFocusKey, setNextFocusKey] = React.useState<
    null | "title" | "prep" | "cook" | "ingredients" | "steps"
  >(null);

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

  // After modal closes, focus the first missing field
  React.useEffect(() => {
    if (!showMissingModal && nextFocusKey) {
      const refMap = {
        title: titleRef.current,
        prep: prepRef.current,
        cook: cookRef.current,
        ingredients: ingredientsRef.current,
        steps: instructionsRef.current,
      } as const;
      const el = refMap[nextFocusKey];
      if (el && typeof (el as any).focus === "function") {
        (el as any).focus();
        if (
          el instanceof HTMLInputElement ||
          el instanceof HTMLTextAreaElement
        ) {
          try { el.select(); } catch {}
        }
      }
      setNextFocusKey(null);
    }
  }, [showMissingModal, nextFocusKey]);

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
            <span className="editor-field-label">
              Title <span className="required-star" aria-hidden>*</span>
            </span>
            <input
              ref={titleRef}
              type="text"
              defaultValue={initialRecipe?.title || ""}
              className="editor-input"
              placeholder="Recipe title"
              required
              aria-required="true"
            />
          </label>

          <div className="editor-grid-2">
            <label style={{ display: "block" }}>
              <span className="editor-field-label">
                Prep Time <span className="required-star" aria-hidden>*</span>
              </span>
              <input
                ref={prepRef}
                type="text"
                defaultValue={initialRecipe?.prepTime || ""}
                className="editor-input"
                placeholder="e.g. 15 mins"
                required
                aria-required="true"
              />
            </label>
            <label style={{ display: "block" }}>
              <span className="editor-field-label">
                Cook Time <span className="required-star" aria-hidden>*</span>
              </span>
              <input
                ref={cookRef}
                type="text"
                defaultValue={initialRecipe?.cookTime || ""}
                className="editor-input"
                placeholder="e.g. 30 mins"
                required
                aria-required="true"
              />
            </label>
          </div>

          <label style={{ display: "block" }}>
            <span className="editor-field-label">
              Ingredients (one per line)
              <span className="required-star" aria-hidden> *</span>
            </span>
            <textarea
              ref={ingredientsRef}
              defaultValue={(initialRecipe?.ingredients || []).join("\n")}
              className="editor-textarea ingredients"
              placeholder={"Flour\nSugar\nEggs"}
              required
              aria-required="true"
            />
          </label>

          <label style={{ display: "block" }}>
            <span className="editor-field-label">
              Steps <span className="required-star" aria-hidden>*</span>
            </span>
            <textarea
              ref={instructionsRef}
              defaultValue={initialRecipe?.instructions || ""}
              className="editor-textarea steps"
              placeholder="Step-by-step instructions"
              required
              aria-required="true"
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
              onClick={() => setShowDeleteModal(true)}
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
              const missing: string[] = [];
              let firstKey: null | "title" | "prep" | "cook" | "ingredients" | "steps" = null;
              if (!title) missing.push("Title");
              if (!title && !firstKey) firstKey = "title";
              if (!prepTime) missing.push("Prep Time");
              if (!prepTime && !firstKey) firstKey = "prep";
              if (!cookTime) missing.push("Cook Time");
              if (!cookTime && !firstKey) firstKey = "cook";
              if (ingredients.length === 0) missing.push("Ingredients");
              if (ingredients.length === 0 && !firstKey) firstKey = "ingredients";
              if (!instructions) missing.push("Steps");
              if (!instructions && !firstKey) firstKey = "steps";

              if (missing.length > 0) {
                setMissingFields(missing);
                setNextFocusKey(firstKey);
                setShowMissingModal(true);
                // focus the first missing field after closing modal handled by user
                return;
              }

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

      {showMissingModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="missing-modal-title"
          onClick={() => setShowMissingModal(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowMissingModal(false);
          }}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            <div className="modal-header">
              <h3 id="missing-modal-title" className="modal-title">
                Missing required fields
              </h3>
            </div>
            <div className="modal-body">
              <p>Please fill in the following:</p>
              <ul>
                {missingFields.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="icon-button contents-link"
                onClick={() => setShowMissingModal(false)}
                autoFocus
              >
                <span className="material-symbols-outlined" aria-hidden>
                  check
                </span>
                <span className="btn-label">OK</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          onClick={() => setShowDeleteModal(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowDeleteModal(false);
          }}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()} tabIndex={-1}>
            <div className="modal-header">
              <h3 id="delete-modal-title" className="modal-title">Delete recipe?</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this recipe? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="icon-button contents-link is-cancel"
                onClick={() => setShowDeleteModal(false)}
                autoFocus
              >
                <span className="material-symbols-outlined" aria-hidden>close</span>
                <span className="btn-label">Cancel</span>
              </button>
              <button
                type="button"
                className="icon-button contents-link"
                onClick={() => {
                  setShowDeleteModal(false);
                  onDelete?.();
                }}
              >
                <span className="material-symbols-outlined" aria-hidden>delete</span>
                <span className="btn-label">Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRecipeEditor;
