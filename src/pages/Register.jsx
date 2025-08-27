import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Button } from "../components/ui/Button";
// import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

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
  const { signup } = useAuth();

  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { success, message } = await signup(form);

    setLoading(false);
    if (success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(message || "Registration failed. Please try again.");
    }
  };

  // Google Signup → handled by backend
  // const handleGoogleSignup = () => {
  //   window.location.href = `${
  //     import.meta.env.VITE_API_URL
  //   }/api/auth/google?redirect=${encodeURIComponent(redirectPath)}`;
  // };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-background rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>
      {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}
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
        <Button
          variant="luxury"
          size="lg"
          type="submit"
          className="w-full mb-4"
          disabled={loading}
        >
          {loading ? "Please Wait..." : "Sign Up"}
        </Button>
      </form>

      {/* <div className="mt-4 text-center">
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
      </div> */}

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
