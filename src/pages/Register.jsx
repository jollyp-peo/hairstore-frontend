import { useState } from "react";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import { supabase } from "../utilis/supabaseClient";
import Spinner from "../components/Spinner";
import { Button } from "../components/ui/Button";
import { FaGoogle } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
	const [form, setForm] = useState({
		first_name: "",
		last_name: "",
		username: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await fetch(`${API_URL}/api/auth/signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			setLoading(false);

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || "Registration failed");
			}

			navigate(redirectPath, { replace: true });
		} catch (err) {
			setError(err.message);
			setLoading(false);
		}
	};

	const handleGoogleSignup = async () => {
		setError("");
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}${redirectPath}`,
			},
		});
		if (error) setError(error.message); 
	};

	return (
		<div className="max-w-md mx-auto mt-12 p-6 bg-background rounded shadow">
			<h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>
			{error && <p className="text-red-600 text-sm mb-2">{error}</p>}
			{loading && <Spinner />}
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					name="first_name"
					value={form.first_name}
					onChange={handleChange}
					placeholder="First Name"
					className="w-full p-2 border rounded"
					required
				/>
				<input
					name="last_name"
					value={form.last_name}
					onChange={handleChange}
					placeholder="Last Name"
					className="w-full p-2 border rounded"
					required
				/>
				<input
					name="username"
					value={form.username}
					onChange={handleChange}
					placeholder="Username"
					className="w-full p-2 border rounded"
					required
				/>
				<input
					name="email"
					type="email"
					value={form.email}
					onChange={handleChange}
					placeholder="Email"
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
				<Button variant="luxury" size="lg" className="w-full mb-4">
					{loading ? "Please Wait..." : "Sign Up"}
				</Button>
			</form>

			<div className="mt-4 text-center">
				<p className="mb-2 text-gray-500">Or sign up with</p>
				<Button
					variant="outline"
					size="lg"
					onClick={handleGoogleSignup}
					className="w-full"
				>
					<FaGoogle className="w-5 h-5 text-red-500" />
					Continue with Google
				</Button>
			</div>
			<div className="mt-6 text-center text-sm text-gray-600">
				Already have an account?{" "}
				<Link to="/login" className="text-blue-600 hover:underline">
					Login
				</Link>
			</div>
		</div>
	);
};

export default Register;
