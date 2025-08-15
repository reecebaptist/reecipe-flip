import React from "react";
import "./styles.css";

type AuthorPageProps = {
  onLogout?: () => void;
};

const AuthorPage: React.FC<AuthorPageProps> = ({ onLogout }) => {
  const stopFlipCapture = React.useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
  }, []);
  return (
    <div className="page-content author-page">
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
      <div className="author-container">
        <div className="byline">By</div>
        <div className="author-name">Reece D'Souza</div>
      </div>
    </div>
  );
};

export default AuthorPage;
