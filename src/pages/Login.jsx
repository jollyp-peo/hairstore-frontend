import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Button } from "../components/ui/Button";
import { supabase } from "../utilis/supabaseClient";
import { FaGoogle } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
	const [form, setForm] = useState({ identifier: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	// Email/Password Login (Backend API)
	const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) throw new Error(data.message || "Login failed");

    // ✅ Set Supabase session instead of localStorage
    const { access_token, refresh_token } = data;
    if (!access_token || !refresh_token) {
      throw new Error("No tokens received from backend");
    }

    const { error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (sessionError) throw sessionError;

    // ✅ Navigate after Supabase session is ready
    navigate(redirectPath, { replace: true });
  } catch (err) {
    setError(err.message);
    setLoading(false);
  }
};


	// Supabase Google Login
	const handleGoogleLogin = async () => {
		setError("");
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`
				},
			});
			if (error) throw error;
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-12 p-6 bg-background rounded shadow">
			<h2 className="text-2xl font-bold text-center mb-4">Login</h2>
			{error && <p className="text-red-600 text-sm mb-2">{error}</p>}
			{loading && <Spinner />}

			{/* Email/Password Login */}
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					name="identifier"
					value={form.identifier}
					onChange={handleChange}
					placeholder="Email or Username"
					className="w-full p-2 border rounded"
					required
				/>
				<input
					name="password"
					type="password"
					value={form.password}
					onChange={handleChange}
					placeholder="Password"
					className="w-full p-2 border rounded"
					required
				/>
				<Button
					variant="luxury"
					size="lg"
					type="submit"
					className="w-full mb-4"
				>
					{loading ? "Please Wait..." : "Login"}
				</Button>
			</form>

			{/* Google Login */}
			<div className="mt-4 text-center">
				<p className="mb-2 text-gray-500">Or login with</p>
				<Button
					variant="outline"
					size="lg"
					onClick={handleGoogleLogin}
					className="w-full"
				>
					<FaGoogle className="w-5 h-5 text-red-500" />
					Continue with Google
				</Button>
			</div>
			<div className="mt-6 text-center text-sm text-gray-600">
				Don't have an account?{" "}
				<Link to="/Register" className="text-blue-600 hover:underline">
					Create account
				</Link>
			</div>
		</div>
	);
};

export default Login;
