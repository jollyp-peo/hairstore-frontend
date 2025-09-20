import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import TextInput from "../../components/inputs/TextInput";
import TextArea from "../../components/inputs/TextArea";
import FileInput from "../../components/inputs/FileInput";
import CheckboxInput from "../../components/inputs/CheckboxInput";
import { Button } from "../../components/ui/Button";

const API_URL = import.meta.env.VITE_API_URL;

const ProductEdit = () => {
	const { apiFetch } = useAuth();
	const { id } = useParams();
	const navigate = useNavigate();

	const [form, setForm] = useState(null);
	const [loading, setLoading] = useState(true);

	// Fetch product to edit
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const res = await fetch(`${API_URL}/api/products/${id}`);
				const result = await res.json();

				const product = result.data; //unwrap the product object

				setForm({
					name: product.name ?? "",
					category: product.category ?? "",
					featured: product.featured ?? false,
					in_stock: product.in_stock ?? true,
					rating: product.rating ?? 0,
					reviews: product.reviews ?? 0,
					details: {
						description: product.details?.description ?? "",
						features: product.details?.features?.length
							? product.details.features
							: [""],
						specifications: product.details?.specifications
							? Object.entries(product.details.specifications).map(
									([key, value]) => ({
										key,
										value,
									})
							  )
							: [{ key: "", value: "" }],
					},
					image: product.image || null,
					variants:
						product.variants?.length > 0
							? product.variants.map((v) => ({
									...v,
									image: v.image || null,
							  }))
							: [
									{
										color: "",
										length: "",
										lace: "",
										price: "",
										original_price: "",
										stock: 0,
										image: null,
									},
							  ],
				});
				setLoading(false);
			} catch (err) {
				console.error("Failed to load product", err);
			}
		};
		fetchProduct();
	}, [id]);

	// Handlers
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleDetailChange = (field, value) => {
		setForm((prev) => ({
			...prev,
			details: { ...prev.details, [field]: value },
		}));
	};

	const handleFeatureChange = (i, value) => {
		const updated = [...form.details.features];
		updated[i] = value;
		setForm((prev) => ({
			...prev,
			details: { ...prev.details, features: updated },
		}));
	};

	const addFeature = () => {
		setForm((prev) => ({
			...prev,
			details: { ...prev.details, features: [...prev.details.features, ""] },
		}));
	};

	const removeFeature = (i) => {
		setForm((prev) => ({
			...prev,
			details: {
				...prev.details,
				features: prev.details.features.filter((_, idx) => idx !== i),
			},
		}));
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

	const handleVariantChange = (i, field, value) => {
		const updated = [...form.variants];
		updated[i][field] = value;
		setForm((prev) => ({ ...prev, variants: updated }));
	};

	const handleVariantFileChange = (i, file) => {
		const updated = [...form.variants];
		updated[i].image = file;
		setForm((prev) => ({ ...prev, variants: updated }));
	};

	const addVariant = () => {
		setForm((prev) => ({
			...prev,
			variants: [
				...prev.variants,
				{
					color: "",
					length: "",
					lace: "",
					price: "",
					original_price: "",
					stock: 0,
					image: null,
				},
			],
		}));
	};

	const removeVariant = (i) => {
		setForm((prev) => ({
			...prev,
			variants: prev.variants.filter((_, idx) => idx !== i),
		}));
	};

	// Handle update submit
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append("name", form.name);
			formData.append("category", form.category);
			formData.append("featured", String(form.featured));
			formData.append("in_stock", String(form.in_stock));
			formData.append("rating", String(form.rating));
			formData.append("reviews", String(form.reviews));

			const detailsForDB = {
				...form.details,
				specifications: form.details.specifications.reduce((acc, spec) => {
					if (spec.key && spec.value) acc[spec.key] = spec.value;
					return acc;
				}, {}),
			};
			formData.append("details", JSON.stringify(detailsForDB));

			if (form.image && form.image instanceof File) {
				formData.append("image", form.image); // only if new upload
			}

			const variantsData = form.variants.map((v) => ({
				color: v.color,
				length: v.length,
				lace: v.lace,
				price: parseFloat(v.price) || 0,
				original_price: v.original_price ? parseFloat(v.original_price) : null,
				stock: parseInt(v.stock) || 0,
			}));
			formData.append("variants", JSON.stringify(variantsData));

			form.variants.forEach((v) => {
				if (v.image && v.image instanceof File) {
					formData.append("variants", v.image);
				}
			});

			setLoading(true);
			const response = await apiFetch(`${API_URL}/api/products/${id}`, {
				method: "PUT",
				body: formData,
			});

			if (!response.ok) {
				const errText = await response.text();
				throw new Error(errText || "Update failed");
			}

			toast.success("Product updated successfully!");
			navigate(`/products/${id}`);
		} catch (err) {
			toast.error(err.message);
		} finally {
			setLoading(false);
		}
	};

	if (!form) {
		return loading && <p className="text-center py-6">Loading product...</p>;
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
						Update your products with details, images, specifications & variants
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 lg:px-8 py-8">
				<Button variant="ghost" className="mb-6">
					<Link to="/admin/products">
						<span className="flex items-center">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Admin Products
						</span>
					</Link>
				</Button>

				<form
					onSubmit={handleSubmit}
					className="p-6 max-w-4xl mx-auto space-y-6 bg-background shadow-md rounded-lg"
				>
					<h2 className="text-2xl font-semibold">Update Product</h2>

					{/* Basic Info */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<TextInput
							label="Name"
							name="name"
							value={form.name}
							onChange={handleChange}
							required
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
							step="0.1"
							min="0"
							max="5"
							value={form.rating}
							onChange={handleChange}
						/>
						<TextInput
							label="Reviews"
							name="reviews"
							type="number"
							min="0"
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

					{/* Description */}
					<TextArea
						label="Description"
						value={form.details.description}
						onChange={(e) => handleDetailChange("description", e.target.value)}
					/>

					{/* Features */}
					<div className="space-y-2">
						<h3 className="font-medium">Features</h3>
						{form.details.features.map((f, i) => (
							<div key={i} className="flex gap-2 items-center">
								<TextInput
									value={f}
									onChange={(e) => handleFeatureChange(i, e.target.value)}
									placeholder="Feature"
								/>
								<Button
									type="button"
									onClick={() => removeFeature(i)}
									className="text-red-500 hover:underline"
								>
									✕
								</Button>
							</div>
						))}
						<Button type="button" onClick={addFeature}>
							+ Add Feature
						</Button>
					</div>

					{/* Specifications */}
					<div className="space-y-2">
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
						<Button type="button" onClick={addSpecification}>
							+ Add Specification
						</Button>
					</div>

					{/* Cover Image */}
					<div className="space-y-2">
						<h3 className="font-medium">Cover Image</h3>
						{form.image && typeof form.image === "string" && (
							<img
								src={form.image}
								alt="Current cover"
								className="h-24 w-24 object-cover mb-2 rounded"
							/>
						)}
						<FileInput
							label="New Cover Image (optional)"
							name="image"
							onChange={(e) =>
								setForm((prev) => ({ ...prev, image: e.target.files[0] }))
							}
						/>
					</div>

					{/* Variants */}
					<div className="space-y-3">
						<h3 className="font-medium">Variants</h3>
						{form.variants.map((v, i) => (
							<div key={i} className="p-4 border rounded-lg space-y-2">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
									<TextInput
										label="Color"
										value={v.color}
										onChange={(e) =>
											handleVariantChange(i, "color", e.target.value)
										}
										required
									/>
									<TextInput
										label="Length"
										value={v.length}
										onChange={(e) =>
											handleVariantChange(i, "length", e.target.value)
										}
										required
									/>
									<TextInput
										label="Lace"
										value={v.lace}
										onChange={(e) =>
											handleVariantChange(i, "lace", e.target.value)
										}
										required
									/>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
									<TextInput
										label="Price"
										type="number"
										step="0.01"
										value={v.price}
										onChange={(e) =>
											handleVariantChange(i, "price", e.target.value)
										}
										required
									/>
									<TextInput
										label="Original Price"
										type="number"
										step="0.01"
										value={v.original_price}
										onChange={(e) =>
											handleVariantChange(i, "original_price", e.target.value)
										}
									/>
									<TextInput
										label="Stock"
										type="number"
										value={v.stock}
										onChange={(e) =>
											handleVariantChange(i, "stock", e.target.value)
										}
									/>
								</div>

								{/* Variant Image */}
								<div className="space-y-2">
									{v.image && typeof v.image === "string" && (
										<img
											src={v.image}
											alt="Current variant"
											className="h-20 w-20 object-cover mb-2 rounded"
										/>
									)}
									<FileInput
										label="New Variant Image (optional)"
										onChange={(e) =>
											handleVariantFileChange(i, e.target.files[0])
										}
									/>
								</div>

								<Button
									type="button"
									onClick={() => removeVariant(i)}
									className="text-white bg-red-500 hover:underline"
								>
									Remove Variant
								</Button>
							</div>
						))}
						<Button type="button" variant="luxury" onClick={addVariant}>
							+ Add Variant
						</Button>
					</div>

					<Button type="submit" variant="luxury" className="w-full">
						{loading ? "Updating..." : "Update Product"}
					</Button>
				</form>
			</div>
		</div>
	);
};

export default ProductEdit;
