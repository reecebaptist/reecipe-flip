import React from "react";
import "./App.css";
import Book from "./components/Book";
import GlobalLoader from "./components/GlobalLoader";
import LoginPage from "./components/LoginPage";
import supabase from "./lib/supabaseClient";
import { showLoader, hideLoader } from "./lib/loader";

const App: React.FC = () => {
  const [authed, setAuthed] = React.useState<boolean>(
    typeof window !== "undefined" && localStorage.getItem("rf_auth") === "1"
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const handleLogin = () => setAuthed(true);
  const handleLogout = async () => {
    try {
      showLoader();
      try {
        await supabase.auth.signOut();
      } finally {
        hideLoader();
      }
    } catch {}
    try {
      localStorage.removeItem("rf_auth");
    } catch {}
    setAuthed(false);
  };

  return (
    <div className="container">
      {authed ? (
        <Book onLogout={() => setShowLogoutConfirm(true)} />
      ) : (
        <LoginPage onSuccess={handleLogin} />
      )}
      {showLogoutConfirm && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="logout-title" className="modal-title">Sign out?</h2>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to log out?</p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="icon-button contents-link is-cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                <span className="material-symbols-outlined" aria-hidden>close</span>
                <span>Cancel</span>
              </button>
              <button
                type="button"
                className="icon-button contents-link"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
              >
                <span className="material-symbols-outlined" aria-hidden>logout</span>
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <GlobalLoader />
    </div>
  );
};

export default App;
