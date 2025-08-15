import React from "react";
import "./App.css";
import Book from "./components/Book";
import LoginPage from "./components/LoginPage";
import supabase from "./lib/supabaseClient";

const App: React.FC = () => {
  const [authed, setAuthed] = React.useState<boolean>(
    typeof window !== "undefined" && localStorage.getItem("rf_auth") === "1"
  );

  const handleLogin = () => setAuthed(true);
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    try {
      localStorage.removeItem("rf_auth");
    } catch {}
    setAuthed(false);
  };

  return (
    <div className="container">
      {authed ? (
        <Book onLogout={handleLogout} />
      ) : (
        <LoginPage onSuccess={handleLogin} />
      )}
    </div>
  );
};

export default App;
