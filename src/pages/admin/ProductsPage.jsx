import { useState } from "react";
import ProductUpload from "./ProductUpload";
import ProductList from "./ProductList";
import { Button } from "../../components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ProductsPage = () => {
	const [view, setView] = useState("list"); // "list" | "upload"

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Header */}
			<div className="bg-gradient-hero text-white py-12">
				<div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between">
					<div>
						<h1 className="text-3xl lg:text-4xl font-bold mb-2">{view === "list" ? "List Products" : "Upload Products"}</h1>
						<p className="text-white/90">
							Manage your products: view, edit, or upload new ones
						</p>
					</div>

					{/* Header Buttons */}
					<div className="mt-4 lg:mt-0 space-x-2">
						<Button
							variant={view === "list" ? "hero" : "gold"}
							onClick={() => setView("list")}
						>
							View Products
						</Button>
						<Button
							variant={view === "upload" ? "hero" : "gold"}
							onClick={() => setView("upload")}
						>
							Upload Product
						</Button>
					</div>
				</div>
			</div>

			{/* Back Button */}
			<div className="container mx-auto px-4 lg:px-8 py-2">
				<Button variant="ghost" className="mb-6">
					<Link to="/admin">
						<span className="flex items-center">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Dashboard
						</span>
					</Link>
				</Button>

				{/* Upload Form */}
			</div>

			{/* Page Content */}
			<div className="container mx-auto px-4 lg:px-8 py-8">
				<div className="bg-card shadow-card rounded-2xl p-6">
					{view === "list" ? <ProductList /> : <ProductUpload />}
				</div>
			</div>
		</div>
	);
};

export default ProductsPage;
