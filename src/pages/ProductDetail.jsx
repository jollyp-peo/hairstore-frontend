import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useCart } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [coverImage, setCoverImage] = useState("");
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [variantQuantities, setVariantQuantities] = useState({});

  // fetch product
  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const result = await res.json();

        if (!res.ok || !result.success)
          throw new Error(result?.error || "Failed to load product");
        if (!mounted) return;

        setProduct(result.data);
        setCoverImage(result.data.cover_image);

        // Initialize variant quantities by ID
        const initialQuantities = {};
        result.data.variants?.forEach((variant) => {
          initialQuantities[variant.id] = 0;
        });
        setVariantQuantities(initialQuantities);
      } catch (err) {
        console.error("Failed to load product", err);
        toast.error("Failed to load product. Please try again.");
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Show all variants (no grouping)
  const allVariants = useMemo(() => {
    return product?.variants || [];
  }, [product]);

  const updateVariantQuantity = (variantId, change) => {
    setVariantQuantities((prev) => ({
      ...prev,
      [variantId]: Math.max(0, (prev[variantId] || 0) + change),
    }));
  };

  const handleVariantImageClick = (variant) => {
    if (variant.image) {
      setCoverImage(variant.image);
    }
  };

  const handleAddToCart = (variant) => {
    const quantity = variantQuantities[variant.id] || 0;

    if (quantity === 0) {
      toast.error("Please select a quantity.");
      return;
    }

    addToCart(product, { variant, quantity });
    toast.success(`Added ${quantity}x ${product.name} to cart`);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Product...</h1>
          <Button>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pb-16">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6">
          <Link to="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative flex items-center justify-center rounded-2xl overflow-hidden bg-card shadow-card mx-auto w-full h-96">
              {/* Blurred Background */}
              <div
                className="absolute inset-0 bg-center bg-cover blur-lg scale-110"
                style={{ backgroundImage: `url(${coverImage})` }}
              />

              {/* Dark overlay on the blurred background */}
              <div className="absolute inset-0 bg-black/30 z-10" />

              {/* Foreground Image */}
              <img
                src={coverImage}
                alt={product.name}
                className="relative z-20 w-full h-full object-contain rounded-2xl"
              />

              {/* Out of Stock Overlay */}
              {!product.in_stock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
                  <span className="text-white font-semibold">Out of Stock</span>
                </div>
              )}

              {/* Featured Badge */}
              {product.featured && (
                <div className="absolute top-3 left-12 bg-primary text-primary-foreground px-2 py-1 text-xs font-semibold rounded-full z-30">
                  Featured
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-primary font-medium mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-primary fill-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price Range */}
              <div className="flex items-center gap-4 mb-6">
                {allVariants.length > 0 && (
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {Math.min(
                        ...allVariants.map((v) => v.price)
                      ).toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                      {allVariants.length > 1 && (
                        <span className="text-lg">
                          {" "}
                          -{" "}
                          {Math.max(
                            ...allVariants.map((v) => v.price)
                          ).toLocaleString("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          })}
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Variants List */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Available Variants</h3>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {allVariants.map((variant) => {
                  const quantity = variantQuantities[variant.id] || 0;

                  return (
                    <div
                      key={variant.id}
                      className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      {/* Variant Info: Image + Details */}
                      <div className="flex items-center gap-4">
                        {/* Variant Thumbnail */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => handleVariantImageClick(variant)}
                            className="w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                          >
                            <img
                              src={variant.image || product.cover_image}
                              alt={`${variant.color} variant`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        </div>

                        {/* Variant Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-medium">
                              {variant.color}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                              {variant.length}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                              {variant.lace}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                              {variant.price.toLocaleString("en-NG", {
                                style: "currency",
                                currency: "NGN",
                              })}
                            </span>
                            {variant.original_price && (
                              <span className="line-through text-muted-foreground text-sm">
                                {variant.original_price.toLocaleString(
                                  "en-NG",
                                  {
                                    style: "currency",
                                    currency: "NGN",
                                  }
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="my-4 border-t border-border"></div>

                      {/* Quantity & Add to Cart BELOW the card */}
                      <div className="flex items-center gap-3 justify-start">
                        <button
                          onClick={() => updateVariantQuantity(variant.id, -1)}
                          disabled={quantity === 0}
                          className="w-8 h-8 border border-border rounded-lg flex items-center justify-center hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateVariantQuantity(variant.id, 1)}
                          className="w-8 h-8 border border-border rounded-lg flex items-center justify-center hover:border-primary"
                        >
                          <Plus className="h-4 w-4" />
                        </button>

                        <Button
                          variant="luxury"
                          size="sm"
                          onClick={() => handleAddToCart(variant)}
                          disabled={quantity === 0}
                          className="ml-2"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b border-border">
            <nav className="flex space-x-8">
              {["description", "features", "specs", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 font-medium transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "description"
                    ? "Description"
                    : tab === "features"
                    ? "Features"
                    : tab === "specs"
                    ? "Specifications"
                    : `Reviews (${product.reviews || 0})`}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            <div className="prose max-w-none">
              {activeTab === "description" && (
                <p>{product.details?.description || "No description."}</p>
              )}

              {activeTab === "features" && (
                <ul>
                  {product.details?.features?.map((f, i) => (
                    <li key={i}>{f}</li>
                  )) || <li>No features listed.</li>}
                </ul>
              )}

              {activeTab === "specs" && (
                <div>
                  {product.details?.specifications ? (
                    <ul>
                      {Object.entries(product.details.specifications).map(
                        ([k, v], i) => (
                          <li key={i}>
                            <strong>{k}:</strong> {v}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>No specifications available.</p>
                  )}
                </div>
              )}

              {activeTab === "reviews" && <p>No reviews yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
