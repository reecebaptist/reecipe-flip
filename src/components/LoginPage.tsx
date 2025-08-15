import React from "react";
import "./styles.css";
import coverImg from "../assets/images/cover-bg.jpg";
import supabase from "../lib/supabaseClient";
import { showLoader, hideLoader } from "../lib/loader";

type Props = {
	onSuccess: () => void;
};

const LoginPage: React.FC<Props> = ({ onSuccess }) => {
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [error, setError] = React.useState<string | null>(null);
	const [submitting, setSubmitting] = React.useState(false);

	const expectedUser = process.env.REACT_APP_USERNAME || "";
	const expectedPass = process.env.REACT_APP_PASSWORD || "";
	const supabaseConfigured = Boolean(
		process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY
	);

	React.useEffect(() => {
		const authed = localStorage.getItem("rf_auth") === "1";
		if (authed) onSuccess();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSubmitting(true);
		try {
			if (supabaseConfigured) {
				// Treat username as email for Supabase Auth
				showLoader();
				try {
					const { error: authError } = await supabase.auth.signInWithPassword({
						email: username,
						password,
					});
					if (authError) {
						setError(authError.message || "Sign-in failed");
					} else {
						localStorage.setItem("rf_auth", "1");
						onSuccess();
					}
				} finally {
					hideLoader();
				}
			} else {
				// Fallback to env-based mock auth
				await new Promise((r) => setTimeout(r, 300));
				if (username === expectedUser && password === expectedPass) {
					localStorage.setItem("rf_auth", "1");
					onSuccess();
				} else {
					setError("Invalid username or password");
				}
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
			<div className="login-wrap">
				<div className="login-card page" role="dialog" aria-labelledby="login-title">
					<div
						className="login-media"
						aria-hidden="true"
						style={{ backgroundImage: `url(${coverImg})` }}
					/>
					<div className="login-pane">
						<div className="login-main">
							<div className="login-header">
								<h1 id="login-title" className="login-title">The Cookbook</h1>
								<p className="login-sub">Sign in to open the book</p>
							</div>
							<form className="login-form" onSubmit={handleSubmit}>
								<label className="login-label" htmlFor="username">
									Username
								</label>
								<input
									id="username"
									className="login-input"
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									autoComplete="username"
									placeholder="Enter username"
									required
								/>
								<label className="login-label" htmlFor="password">
									Password
								</label>
								<input
									id="password"
									className="login-input"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									autoComplete="current-password"
									placeholder="Enter password"
									required
								/>
								{error && <div className="login-error" role="alert">{error}</div>}
								<button className="login-button" type="submit" disabled={submitting}>
									{submitting ? "Signing in…" : "Open Book"}
								</button>
							</form>
						</div>
						<div className="login-footer">© {new Date().getFullYear()} Reece D'Souza</div>
					</div>
				</div>
			</div>
	);
};

export default LoginPage;
