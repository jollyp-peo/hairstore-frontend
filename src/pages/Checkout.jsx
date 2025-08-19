import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Lock } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useCart } from "../context/CartContext";
import { supabase } from "../utilis/supabaseClient";
import Spinner from "../components/Spinner";

const API_URL = import.meta.env.VITE_API_URL;

const Checkout = () => {
	const [orderComplete, setOrderComplete] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const [formData, setFormData] = useState({
		// Shipping Information
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		state: "",
		zipCode: "",
		country: "Nigeria",
	});

	const { cartItems } = useCart();

	const orderItems = cartItems;

	const subtotal = orderItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	const shipping = 0;
	const tax = subtotal * 0.01; // 1% tax
	const total = subtotal + shipping + tax;

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handlePlaceOrder = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const reference = `ref_${Date.now()}`;
			const {
				data: { session },
			} = await supabase.auth.getSession();
			const token = session?.access_token;
			const res = await fetch(`${API_URL}/api/payments/paystack/initialize`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
					credentials: "include",
				},
				body: JSON.stringify({
					amount: total, // in naira
					email: formData.email,
					reference,
					currency: "NGN",
					cart: orderItems,
					meta: { name: `${formData.firstName} ${formData.lastName}` },
				}),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to init payment");

			window.location.href = data.authorization_url;
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	if (orderComplete) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="max-w-md mx-auto text-center p-8">
					<div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
						<CheckCircle className="h-10 w-10 text-green-600" />
					</div>

					<h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
					<p className="text-muted-foreground mb-6">
						Thank you for your purchase. Your order {reference} has been
						confirmed and will be processed within 1-3 business days.
					</p>

					<div className="space-y-3">
						<Button variant="luxury" className="w-full" asChild>
							<Link to="/products">Continue Shopping</Link>
						</Button>
						<Button variant="outline" className="w-full">
							Track Your Order
						</Button>
					</div>

					<div className="mt-8 p-4 bg-card rounded-lg border">
						<h3 className="font-semibold mb-2">Order Summary</h3>
						<div className="text-sm space-y-1">
							<div className="flex justify-between">
								<span>Order Number:</span>
								<span className="font-medium">{reference}</span>
							</div>
							<div className="flex justify-between">
								<span>Total:</span>
								<span className="font-medium text-primary">
									${total.toFixed(2)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="bg-gradient-hero text-white py-12">
				<div className="container mx-auto px-4 lg:px-8">
					<h1 className="text-3xl lg:text-4xl font-bold mb-2">
						Secure Checkout
					</h1>
					<p className="text-white/90">
						Complete your order safely and securely
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 lg:px-8 py-8">
				{/* Back Button */}
				<Button variant="ghost" className="mb-6">
					<Link to="/cart">
						<span className="flex items-center">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Cart
						</span>
					</Link>
				</Button>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Checkout Form */}
					<div className="lg:col-span-2">
						<form onSubmit={handlePlaceOrder} className="space-y-8">
							{/* Shipping Information */}
							<div className="bg-card rounded-2xl shadow-card p-6">
								<h2 className="text-xl font-semibold mb-6 flex items-center">
									<span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
										1
									</span>
									Shipping Information
								</h2>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											First Name
										</label>
										<input
											type="text"
											name="firstName"
											value={formData.firstName}
											onChange={handleInputChange}
											required
											className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">
											Last Name
										</label>
										<input
											type="text"
											name="lastName"
											value={formData.lastName}
											onChange={handleInputChange}
											required
											className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">
											Email
										</label>
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											required
											className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">
											Phone
										</label>
										<input
											type="tel"
											name="phone"
											value={formData.phone}
											onChange={handleInputChange}
											required
											className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
										/>
									</div>

									<div className="md:col-span-2">
										<label className="block text-sm font-medium mb-2">
											Address
										</label>
										<input
											type="text"
											name="address"
											value={formData.address}
											onChange={handleInputChange}
											required
											className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">
											City
										</label>
										<input
											type="text"
											name="city"
											value={formData.city}
											onChange={handleInputChange}
											required
											className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">
											State
										</label>
										<select
											name="state"
											value={formData.state}
											onChange={handleInputChange}
											required
											className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
										>
											<option value="">Select State</option>
											<option value="AB">Abia</option>
											<option value="AD">Adamawa</option>
											<option value="AK">Akwa-Ibom</option>
											<option value="AN">Anambara</option>
											{/* Add more states as needed */}
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">
											ZIP Code
										</label>
										<input
											type="text"
											name="zipCode"
											value={formData.zipCode}
											onChange={handleInputChange}
											required
											className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
										/>
									</div>
								</div>
							</div>

							{/* No manual card input, just a security message */}
							<div className="bg-card rounded-2xl shadow-card p-6 text-center">
								<h2 className="text-xl font-semibold mb-2 flex items-center justify-center">
									Payment
									<Lock className="h-5 w-5 text-green-600 ml-2" />
								</h2>
								<div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
									<div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
										<span className="text-sm font-medium text-center">
											Click the button below to proceed to our secure payment
											gateway powered by Paystack.
										</span>
									</div>
								</div>
							</div>

							{/* Place Order Button */}
							{error && (
								<div className="text-red-500 text-center mb-4">{error}</div>
							)}

							<Button
								type="submit"
								variant="luxury"
								size="xl"
								className="w-full"
								disabled={loading}
							>
								{loading ? (
									<>
										<Spinner size="sm" className="mr-2" />
										Redirecting...
									</>
								) : (
									`Pay with Paystack - ${total.toLocaleString("en-NG", {
										style: "currency",
										currency: "NGN",
									})}`
								)}
							</Button>
						</form>
					</div>

					{/* Order Summary */}
					<div className="lg:col-span-1">
						<div className="bg-card rounded-2xl shadow-card p-6 sticky top-8">
							<h2 className="text-xl font-semibold mb-6">Order Summary</h2>

							{/* Order Items */}
							<div className="space-y-4 mb-6">
								{orderItems.map((item, index) => (
									<div key={index} className="flex justify-between">
										<div className="flex-1">
											<h3 className="font-medium text-sm">{item.name}</h3>
											<div className="text-xs text-muted-foreground space-y-1">
												<p>Qty: {item.quantity}</p>
												{item.length && <p>Length: {item.length}</p>}
												{item.color && <p>Color: {item.color}</p>}
												{item.size && <p>Size: {item.size}</p>}
											</div>
										</div>
										<div className="text-sm font-medium">
											{(item.price * item.quantity).toLocaleString("en-NG", {
												style: "currency",
												currency: "NGN",
											})}
										</div>
									</div>
								))}
							</div>

							{/* Totals */}
							<div className="space-y-3 pt-4 border-t border-border">
								<div className="flex justify-between">
									<span>Subtotal:</span>
									<span>
										{subtotal.toLocaleString("en-NG", {
											style: "currency",
											currency: "NGN",
										})}
									</span>
								</div>

								<div className="flex justify-between">
									<span>Shipping:</span>
									<span className="text-green-600 font-medium">FREE</span>
								</div>

								<div className="flex justify-between">
									<span>Tax:</span>
									<span>
										{tax.toLocaleString("en-NG", {
											style: "currency",
											currency: "NGN",
										})}
									</span>
								</div>

								<div className="border-t border-border pt-3">
									<div className="flex justify-between text-lg font-bold">
										<span>Total:</span>
										<span className="text-primary">
											{total.toLocaleString("en-NG", {
												style: "currency",
												currency: "NGN",
											})}
										</span>
									</div>
								</div>
							</div>

							{/* Security Features */}
							<div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground space-y-2">
								<p>🔒 256-bit SSL encryption</p>
								<p>💰 30-day money back guarantee</p>
								<p>🚚 Free shipping on orders over $200</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
