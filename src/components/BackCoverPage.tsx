import React from "react";
import "./styles.css";

const BackCoverPage: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <div className="page-content back-cover">
      <div className="back-cover-footer">© {year} Reece D'Souza</div>
    </div>
  );
};

export default BackCoverPage;
