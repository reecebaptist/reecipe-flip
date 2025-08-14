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
};

const AddRecipeEditor: React.FC<AddRecipeEditorProps> = ({
  width,
  height,
  isPortrait,
  onCancel,
  onSave,
}) => {
  const editorRef = React.useRef<any>(null);
  const [draftImageUrl, setDraftImageUrl] = React.useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [draftTitle, setDraftTitle] = React.useState<string>("");
  const [draftPrep, setDraftPrep] = React.useState<string>("");
  const [draftCook, setDraftCook] = React.useState<string>("");
  const [draftIngredients, setDraftIngredients] = React.useState<string>("");
  const [draftInstructions, setDraftInstructions] = React.useState<string>("");

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
  <div className="page" style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxSizing: "border-box",
          }}
        >
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
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              border: preview ? "0 none" : "2px dashed #ccc",
              overflow: "hidden",
              background: preview
                ? `center/cover no-repeat url(${preview})`
                : "#fafafa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              textAlign: "center",
              cursor: "pointer",
              outline: "none",
            }}
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
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  className="icon-button contents-link"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openFilePicker();
                  }}
                  title="Change photo"
                  aria-label="Change photo"
                  style={{ backgroundColor: "#fff" }}
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                  type="button"
                  className="icon-button contents-link"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete();
                  }}
                  title="Delete photo"
                  aria-label="Delete photo"
                  style={{ backgroundColor: "#fff" }}
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
            className="icon-button contents-link"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                editorRef.current?.pageFlip()?.flipNext();
              } catch {}
            }}
            aria-label="Next page"
            title="Next page"
            style={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              backgroundColor: "#fff",
              zIndex: 5,
            }}
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        )}
      </div>

      {/* Right page: details form */}
      <div className="page" style={{ position: "relative" }}>
        <div className="page-content" style={{ padding: 0 }}>
          <div
            className="recipe-container"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
              maxWidth: "unset",
              margin: 0,
              padding: 20,
              boxSizing: "border-box",
              alignItems: "stretch",
            }}
          >
            <div className="recipe-title-container">
              <h2 className="recipe-title">Add a new recipe</h2>
              <button
                type="button"
                className="icon-button contents-link"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onCancel();
                }}
                aria-label="Back to book"
                title="Back to book"
                style={{ backgroundColor: "#fff" }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Scrollable form content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                flex: 1,
                minHeight: 0,
                overflow: "auto",
              }}
            >
              {/* Title full-width */}
              <label style={{ display: "block" }}>
                <span
                  style={{ display: "block", fontWeight: 600, marginBottom: 4 }}
                >
                  Title
                </span>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                  placeholder="Recipe title"
                />
              </label>

              {/* Prep and Cook on one line, half each */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <label style={{ display: "block" }}>
                  <span
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    Prep Time
                  </span>
                  <input
                    type="text"
                    value={draftPrep}
                    onChange={(e) => setDraftPrep(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #ccc",
                    }}
                    placeholder="e.g. 15 mins"
                  />
                </label>
                <label style={{ display: "block" }}>
                  <span
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    Cook Time
                  </span>
                  <input
                    type="text"
                    value={draftCook}
                    onChange={(e) => setDraftCook(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #ccc",
                    }}
                    placeholder="e.g. 30 mins"
                  />
                </label>
              </div>

              {/* Ingredients full-width */}
              <label style={{ display: "block" }}>
                <span
                  style={{ display: "block", fontWeight: 600, marginBottom: 4 }}
                >
                  Ingredients (one per line)
                </span>
                <textarea
                  value={draftIngredients}
                  onChange={(e) => setDraftIngredients(e.target.value)}
                  style={{
                    width: "100%",
                    height: 140,
                    resize: "none",
                    overflow: "auto",
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                  placeholder={"Flour\nSugar\nEggs"}
                />
              </label>

              {/* Steps (Instructions) full-width textarea */}
              <label style={{ display: "block" }}>
                <span
                  style={{ display: "block", fontWeight: 600, marginBottom: 4 }}
                >
                  Steps
                </span>
                <textarea
                  value={draftInstructions}
                  onChange={(e) => setDraftInstructions(e.target.value)}
                  style={{
                    width: "100%",
                    height: 220,
                    resize: "none",
                    overflow: "auto",
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                  placeholder="Step-by-step instructions"
                />
              </label>
            </div>

            {/* Buttons pinned to bottom */}
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="contents-add-button"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="contents-add-button"
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
              >
                Save
              </button>
            </div>
          </div>
        </div>
        {isPortrait && (
          <button
            type="button"
            className="icon-button contents-link"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                editorRef.current?.pageFlip()?.flipNext();
              } catch {}
            }}
            aria-label="Next page"
            title="Next page"
            style={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              backgroundColor: "#fff",
              zIndex: 5,
            }}
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        )}
      </div>
    </HTMLFlipBook>
  );
};

export default AddRecipeEditor;
