import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextInput from "../../components/inputs/TextInput";
import TextArea from "../../components/inputs/TextArea";
import FileInput from "../../components/inputs/FileInput";
import CheckboxInput from "../../components/inputs/CheckboxInput";
import { Button } from "../../components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL;

const ProductEdit = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [form, setForm] = useState(null);
	const [loading, setLoading] = useState(false);

	// Fetch product by ID
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const res = await fetch(`${API_URL}/api/products/${id}`);
				if (!res.ok) throw new Error("Failed to fetch product");
				const data = await res.json();

				// Ensure structure matches upload form
				setForm({
					...data,
					details: {
						description: data.details?.description || "",
						features: data.details?.features || [""],
						specifications: data.details?.specifications || [
							{ key: "", value: "" },
						],
						options: data.details?.options || { lengths: [""], colors: [""] },
					},
					image: null, // we won't preload image file, only show preview
					gallery: [],
				});
			} catch (err) {
				alert(err.message);
			}
		};
		fetchProduct();
	}, [id]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		if (name.startsWith("details.")) {
			const field = name.split(".")[1];
			if (field === "features") {
				setForm((prev) => ({
					...prev,
					details: {
						...prev.details,
						features: value.split(",").map((f) => f.trim()),
					},
				}));
			} else if (field === "description") {
				setForm((prev) => ({
					...prev,
					details: { ...prev.details, description: value },
				}));
			}
		} else if (name.startsWith("options.")) {
			const field = name.split(".")[1];
			setForm((prev) => ({
				...prev,
				details: {
					...prev.details,
					options: {
						...prev.details.options,
						[field]: value.split(",").map((v) => v.trim()),
					},
				},
			}));
		} else {
			setForm((prev) => ({
				...prev,
				[name]: type === "checkbox" ? checked : value,
			}));
		}
	};

	const handleFileChange = (e) => {
		const { name, files } = e.target;
		if (name === "image") {
			setForm((prev) => ({ ...prev, image: files[0] }));
		} else if (name === "gallery") {
			setForm((prev) => ({ ...prev, gallery: [...files] }));
		}
	};

	const handleSpecChange = (i, field, value) => {
		const updated = [...form.details.specifications];
		updated[i][field] = value;
		setForm((prev) => ({
			...prev,
			details: { ...prev.details, specifications: updated },
		}));
	};

	const addSpecification = () => {
		setForm((prev) => ({
			...prev,
			details: {
				...prev.details,
				specifications: [
					...prev.details.specifications,
					{ key: "", value: "" },
				],
			},
		}));
	};

	const removeSpecification = (i) => {
		setForm((prev) => ({
			...prev,
			details: {
				...prev.details,
				specifications: prev.details.specifications.filter(
					(_, idx) => idx !== i
				),
			},
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const formData = new FormData();
			Object.entries(form).forEach(([key, value]) => {
				if (key === "details") {
					formData.append("details", JSON.stringify(value));
				} else if (key === "gallery") {
					value.forEach((file) => formData.append("gallery", file));
				} else if (key === "image" && value) {
					formData.append("image", value);
				} else {
					formData.append(key, value);
				}
			});

			setLoading(true);
			const res = await fetch(`${API_URL}/api/products/${id}`, {
				method: "PUT",
				body: formData,
			});

			if (!res.ok) throw new Error("Update failed");

			alert("Product updated!");
			navigate("/admin/products"); // redirect back
		} catch (err) {
			alert(err.message);
		} finally {
			setLoading(false);
		}
	};

	if (!form) {
		return <p className="text-center py-6">Loading product...</p>;
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header Section */}
			<div className="bg-gradient-hero text-white py-12">
				<div className="container mx-auto px-4 lg:px-8">
					<h1 className="text-3xl lg:text-4xl font-bold mb-2">
						Update Products
					</h1>
					<p className="text-white/90">
						Update your products with details, images, and specifications
					</p>
				</div>
			</div>

			{/* Back Button */}
			<div className="container mx-auto px-4 lg:px-8 py-8">
				<Button variant="ghost" className="mb-6">
					<Link to="/admin/products">
						<span className="flex items-center">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Admin Products
						</span>
					</Link>
				</Button>

				{/* Upload Form */}
				<form
					onSubmit={handleSubmit}
					className="p-6 max-w-4xl mx-auto space-y-6 bg-background shadow-md rounded-lg"
				>
					<h2 className="text-2xl font-semibold">Edit Product</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<TextInput
							label="Name"
							name="name"
							value={form.name}
							onChange={handleChange}
							required
						/>
						<TextInput
							label="Price"
							name="price"
							type="number"
							value={form.price}
							onChange={handleChange}
							required
						/>
						<TextInput
							label="Original Price"
							name="original_price"
							type="number"
							value={form.original_price}
							onChange={handleChange}
						/>
						<TextInput
							label="Category"
							name="category"
							value={form.category}
							onChange={handleChange}
							required
						/>
						<TextInput
							label="Rating"
							name="rating"
							type="number"
							value={form.rating}
							onChange={handleChange}
						/>
						<TextInput
							label="Reviews"
							name="reviews"
							type="number"
							value={form.reviews}
							onChange={handleChange}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<CheckboxInput
							label="Featured"
							name="featured"
							checked={form.featured}
							onChange={handleChange}
						/>
						<CheckboxInput
							label="In Stock"
							name="in_stock"
							checked={form.in_stock}
							onChange={handleChange}
						/>
					</div>

					<TextArea
						label="Description"
						name="details.description"
						value={form.details.description}
						onChange={handleChange}
						placeholder="Product description"
					/>

					<TextInput
						label="Features (comma separated)"
						name="details.features"
						value={form.details.features.join(", ")}
						onChange={handleChange}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<TextInput
							label="Available Lengths (comma separated)"
							name="options.lengths"
							value={form.details.options.lengths.join(", ")}
							onChange={handleChange}
						/>
						<TextInput
							label="Available Colors (comma separated)"
							name="options.colors"
							value={form.details.options.colors.join(", ")}
							onChange={handleChange}
						/>
					</div>

					{/* Specifications */}
					<div className="space-y-3">
						<h3 className="font-medium">Specifications</h3>
						{form.details.specifications.map((spec, i) => (
							<div key={i} className="flex gap-2 items-center">
								<TextInput
									placeholder="Key"
									value={spec.key}
									onChange={(e) => handleSpecChange(i, "key", e.target.value)}
								/>
								<TextInput
									placeholder="Value"
									value={spec.value}
									onChange={(e) => handleSpecChange(i, "value", e.target.value)}
								/>
								<Button
									type="button"
									onClick={() => removeSpecification(i)}
									className="text-red-500 hover:underline"
								>
									✕
								</Button>
							</div>
						))}
						<Button
							type="button"
							variant="luxury"
							onClick={addSpecification}
							className="px-3 py-1 rounded"
						>
							+ Add Specification
						</Button>
					</div>

					{/* File Uploads */}
					<FileInput
						label="Main Image"
						name="image"
						onChange={handleFileChange}
					/>
					<FileInput
						label="Gallery Images"
						name="gallery"
						onChange={handleFileChange}
						multiple
					/>

					{/* Current Images */}
					{form.image_url && (
						<div className="mt-2">
							<h4 className="font-medium">Current Image:</h4>
							<img
								src={form.image_url}
								alt="Current"
								className="h-32 object-cover rounded"
							/>
						</div>
					)}

					<Button
						type="submit"
						variant="luxury"
						className="w-full py-2 rounded-lg"
					>
						{loading ? "Updating..." : "Update Product"}
					</Button>
				</form>
			</div>
		</div>
	);
};

export default ProductEdit;
