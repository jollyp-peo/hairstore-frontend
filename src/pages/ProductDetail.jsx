// pages/ProductDetail.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // option selections (start as null, no defaults)
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedLength, setSelectedLength] = useState(null);
  const [selectedLace, setSelectedLace] = useState(null);

  // toggles to show option panels
  const [showColors, setShowColors] = useState(false);
  const [showLengths, setShowLengths] = useState(false);
  const [showLaces, setShowLaces] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  // toast state
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const toastTimerRef = useRef(null);

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

  // helper: show toast
  const showToast = (message, type = "success") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ open: true, type, message });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, open: false }));
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // fetch product
  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const result = await res.json();

        if (!res.ok || !result.success) throw new Error(result?.error || "Failed to load product");
        if (!mounted) return;

        setProduct(result.data);
      } catch (err) {
        console.error("Failed to load product", err);
        showToast("Failed to load product. Please try again.", "error");
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  // recompute selectedVariant only when all three selections are chosen
  useEffect(() => {
    if (!product?.variants?.length) return;
    if (!selectedColor || !selectedLength || !selectedLace) {
      setSelectedVariant(null);
      return;
    }

    const match = product.variants.find(
      (v) => v.color === selectedColor && v.length === selectedLength && v.lace === selectedLace
    );

    setSelectedVariant(match || null);
  }, [selectedColor, selectedLength, selectedLace, product]);

  // unique options
  const colors = useMemo(() => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.color).filter(Boolean))];
  }, [product]);

  const lengths = useMemo(() => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.length).filter(Boolean))];
  }, [product]);

  const laces = useMemo(() => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.lace).filter(Boolean))];
  }, [product]);

  // availability helpers
  const isColorAvailable = (color) =>
    product?.variants?.some(
      (v) =>
        v.color === color &&
        (!selectedLength || v.length === selectedLength) &&
        (!selectedLace || v.lace === selectedLace)
    );

  const isLengthAvailable = (length) =>
    product?.variants?.some(
      (v) =>
        v.length === length &&
        (!selectedColor || v.color === selectedColor) &&
        (!selectedLace || v.lace === selectedLace)
    );

  const isLaceAvailable = (lace) =>
    product?.variants?.some(
      (v) =>
        v.lace === lace &&
        (!selectedColor || v.color === selectedColor) &&
        (!selectedLength || v.length === selectedLength)
    );

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

  const allImages = [
    product.cover_image,
    ...(product.variants?.map((v) => v.image).filter(Boolean) || []),
  ];

  // Add to Cart
  const handleAddToCart = () => {
    if (!selectedVariant) {
      showToast("Please select a valid Color, Length, and Lace.", "error");
      return;
    }

    addToCart(product, { variant: selectedVariant, quantity });

    showToast(
      `Added to cart: ${product.name} — ${selectedVariant.color || "-"}, ${selectedVariant.length || "-"}, ${selectedVariant.lace || "-"} × ${quantity}`,
      "success"
    );
  };

  const resetSelections = () => {
    setSelectedColor(null);
    setSelectedLength(null);
    setSelectedLace(null);
    setSelectedVariant(null);
    setQuantity(1);
    showToast("Selections cleared.", "success");
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
                src={allImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
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
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === i ? "border-amber-400" : "border-transparent"
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
              <p className="text-sm text-primary font-medium mb-2">{product.category}</p>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>

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
                {selectedVariant ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      {selectedVariant.price.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </span>
                    {selectedVariant.original_price && (
                      <span className="line-through text-muted-foreground">
                        {selectedVariant.original_price.toLocaleString("en-NG", {
                          style: "currency",
                          currency: "NGN",
                        })}
                      </span>
                    )}
                  </>
                ) : (
                  <p className="text-lg font-medium text-muted-foreground">
                    Select options to see price
                  </p>
                )}
              </div>
            </div>

            {/* Variant Selectors */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowColors((s) => !s);
                    setShowLengths(false);
                    setShowLaces(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-border hover:border-amber-400"
                >
                  Color {selectedColor ? `: ${selectedColor}` : ""}
                </button>

                <button
                  onClick={() => {
                    setShowLengths((s) => !s);
                    setShowColors(false);
                    setShowLaces(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-border hover:border-amber-400"
                >
                  Length {selectedLength ? `: ${selectedLength}` : ""}
                </button>

                <button
                  onClick={() => {
                    setShowLaces((s) => !s);
                    setShowColors(false);
                    setShowLengths(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-border hover:border-amber-400"
                >
                  Lace {selectedLace ? `: ${selectedLace}` : ""}
                </button>

                <button onClick={resetSelections} className="ml-auto text-sm underline">
                  Reset
                </button>
              </div>

              {/* Color options panel */}
              {showColors && (
                <div className="mt-2 grid grid-cols-3 md:grid-cols-6 gap-2">
                  {colors.map((c) => {
                    const available = isColorAvailable(c);
                    const active = c === selectedColor;
                    return (
                      <button
                        key={c}
                        onClick={() => {
                          if (!available) return;
                          setSelectedColor(c);
                          setShowColors(false);
                        }}
                        disabled={!available}
                        className={`px-3 py-2 rounded-lg border text-sm transition ${
                          active
                            ? "border-amber-400 bg-amber-50"
                            : available
                            ? "border-border hover:border-amber-400"
                            : "opacity-40 cursor-not-allowed"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Length options panel */}
              {showLengths && (
                <div className="mt-2 grid grid-cols-3 md:grid-cols-6 gap-2">
                  {lengths.map((l) => {
                    const available = isLengthAvailable(l);
                    const active = l === selectedLength;
                    return (
                      <button
                        key={l}
                        onClick={() => {
                          if (!available) return;
                          setSelectedLength(l);
                          setShowLengths(false);
                        }}
                        disabled={!available}
                        className={`px-3 py-2 rounded-lg border text-sm transition ${
                          active
                            ? "border-amber-400 bg-amber-50"
                            : available
                            ? "border-border hover:border-amber-400"
                            : "opacity-40 cursor-not-allowed"
                        }`}
                      >
                        {l}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Lace options panel */}
              {showLaces && (
                <div className="mt-2 grid grid-cols-3 md:grid-cols-6 gap-2">
                  {laces.map((lx) => {
                    const available = isLaceAvailable(lx);
                    const active = lx === selectedLace;
                    return (
                      <button
                        key={lx}
                        onClick={() => {
                          if (!available) return;
                          setSelectedLace(lx);
                          setShowLaces(false);
                        }}
                        disabled={!available}
                        className={`px-3 py-2 rounded-lg border text-sm transition ${
                          active
                            ? "border-amber-400 bg-amber-50"
                            : available
                            ? "border-border hover:border-amber-400"
                            : "opacity-40 cursor-not-allowed"
                        }`}
                      >
                        {lx}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Small summary */}
              <div className="text-sm text-muted-foreground">
                <p>
                  Selected: <strong>{selectedColor ?? "-"}</strong> /{" "}
                  <strong>{selectedLength ?? "-"}</strong> /{" "}
                  <strong>{selectedLace ?? "-"}</strong>
                </p>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:border-amber-400"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:border-amber-400"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                variant="luxury"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!selectedVariant}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {selectedVariant ? (
                  <>
                    Add to Cart –{" "}
                    {(selectedVariant.price * quantity).toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    })}
                  </>
                ) : (
                  "Select a valid combination"
                )}
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
                <ul>
                  {product.details?.specifications?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}

              {activeTab === "reviews" && (
                <div>
                  <p>No reviews yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast.open && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast((t) => ({ ...t, open: false }))}>
            <X className="h-4 w-4 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
}
