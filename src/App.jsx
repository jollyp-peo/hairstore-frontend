import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Tooltip } from "react-tooltip";

// Layout
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import PaymentCallback from "./pages/PaymentCallback";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProductsPage from "./pages/admin/ProductsPage.jsx";

// Routes
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AdminRoute } from "./components/AdminRoute.jsx";

// Context
import { AuthProvider } from "./context/AuthContext.jsx";
import ProductEdit from "./pages/admin/ProductEdit.jsx";

const App = () => {
	return (
		<AuthProvider>
			<div className="min-h-screen flex flex-col">
				<Header />
				<main className="flex-1">
					<Routes>
						{/* Public */}
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/auth/callback" element={<AuthCallback />} />
						<Route path="/products" element={<Products />} />
						<Route path="/products/:id" element={<ProductDetail />} />
						<Route path="/cart" element={<Cart />} />
						<Route path="/payment/callback" element={<PaymentCallback />} />
						<Route path="/admin" element={<AdminDashboard />} />
						<Route path="/admin/products" element={<ProductsPage />} />
						<Route path="/admin/products/edit/:id" element={<ProductEdit />} />

						{/* Protected */}
						<Route
							path="/checkout"
							element={
								<ProtectedRoute>
									<Checkout />
								</ProtectedRoute>
							}
						/>

						{/* Admin
						<Route
							path="/admin/*"
							element={
								<AdminRoute>
									<AdminDashboard />
								</AdminRoute>
							}
						/> */}

						{/* Catch all */}
						<Route path="*" element={<NotFound />} />
					</Routes>
				</main>
				<Footer />
				<Toaster position="top-right" />
				<Tooltip id="tooltip" />
			</div>
		</AuthProvider>
	);
};

export default App;
