import React from "react";
import "./styles.css";

type BackCoverPageProps = {
  onLogout?: () => void;
};

const BackCoverPage: React.FC<BackCoverPageProps> = ({ onLogout }) => {
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
