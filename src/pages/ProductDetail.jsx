import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';


// Mock product data - in real app, this would come from API
const getProductById = (id) => {
  const products = {
    '1': {
      id: 1,
      name: 'Premium Silk Hair Extensions',
      price: 29900,
      originalPrice: 39900,
      category: 'Hair Extensions',
      images: ['/src/assets/hero-hair-extensions.jpg'],
      rating: 4.9,
      reviews: 128,
      inStock: true,
      description: 'Transform your look with our premium silk hair extensions. Made from 100% virgin human hair, these extensions provide natural-looking volume and length that seamlessly blends with your natural hair.',
      features: [
        '100% Virgin Human Hair',
        'Multiple Length Options (16", 20", 24")',
        'Natural Color Match Technology',
        'Easy Clip-In Application',
        'Heat Styling Safe up to 400°F',
        'Reusable and Long-Lasting'
      ],
      specifications: {
        'Hair Type': '100% Virgin Human Hair',
        'Texture': 'Silky Straight',
        'Weight': '120g (4.2 oz)',
        'Pieces': '7 pieces per set',
        'Length Options': '16", 20", 24"',
        'Colors Available': '12 natural shades'
      }
    }
  };
  return products[id];
};

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedLength, setSelectedLength] = useState('20"');
  const [selectedColor, setSelectedColor] = useState('Natural Brown');
  

  const product = getProductById(id || '1');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const lengthOptions = ['16"', '20"', '24"'];
  const colorOptions = ['Natural Black', 'Natural Brown', 'Honey Blonde', 'Ash Blonde'];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pb-16">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-card shadow-card">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Additional images would go here */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
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
                          ? 'text-primary fill-primary'
                          : 'text-muted-foreground'
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
                  {product.price.toLocaleString('en-NG', {style: 'currency', currency : 'NGN'})}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString('en-NG', {style: 'currency', currency : 'NGN'})}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-destructive text-destructive-foreground px-3 py-1 text-sm font-semibold rounded-full">
                    Save {(product.originalPrice - product.price).toLocaleString('en-NG', {style: 'currency', currency : 'NGN'})}
                  </span>
                )}
              </div>
            </div>

            {/* Product Options */}
            <div className="space-y-4">
              {/* Length Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Length</label>
                <div className="flex gap-2">
                  {lengthOptions.map((length) => (
                    <button
                      key={length}
                      onClick={() => setSelectedLength(length)}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        selectedLength === length
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="grid grid-cols-2 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg text-left transition-all ${
                        selectedColor === color
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button variant="luxury" size="lg" className="w-full">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - {(product.price * quantity).toLocaleString('en-NG', {style: 'currency', currency : 'NGN'})}
              </Button>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Save to Wishlist
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-sm">30 Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-border">
            <nav className="flex space-x-8">
              <button className="py-4 px-1 border-b-2 border-primary text-primary font-medium">
                Description
              </button>
              <button className="py-4 px-1 text-muted-foreground hover:text-foreground">
                Features
              </button>
              <button className="py-4 px-1 text-muted-foreground hover:text-foreground">
                Specifications
              </button>
              <button className="py-4 px-1 text-muted-foreground hover:text-foreground">
                Reviews
              </button>
            </nav>
          </div>

          <div className="py-8">
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold mb-4">Product Description</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {product.description}
              </p>

              <h4 className="text-lg font-semibold mb-3">Key Features</h4>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <h4 className="text-lg font-semibold mb-3 mt-8">Specifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">{key}:</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-8">You May Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Related products would be rendered here */}
            <div className="text-center text-muted-foreground py-8">
              <p>Related products coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;