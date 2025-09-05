import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
	FaShoppingCart,
	FaUser,
	FaBars,
	FaTimes,
	FaCog,
	FaSignInAlt,
	FaSignOutAlt,
	FaUserCircle,
	FaChevronDown,
} from "react-icons/fa";
import { Button } from "../components/ui/Button";
import ThemeToggle from "./ThemeToggle.jsx";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const { cartItems } = useCart();
	const { user, logout, isAdmin } = useAuth();

	const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

	const isActivePage = (path) => location.pathname === path;

	const navigation = [
		{ name: "Home", path: "/" },
		{ name: "Products", path: "/products" },
		{ name: "Collections", path: "/collections" },
		{ name: "About", path: "/about" },
		{ name: "Contact", path: "/contact" },
	];

	const handleLogout = async () => {
		await logout();
		setShowUserMenu(false);
		navigate('/');
	};

	return (
		<header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-primary/20 shadow-card">
			<div className="container mx-auto px-4 lg:px-8">
				<div className="flex items-center justify-between h-16 lg:h-20">
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-2 group">
						<div className="bg-gradient-luxury p-2 rounded-lg shadow-glow group-hover:shadow-luxury transition-all duration-300">
							<span className="text-primary-foreground font-bold text-lg">
								H
							</span>
						</div>
						<div>
							<h1 className="text-xl lg:text-2xl font-bold text-gradient">
								Hair by Urban
							</h1>
							<p className="text-xs text-muted-foreground hidden sm:block">
								Luxury Hair Collection
							</p>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center space-x-8">
						{navigation.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								className={`text-sm font-medium transition-all duration-300 relative group ${
									isActivePage(item.path)
										? "text-primary"
										: "text-foreground hover:text-primary"
								}`}
							>
								{item.name}
								<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-luxury group-hover:w-full transition-all duration-300" />
							</Link>
						))}
					</nav>

					{/* Action Buttons */}
					<div className="flex items-center space-x-4 relative">
						{/* Admin Dashboard Icon - Only show if user is admin */}
						{isAdmin && (
							<Button 
								variant="ghost" 
								size="icon" 
								className="hidden sm:flex text-primary hover:text-primary-dark hover:bg-accent-muted"
								onClick={() => navigate('/admin')}
								title="Admin Dashboard"
							>
								<FaCog className="h-5 w-5" />
							</Button>
						)}

						{/* Theme Toggle */}
						<ThemeToggle />

						{/* User Menu */}
						<div
							className="relative"
							onMouseEnter={() => setShowUserMenu(true)}
							onMouseLeave={() => setTimeout(() => {
								setShowUserMenu(false)
							}, 5000)}
						>
							<Button 
								variant="ghost" 
								size="icon" 
								onClick={() => setShowUserMenu(!showUserMenu)}
								className="relative hover:bg-accent-muted"
							>
								<FaUser className="h-5 w-5" />
								{user && (
									<FaChevronDown className="h-2 w-2 absolute -bottom-1 -right-1 text-primary" />
								)}
							</Button>

							{showUserMenu && (
								<div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-luxury z-50 overflow-hidden">
									<div className="py-1">
										{user ? (
											<>
												{/* User Info Header */}
												<div className="px-4 py-3 border-b border-border bg-muted/30">
													<div className="flex items-center space-x-2">
														<FaUserCircle className="h-5 w-5 text-primary" />
														<div className="min-w-0 flex-1">
															<p className="text-sm font-medium text-foreground truncate">
																{user.first_name} {user.last_name}
															</p>
															<p className="text-xs text-muted-foreground truncate">
																@{user.username}
															</p>
														</div>
													</div>
												</div>

												{/* Menu Items */}
												<Link 
													to="/account" 
													className="flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-accent-muted transition-colors"
													onClick={() => setShowUserMenu(false)}
												>
													<FaUserCircle className="h-4 w-4 text-muted-foreground" />
													<span>My Account</span>
												</Link>

												{isAdmin && (
													<Link 
														to="/admin" 
														className="flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-accent-muted transition-colors"
														onClick={() => setShowUserMenu(false)}
													>
														<FaCog className="h-4 w-4 text-primary" />
														<span>Admin Dashboard</span>
													</Link>
												)}

												<hr className="border-border my-1" />

												<button 
													onClick={handleLogout}
													className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
												>
													<FaSignOutAlt className="h-4 w-4" />
													<span>Logout</span>
												</button>
											</>
										) : (
											<Link 
												to="/login" 
												className="flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-accent-muted transition-colors"
												onClick={() => setShowUserMenu(false)}
											>
												<FaSignInAlt className="h-4 w-4 text-primary" />
												<span>Login / Register</span>
											</Link>
										)}
									</div>
								</div>
							)}
						</div>

						{/* Cart */}
						<Button 
							onClick={() => navigate("/cart")} 
							variant="ghost" 
							size="icon" 
							className="relative hover:bg-accent-muted"
						>
							<FaShoppingCart className="h-5 w-5" />
							{cartCount > 0 && (
								<span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
									{cartCount}
								</span>
							)}
						</Button>

						{/* Mobile Menu Toggle */}
						<Button 
							variant="ghost" 
							size="icon" 
							className="lg:hidden hover:bg-accent-muted" 
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							{isMenuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isMenuOpen && (
				<div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-primary/20">
					<div className="container mx-auto px-4 py-4">
						<nav className="space-y-3">
							{navigation.map((item) => (
								<Link
									key={item.path}
									to={item.path}
									className={`block py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
										isActivePage(item.path)
											? "bg-accent text-primary"
											: "text-foreground hover:bg-accent hover:text-primary"
									}`}
									onClick={() => setIsMenuOpen(false)}
								>
									{item.name}
								</Link>
							))}

							{/* Mobile Admin Link */}
							{isAdmin && (
								<Link
									to="/admin"
									className="flex items-center space-x-3 py-2 px-4 rounded-lg text-sm font-medium text-primary hover:bg-accent transition-all duration-300"
									onClick={() => setIsMenuOpen(false)}
								>
									<FaCog className="h-4 w-4" />
									<span>Admin Dashboard</span>
								</Link>
							)}

							{/* Mobile User Actions */}
							<div className="pt-2 mt-3 border-t border-border">
								{user ? (
									<>
										<div className="px-4 py-2 text-xs text-muted-foreground">
											Logged in as <span className="font-medium text-foreground">@{user.username}</span>
										</div>
										<Link
											to="/account"
											className="flex items-center space-x-3 py-2 px-4 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-all duration-300"
											onClick={() => setIsMenuOpen(false)}
										>
											<FaUserCircle className="h-4 w-4" />
											<span>My Account</span>
										</Link>
										<button
											onClick={() => {
												handleLogout();
												setIsMenuOpen(false);
											}}
											className="flex items-center space-x-3 w-full py-2 px-4 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-300"
										>
											<FaSignOutAlt className="h-4 w-4" />
											<span>Logout</span>
										</button>
									</>
								) : (
									<Link
										to="/login"
										className="flex items-center space-x-3 py-2 px-4 rounded-lg text-sm font-medium text-primary hover:bg-accent transition-all duration-300"
										onClick={() => setIsMenuOpen(false)}
									>
										<FaSignInAlt className="h-4 w-4" />
										<span>Login / Register</span>
									</Link>
								)}
							</div>
						</nav>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;