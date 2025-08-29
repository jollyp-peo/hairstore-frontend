import { useEffect, useState } from "react";
import { Search, Filter, Grid, List, ShoppingCart, Star } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8; // backend should respect this

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const categories = [
    { id: "all", name: "All Products" },
    { id: "extensions", name: "Hair Extensions" },
    { id: "wigs", name: "Wigs" },
    { id: "care", name: "Hair Care" },
  ];

  // frontend sort → DB mapping
  const sortMap = {
    featured: { column: "featured", ascending: false },
    "price-low": { column: "price", ascending: true },
    "price-high": { column: "price", ascending: false },
    rating: { column: "rating", ascending: false },
    newest: { column: "created_at", ascending: false },
  };

  // Debounce search term (500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const sort = sortMap[sortBy] || sortMap.newest;

      const params = new URLSearchParams({
        page: String(page),
        limit: String(itemsPerPage),
        sortBy: sort.column,
        order: sort.ascending ? "asc" : "desc",
      });

      if (debouncedSearch) params.set("search", debouncedSearch);
      // only send category when it is not "all"
      if (selectedCategory && selectedCategory !== "all") {
        params.set("category", selectedCategory);
      }

      const url = `${API_URL}/api/products?${params.toString()}`;
      // debugging help: open browser console, check request/response
      console.debug("[Products] GET", url);

      const res = await fetch(url);
      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error("[Products] Failed to parse JSON", parseErr);
        throw new Error("Invalid JSON response from server");
      }

      console.debug("[Products] response", res.status, data);

      if (!res.ok) {
        // if backend sends { error } structure, surface it
        const errMsg = data?.error || `Server returned ${res.status}`;
        throw new Error(errMsg);
      }

      // backend returns { products: [...], pagination: { totalPages, total, page, limit } }
      const returnedProducts = Array.isArray(data)
        ? data
        : data.products || data.items || [];

      setProducts(returnedProducts);

      const tp =
        data?.pagination?.totalPages ??
        data?.totalPages ??
        // fallback: compute from total if provided
        (data?.pagination?.total ? Math.max(1, Math.ceil(data.pagination.total / itemsPerPage)) : 1);

      setTotalPages(tp || 1);
    } catch (err) {
      console.error("Error fetching products:", err);
      // show no products but don't crash UI
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when dependencies change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategory, sortBy, page]);

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
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
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
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-border rounded-lg bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Object.entries(sortMap).map(([id, cfg]) => {
                // map keys to nice labels (you already had labels)
                const name =
                  id === "featured"
                    ? "Featured"
                    : id === "price-low"
                    ? "Price: Low to High"
                    : id === "price-high"
                    ? "Price: High to Low"
                    : id === "rating"
                    ? "Highest Rated"
                    : "Newest";
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
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
            Showing {products.length} products (Page {page} of {totalPages})
          </p>
        </div>

        {/* Loading state */}
        {loading && <p className="text-center py-8">Loading products...</p>}

        {/* Products Grid/List */}
        {!loading && products.length > 0 && (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
            }`}
          >
            {products.map((product, index) => (
              <div
                key={product.id || product._id}
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
                    viewMode === "list" ? "sm:w-48 h-48 sm:h-auto" : "aspect-square"
                  }`}
                >
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {!product.in_stock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 text-xs font-semibold rounded-full">
                      Featured
                    </div>
                  )}
                  {product.original_price && (
                    <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-semibold rounded-full">
                      Sale
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className={`p-4 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}>
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
                              i < Math.floor(product.rating || 0) ? "text-primary fill-primary" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.rating ?? 0} ({product.reviews ?? 0} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {(Number(product.price) || 0).toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {(Number(product.original_price) || 0).toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="gold"
                      className="flex-1"
                      disabled={!product.in_stock}
                      // onClick={() => addToCart(product, { quantity: 1 })}
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.in_stock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => navigate(`/products/${product.id}`)}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </Button>

            {/* Numbered Pagination */}
            {Array.from({ length: totalPages }, (_, i) => (
              <Button key={i + 1} variant={page === i + 1 ? "luxury" : "outline"} onClick={() => setPage(i + 1)}>
                {i + 1}
              </Button>
            ))}

            <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
