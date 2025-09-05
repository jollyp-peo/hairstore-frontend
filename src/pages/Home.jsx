import { Link } from "react-router-dom";
import { ArrowRight, Star, Sparkles, Crown } from "lucide-react";
import { Button } from "../components/ui/Button";
// import heroImage from "../assets/hero-hair-extensions.jpg";
import heroImage from "../assets/urban-home.jpeg";
import hairCareImage from "../assets/hair-care-products.jpg";
import luxuryWigImage from "../assets/luxury-wig.jpg";

const Home = () => {
	const collections = [
		{
			id: 1,
			name: "Premium Extensions",
			description: "Luxury virgin hair extensions",
			image: heroImage,
			link: "/products?category=extensions",
		},
		{
			id: 2,
			name: "Hair Care Essentials",
			description: "Professional-grade hair care products",
			image: hairCareImage,
			link: "/products?category=care",
		},
		{
			id: 3,
			name: "Luxury Wigs",
			description: "Hand-crafted premium wigs",
			image: luxuryWigImage,
			link: "/products?category=wigs",
		},
	];

	const features = [
		{
			icon: Crown,
			title: "Premium Quality",
			description: "Only the finest materials and craftsmanship",
		},
		{
			icon: Sparkles,
			title: "Luxury Experience",
			description: "Exceptional service and attention to detail",
		},
		{
			icon: Star,
			title: "Expert Care",
			description: "Professional guidance and support",
		},
	];

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative h-screen flex items-center justify-center overflow-hidden">
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat"
					style={{ backgroundImage: `url(${heroImage})` }}
				>
					<div className="absolute inset-0 bg-gradient-hero opacity-80" />
				</div>

				<div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
					<div className="max-w-4xl mx-auto animate-fade-in">
						<h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white">
							Luxury Hair
							<span className="block text-gradient">Redefined</span>
						</h1>
						<p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
							Transform your look with our premium luxury hair collections, Both in wigs, bundles, wholesales and hair care products.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button variant="luxury" size="xl">
								<Link to="/products">
									<span className="flex items-center">
										Shop Collection
										<ArrowRight className="ml-2 h-5 w-5" />
									</span>
								</Link>
							</Button>

							<Button variant="gold" size="xl">
								<Link to="/collections">Explore Collections</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Scroll Indicator */}
				<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
					<div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
						<div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-background">
				<div className="container mx-auto px-4 lg:px-8">
					<div className="text-center mb-16 animate-fade-in">
						<h2 className="text-4xl lg:text-5xl font-bold mb-4">
							Why Choose <span className="text-gradient">Hair by Urban</span>
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Experience the difference with our commitment to excellence and
							luxury
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<div
								key={index}
								className="text-center p-8 rounded-2xl bg-card shadow-card hover:shadow-luxury transition-all duration-300 hover-lift group animate-scale-in"
								style={{ animationDelay: `${index * 0.2}s` }}
							>
								<div className="bg-gradient-luxury p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
									<feature.icon className="h-8 w-8 text-primary-foreground" />
								</div>
								<h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
									{feature.title}
								</h3>
								<p className="text-muted-foreground">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Collections Section */}
			<section className="py-20 bg-muted/30">
				<div className="container mx-auto px-4 lg:px-8">
					<div className="text-center mb-16 animate-fade-in">
						<h2 className="text-4xl lg:text-5xl font-bold mb-4">
							Featured <span className="text-gradient">Collections</span>
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Discover our curated selection of premium hair products
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{collections.map((collection, index) => (
							<Link
								key={collection.id}
								to={collection.link}
								className="group relative overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-luxury transition-all duration-500 hover-lift animate-scale-in"
								style={{ animationDelay: `${index * 0.2}s` }}
							>
								<div className="aspect-[4/5] overflow-hidden">
									<img
										src={collection.image}
										alt={collection.name}
										className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
								</div>

								<div className="absolute bottom-0 left-0 right-0 p-6 text-white">
									<h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
										{collection.name}
									</h3>
									<p className="text-white/80 mb-4">{collection.description}</p>
									<Button variant="gold" size="sm">
										Shop Now
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-gradient-hero text-white">
				<div className="container mx-auto px-4 lg:px-8 text-center">
					<div className="max-w-3xl mx-auto animate-fade-in">
						<h2 className="text-4xl lg:text-5xl font-bold mb-6">
							Ready to Transform Your Look?
						</h2>
						<p className="text-xl text-white/90 mb-8">
							Join thousands of satisfied customers who trust Hair by Urban for
							their beauty needs
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button variant="luxury" size="xl">
								<Link to="/products" className="inline-flex items-center">
									<span className="flex items-center">
										Start Shopping
										<ArrowRight className="ml-2 h-5 w-5" />
									</span>
								</Link>
							</Button>
							<Button
								variant="outline"
								size="xl"
								className="border-white text-white hover:bg-white hover:text-black"
							>
								Book Consultation
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
