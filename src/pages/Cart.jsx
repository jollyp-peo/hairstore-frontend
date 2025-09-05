import { Link } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  // Subtotal with variant pricing
  const subtotal = cartItems.reduce(
    (sum, item) => sum + ((item.variant?.price || 0) * item.quantity),
    0
  );

  const shipping = subtotal > 200000 ? 0 : 5000;
  const tax = subtotal * 0.01; // 1% tax
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Discover our luxury hair collection and add some items to your
              cart.
            </p>
            <Button variant="luxury" size="lg">
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-white/90">
            Review your items and proceed to checkout
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6">
          <Link to="/products">
            <span className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </span>
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold">
              Cart Items ({cartItems.length})
            </h2>

            <div className="space-y-4">
              {cartItems.map((item) => {
                const itemPrice = item.variant?.price || 0;

                return (
                  <div
                    key={item.id}
                    className="bg-card rounded-2xl shadow-card p-6 animate-fade-in"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeFromCart(item.key)
                            }
                            className="text-muted-foreground hover:text-destructive cursor-pointer"
                          >
                            <X className="h-4 w-4 " />
                          </Button>
                        </div>

                        {/* Variant Options */}
                        <div className="text-sm text-muted-foreground mb-4 space-y-1">
                          {item.variant?.length && (
                            <p>Length: {item.variant.length}</p>
                          )}
                          {item.variant?.color && (
                            <p>Color: {item.variant.color}</p>
                          )}
                          {item.variant?.size && <p>Size: {item.variant.size}</p>}
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">
                              Quantity:
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 cursor-pointer"
                                onClick={() =>
                                  updateQuantity(
                                    item.key,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 cursor-pointer"
                                onClick={() =>
                                  updateQuantity(
                                    item.key,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              {(itemPrice * item.quantity).toLocaleString(
                                "en-NG",
                                {
                                  style: "currency",
                                  currency: "NGN",
                                }
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {itemPrice.toLocaleString("en-NG", {
                                style: "currency",
                                currency: "NGN",
                              })}{" "}
                              each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl shadow-card p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    {subtotal.toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">FREE</span>
                    ) : (
                      `${shipping.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>
                    {tax.toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    })}
                  </span>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">
                      {total.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {subtotal < 200000 && (
                <div className="bg-accent-muted rounded-lg p-4 mb-6">
                  <p className="text-sm text-center">
                    Add{" "}
                    <span className="font-semibold text-primary">
                      {(200000 - subtotal).toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </span>{" "}
                    more for free shipping!
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <Button variant="luxury" size="lg" className="w-full mb-4">
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>

              {/* Security Features */}
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">🔒 Secure 256-bit SSL encryption</p>
                <p>30-day money back guarantee</p>
              </div>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-medium mb-3">Have a promo code?</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-8">You Might Also Like</h3>
          <div className="text-center text-muted-foreground py-8">8
            <p>Recommended products coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
