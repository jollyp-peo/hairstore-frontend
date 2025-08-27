import { useState } from "react";
import { Search, Filter, Grid, List, Star, ShoppingCart } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Mock product data
const products = [
	{
		id: 1,
		name: "Premium Silk Hair Extensions",
		price: 150000,
		originalPrice: 165000,
		category: "extensions",
		image: "/src/assets/hero-hair-extensions.jpg",
		rating: 4.9,
		reviews: 128,
		inStock: true,
		featured: true,
	},
	{
		id: 2,
		name: "Luxury Hair Growth Oil",
		price: 30000,
		category: "care",
		image: "/src/assets/hair-care-products.jpg",
		rating: 4.8,
		reviews: 95,
		inStock: true,
		featured: false,
	},
	{
		id: 3,
		name: "Premium Lace Front Wig",
		price: 250000,
		category: "wigs",
		image: "/src/assets/luxury-wig.jpg",
		rating: 5.0,
		reviews: 67,
		inStock: true,
		featured: true,
	},
	{
		id: 4,
		name: "Hydrating Hair Mask Set",
		price: 65000,
		category: "care",
		image: "/src/assets/hair-care-products.jpg",
		rating: 4.7,
		reviews: 203,
		inStock: true,
		featured: false,
	},
	{
		id: 5,
		name: "Clip-In Hair Extensions",
		price: 28000,
		category: "extensions",
		image: "/src/assets/hero-hair-extensions.jpg",
		rating: 4.6,
		reviews: 156,
		inStock: false,
		featured: false,
	},
	{
		id: 6,
		name: "Curly Hair Wig Collection",
		price: 270000,
		category: "wigs",
		image: "/src/assets/luxury-wig.jpg",
		rating: 4.9,
		reviews: 89,
		inStock: true,
		featured: true,
	},
];

const Products = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [sortBy, setSortBy] = useState("featured");
	const [viewMode, setViewMode] = useState("grid");
	const { addToCart } = useCart();
	const navigate = useNavigate();

	const categories = [
		{ id: "all", name: "All Products" },
		{ id: "extensions", name: "Hair Extensions" },
		{ id: "wigs", name: "Wigs" },
		{ id: "care", name: "Hair Care" },
	];

	const sortOptions = [
		{ id: "featured", name: "Featured" },
		{ id: "price-low", name: "Price: Low to High" },
		{ id: "price-high", name: "Price: High to Low" },
		{ id: "rating", name: "Highest Rated" },
		{ id: "newest", name: "Newest" },
	];

	const filteredProducts = products
		.filter((product) => {
			const matchesSearch = product.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesCategory =
				selectedCategory === "all" || product.category === selectedCategory;
			return matchesSearch && matchesCategory;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "price-low":
					return a.price - b.price;
				case "price-high":
					return b.price - a.price;
				case "rating":
					return b.rating - a.rating;
				case "featured":
					return b.featured ? 1 : -1;
				default:
					return 0;
			}
		});

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="bg-gradient-hero text-white py-16">
				<div className="container mx-auto px-4 lg:px-8 text-center">
					<h1 className="text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
						Premium Hair Collection
					</h1>
					<p className="text-xl text-white/90 max-w-2xl mx-auto animate-fade-in">
						Discover our complete range of luxury hair products
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 lg:px-8 py-8">
				{/* Filters and Search */}
				<div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
					{/* Search */}
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<input
							type="text"
							placeholder="Search products..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-3 border border-border text-primary rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>

					{/* Filters */}
					<div className="flex flex-wrap gap-4 items-center text-primary">
						{/* Category Filter */}
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="px-4 py-2 border border-border rounded-lg bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary"
						>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>

						{/* Sort */}
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="px-4 py-2 border border-border rounded-lg bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary"
						>
							{sortOptions.map((option) => (
								<option key={option.id} value={option.id}>
									{option.name}
								</option>
							))}
						</select>

						{/* View Mode */}
						<div className="flex border border-border rounded-lg overflow-hidden">
							<Button
								variant={viewMode === "grid" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("grid")}
								className="rounded-none"
							>
								<Grid className="h-4 w-4" />
							</Button>
							<Button
								variant={viewMode === "list" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("list")}
								className="rounded-none"
							>
								<List className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>

				{/* Results Count */}
				<div className="mb-6">
					<p className="text-muted-foreground">
						Showing {filteredProducts.length} of {products.length} products
					</p>
				</div>

				{/* Products Grid/List */}
				<div
					className={`${
						viewMode === "grid"
							? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
							: "space-y-6"
					}`}
				>
					{filteredProducts.map((product, index) => (
						<div
							key={product.id}
							className={`group bg-card rounded-2xl shadow-card hover:shadow-luxury transition-all duration-300 hover-lift animate-scale-in ${
								viewMode === "list"
									? "flex flex-col sm:flex-row overflow-hidden"
									: "overflow-hidden"
							}`}
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							{/* Product Image */}
							<div
								className={`relative overflow-hidden ${
									viewMode === "list"
										? "sm:w-48 h-48 sm:h-auto"
										: "aspect-square"
								}`}
							>
								<img
									src={product.image}
									alt={product.name}
									className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
								/>
								{!product.inStock && (
									<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
										<span className="text-white font-semibold">
											Out of Stock
										</span>
									</div>
								)}
								{product.featured && (
									<div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 text-xs font-semibold rounded-full">
										Featured
									</div>
								)}
								{product.originalPrice && (
									<div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-semibold rounded-full">
										Sale
									</div>
								)}
							</div>

							{/* Product Info */}
							<div
								className={`p-4 ${
									viewMode === "list"
										? "flex-1 flex flex-col justify-between"
										: ""
								}`}
							>
								<div>
									<h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
										{product.name}
									</h3>

									{/* Rating */}
									<div className="flex items-center gap-2 mb-3">
										<div className="flex items-center">
											{[...Array(5)].map((_, i) => (
												<Star
													key={i}
													className={`h-4 w-4 ${
														i < Math.floor(product.rating)
															? "text-primary fill-primary"
															: "text-muted-foreground"
													}`}
												/>
											))}
										</div>
										<span className="text-sm text-muted-foreground">
											{product.rating} ({product.reviews} reviews)
										</span>
									</div>

									{/* Price */}
									<div className="flex items-center gap-2 mb-4">
										<span className="text-2xl font-bold text-primary">
											{product.price.toLocaleString("en-NG", {
												style: "currency",
												currency: "NGN",
											})}
										</span>
										{product.originalPrice && (
											<span className="text-sm text-muted-foreground line-through">
												{product.originalPrice.toLocaleString("en-NG", {
													style: "currency",
													currency: "NGN",
												})}
											</span>
										)}
									</div>
								</div>

								{/* Actions */}
								<div className="flex gap-2">
									<Button
										variant="gold"
										className="flex-1"
										disabled={!product.inStock}
										onClick={() =>
											addToCart(product, {
												quantity: 1,
											})
										}
									>
										<ShoppingCart className="h-4 w-4 mr-2" />
										{product.inStock ? "Add to Cart" : "Out of Stock"}
									</Button>
									<Button
										variant="outline"
										size="icon"
										onClick={() => navigate(`/products/${product.id}`)}
									>
										<Search className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Empty State */}
				{filteredProducts.length === 0 && (
					<div className="text-center py-16">
						<div className="max-w-md mx-auto">
							<Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-2">No products found</h3>
							<p className="text-muted-foreground mb-4">
								Try adjusting your search or filter criteria
							</p>
							<Button
								variant="outline"
								onClick={() => {
									setSearchTerm("");
									setSelectedCategory("all");
								}}
							>
								Clear Filters
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Products;
