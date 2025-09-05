import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Search, Pencil, Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

 
  const fetchProducts = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/products?page=${page}&search=${search}`
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
			console.log(data)

      // Handle both array and object response
      const products = data.data || [];
      setProducts(products);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, search);
  }, [page, search]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-border rounded-lg shadow-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              {/* <th className="px-4 py-2 text-left">Price</th> */}
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : products && products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">
                    <img
                      src={p.cover_image}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">{p.name}</td>

                
                  <td className="px-4 py-2">{p.category}</td>
                  <td className="px-4 py-2">
                    {p.in_stock ? (
                      <span className="text-green-600">In Stock</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>
        <span className="px-3 py-2">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductList;
