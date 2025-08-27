import { useState } from "react";
import TextInput from "../../components/inputs/TextInput";
import TextArea from "../../components/inputs/TextArea";
import FileInput from "../../components/inputs/FileInput";
import CheckboxInput from "../../components/inputs/CheckboxInput";
import { Button } from "../../components/ui/Button";

const API_URL = import.meta.env.VITE_API_URL;

const ProductUpload = () => {
	const [form, setForm] = useState({
		name: "",
		slug: "",
		price: "",
		original_price: "",
		category: "",
		featured: false,
		in_stock: true,
		rating: 0,
		reviews: 0,
		details: {
			description: "",
			features: [""],
			specifications: [{ key: "", value: "" }],
			options: { lengths: [""], colors: [""] },
		},
		image: null,
		gallery: [],
	});
	const [loading, setLoading] = useState(false);

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
			const res = await fetch(`${API_URL}/api/products`, {
				method: "POST",
				body: formData,
			});

			if (!res.ok) throw new Error("Upload failed");

			alert("Product uploaded!");
			setLoading(false);
			// reset logic here
			setForm({
				name: "",
				price: "",
				original_price: "",
				category: "",
				featured: false,
				in_stock: true,
				rating: 0,
				reviews: 0,
				details: {
					description: "",
					features: [""],
					specifications: [{ key: "", value: "" }],
					options: { lengths: [""], colors: [""] },
				},
				image: null,
				gallery: [],
			});
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="p-6 max-w-4xl mx-auto space-y-6 bg-background shadow-md rounded-lg"
		>
			<h2 className="text-2xl font-semibold">Upload Product</h2>

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
					className="px-3 py-1 rounded hover:bg-gray-300"
				>
					+ Add Specification
				</Button>
			</div>

			{/* File Uploads */}
			<FileInput label="Main Image" name="image" onChange={handleFileChange} />
			<FileInput
				label="Gallery Images"
				name="gallery"
				onChange={handleFileChange}
				multiple
			/>

			{/* Preview */}
			<div className="border rounded-lg p-4 bg-background">
				<h3 className="text-lg font-semibold mb-2">Preview</h3>
				<p>
					<strong>Name:</strong> {form.name}
				</p>
				<p>
					<strong>Price:</strong> NGN{form.price}
				</p>
				<p>
					<strong>Category:</strong> {form.category}
				</p>
				<p>
					<strong>Features:</strong> {form.details.features.join(", ")}
				</p>
				<p>
					<strong>Lengths:</strong> {form.details.options.lengths.join(", ")}
				</p>
				<p>
					<strong>Colors:</strong> {form.details.options.colors.join(", ")}
				</p>
				<p>
					<strong>Description:</strong> {form.details.description}
				</p>
				<div className="mt-2">
					{form.image && (
						<img
							src={URL.createObjectURL(form.image)}
							alt="Main"
							className="h-32 object-cover rounded"
						/>
					)}
				</div>
				<div className="flex gap-2 mt-2">
					{form.gallery.length > 0 &&
						form.gallery.map((file, i) => (
							<img
								key={i}
								src={URL.createObjectURL(file)}
								alt={`Gallery ${i}`}
								className="h-20 object-cover rounded"
							/>
						))}
				</div>
			</div>

			<Button
				type="submit"
				variant="luxury"
				className="w-full  text-primary py-2 rounded-lg hover:bg-blue-700"
			>
				{loading ? "Uploading..." : "Upload Product"}
			</Button>
		</form>
	);
};

export default ProductUpload;
