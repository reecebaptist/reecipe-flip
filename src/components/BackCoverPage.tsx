import React from "react";
import "./styles.css";

type BackCoverPageProps = {
  onLogout?: () => void;
};

const BackCoverPage: React.FC<BackCoverPageProps> = ({ onLogout }) => {
  const stopFlipCapture = React.useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
  }, []);
  const year = new Date().getFullYear();
  return (
    <div className="page-content back-cover">
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
          onKeyDown={(e) => {
            if ((e as React.KeyboardEvent).key === "Enter" || (e as React.KeyboardEvent).key === " ") {
              e.stopPropagation();
            }
          }}
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
      <div className="back-cover-footer">© {year} Reece D'Souza</div>
    </div>
  );
};

export default BackCoverPage;
