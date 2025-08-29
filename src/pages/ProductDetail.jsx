import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedLength, setSelectedLength] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  const scrollRef = useRef(null);

  const scrollThumbnails = (dir) => {
    if (scrollRef.current) {
      const scrollAmount = 120;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();

        const details = data.product_details?.[0] || {};
        const normalized = { ...data, details };

        setProduct(normalized);

        if (details?.options?.lengths?.length > 0) {
          setSelectedLength(details.options.lengths[0]);
        }
        if (details?.options?.colors?.length > 0) {
          setSelectedColor(details.options.colors[0]);
        }
      } catch (err) {
        console.error("Failed to load product", err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Product...</h1>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const lengthOptions = product?.details?.options?.lengths || [];
  const colorOptions = product?.details?.options?.colors || [];

  const handleAddToCart = () => {
    addToCart(product, {
      quantity,
      length: selectedLength,
      color: selectedColor,
    });
  };

  return (
    <div className="min-h-screen bg-background">
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
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-card shadow-card relative">
              <img
                src={
                  selectedImage === 0
                    ? product.image
                    : product.details?.images?.[selectedImage - 1]
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Color overlay to simulate preview */}
              {selectedColor && (
                <div
                  className="absolute inset-0 opacity-20 mix-blend-multiply"
                  style={{ backgroundColor: selectedColor }}
                />
              )}
            </div>

            {/* Thumbnails */}
            <div className="relative">
              <button
                onClick={() => scrollThumbnails("left")}
                className="absolute -left-4 top-1/2 -translate-y-1/2 bg-amber-400 shadow rounded-full p-1 hover:bg-gray-100 z-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
              >
                <button
                  onClick={() => setSelectedImage(0)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === 0 ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={product.image}
                    alt="cover"
                    className="w-full h-full object-cover"
                  />
                </button>

                {product.details?.images?.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i + 1)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === i + 1
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`thumb-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={() => scrollThumbnails("right")}
                className="absolute -right-4 top-1/2 -translate-y-1/2 bg-amber-400 shadow rounded-full p-1 hover:bg-gray-100 z-10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
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

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  {product.price.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </span>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {lengthOptions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Length
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {lengthOptions.map((length) => (
                      <button
                        key={length}
                        onClick={() => setSelectedLength(length)}
                        className={`px-4 py-2 border rounded-lg transition ${
                          selectedLength === length
                            ? "border-amber-400 bg-primary text-primary-foreground shadow-lg"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {length}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {colorOptions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="grid grid-cols-2 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-lg transition ${
                          selectedColor === color
                            ? "border-amber-400 bg-primary text-primary-foreground shadow-lg"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:border-primary"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:border-primary"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                variant="luxury"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart –{" "}
                {(product.price * quantity).toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </Button>
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
                  ))}
                </ul>
              )}

              {activeTab === "specs" && (
                <div>
                  {product.details?.specifications?.map((s, i) => (
                    <p key={i}>
                      <strong>{s.key}</strong>: {s.value}
                    </p>
                  ))}
                </div>
              )}

              {activeTab === "reviews" && (
                <p>Reviews coming soon...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
