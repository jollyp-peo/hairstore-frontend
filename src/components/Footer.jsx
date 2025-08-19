import { Link } from "react-router-dom";
import { Button } from "./ui/Button";

// React Icons
import {
	FaInstagram,
	FaFacebookF,
	FaXTwitter,
	FaTiktok,
} from "react-icons/fa6";
import {
	HiOutlineMail,
	HiOutlinePhone,
	HiOutlineLocationMarker,
} from "react-icons/hi";

const Footer = () => {
	return (
		<footer className="bg-secondary text-secondary-foreground overflow-hidden">
			<div className="container mx-auto px-4 lg:px-8">
				{/* Main Footer Content */}
				<div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand Section */}
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<div className="bg-gradient-luxury p-2 rounded-lg shadow-glow">
								<span className="text-primary-foreground font-bold text-lg">
									H
								</span>
							</div>
							<div>
								<h2 className="text-xl font-bold text-gradient">
									Hair by Urban
								</h2>
								<p className="text-xs text-muted-foreground">
									Luxury Hair Collection
								</p>
							</div>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Transform your look with our premium collection of hair
							extensions, wigs, and luxury hair care products. Quality and
							elegance redefined.
						</p>
						<div className="flex space-x-4">
							<Button
								variant="hero"
								size="icon"
								className="cursor-pointer transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
							>
								<FaInstagram className="h-5 w-5" />
							</Button>

							<Button
								variant="hero"
								size="icon"
								className="cursor-pointer transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
							>
								<FaFacebookF className="h-5 w-5" />
							</Button>

							<Button
								variant="hero"
								size="icon"
								className="cursor-pointer transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
							>
								<FaXTwitter className="h-5 w-5" />
							</Button>
							<Button
								variant="hero"
								size="icon"
								className="cursor-pointer transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
							>
								<FaTiktok className="h-5 w-5" />
							</Button>
						</div>
					</div>

					{/* Quick Links */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-primary">Quick Links</h3>
						<nav className="space-y-2">
							{[
								{ name: "Home", path: "/" },
								{ name: "All Products", path: "/products" },
								{
									name: "Hair Extensions",
									path: "/products?category=extensions",
								},
								{ name: "Wigs", path: "/products?category=wigs" },
								{ name: "Hair Care", path: "/products?category=care" },
								{ name: "Collections", path: "/collections" },
							].map((link) => (
								<Link
									key={link.path}
									to={link.path}
									className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
								>
									{link.name}
								</Link>
							))}
						</nav>
					</div>

					{/* Customer Service */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-primary">
							Customer Service
						</h3>
						<nav className="space-y-2">
							{[
								"Contact Us",
								"Size Guide",
								"Care Instructions",
								"Shipping & Returns",
								"FAQ",
								"Track Your Order",
							].map((link) => (
								<a
									key={link}
									href="#"
									className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
								>
									{link}
								</a>
							))}
						</nav>
					</div>

					{/* Contact Info + Newsletter */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-primary">Get in Touch</h3>
						<div className="space-y-3">
							<div className="flex items-center space-x-3">
								<HiOutlinePhone className="h-4 w-4 text-primary" />
								<span className="text-sm text-muted-foreground">
									+234(0) 906294457
								</span>
								
							</div>
							<div className="flex items-center ml-6">
								{/* <HiOutlinePhone className="h-4 w-4 text-primary" /> */}
								<span className="text-sm text-muted-foreground">
									+234(0) 8168329244
								</span>
								
							</div>
							<div className="flex items-center ml-6">
								{/* <HiOutlinePhone className="h-4 w-4 text-primary" /> */}
								<span className="text-sm text-muted-foreground">
									+234(0) 7068450715
								</span>
								
							</div>
							<div className="flex items-center space-x-3">
								<HiOutlineMail className="h-4 w-4 text-primary" />
								<span className="text-sm text-muted-foreground">
									hairbyurban01@gmail.com
								</span>
							</div>
							<div className="flex items-center space-x-3">
								<HiOutlineLocationMarker className="h-4 w-4 text-primary" />
								<span className="text-sm text-muted-foreground">
									Kev Plaza Road 2B 34B Ikota Villa estate, Lekki Lagos, Nigeria.
								</span>
							</div>
						</div>

						{/* Newsletter Signup */}
						<div className="mt-6 p-4 bg-card rounded-lg border border-primary/20">
							<h4 className="text-sm font-semibold text-primary mb-2">
								Stay Updated
							</h4>
							<p className="text-xs text-muted-foreground mb-3">
								Get exclusive offers and hair care tips delivered to your inbox.
							</p>
							<form className="flex flex-col sm:flex-row gap-2 w-full">
								<input
									type="email"
									placeholder="Your email"
									className="flex-1 px-3 py-2 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full"
								/>
								<Button variant="gold" size="sm" className="w-full sm:w-auto">
									Subscribe
								</Button>
							</form>
						</div>
					</div>
				</div>

				{/* Bottom Footer */}
				<div className="py-6 border-t border-primary/20">
					<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						<p className="text-sm text-muted-foreground">
							&copy; {new Date().getFullYear()} Hair by Urban. All rights
							reserved.
						</p>
						<div className="flex space-x-6">
							<a
								href="#"
								className="text-sm text-muted-foreground hover:text-primary transition-colors"
							>
								Privacy Policy
							</a>
							<a
								href="#"
								className="text-sm text-muted-foreground hover:text-primary transition-colors"
							>
								Terms of Service
							</a>
							<a
								href="#"
								className="text-sm text-muted-foreground hover:text-primary transition-colors"
							>
								Cookie Policy
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
