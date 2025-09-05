import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Lock, Truck } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import CheckoutAddresses from "../components/address/CheckoutAddresses";
import { fetchAddresses } from "../hooks/addressApi";

const API_URL = import.meta.env.VITE_API_URL;

const Checkout = () => {
  const { cartItems } = useCart();
  const { accessToken, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // shipping snapshot (from default or added address)
  const [selectedAddress, setSelectedAddress] = useState(null);

  const orderItems = cartItems;
  const subtotal = orderItems.reduce(
    (acc, item) => acc + ((item.variant?.price || 0) * item.quantity),
    0
  );
  const shippingCost = 0;
  const tax = subtotal * 0.01;
  const total = subtotal + shippingCost + tax;

  // load default address on mount
  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      try {
        const list = await fetchAddresses(accessToken);
        const defaultAddr = list.find((a) => a.is_default) || list[0];
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
      }
    })();
  }, [accessToken]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedAddress) {
      setError("Please add a shipping address before checkout.");
      setLoading(false);
      return;
    }

    try {
      if (!accessToken) throw new Error("You must be logged in to checkout");

      const shippingSnapshot = {
        first_name: selectedAddress.first_name,
        last_name: selectedAddress.last_name,
        email: selectedAddress.email || user?.email,
        phone: selectedAddress.phone,
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zip_code: selectedAddress.zip_code,
        country: selectedAddress.country,
      };

      const body = {
        amount: total,
        email: shippingSnapshot.email,
        currency: "NGN",
        cart: orderItems,
        meta: {
          name: `${shippingSnapshot.first_name} ${shippingSnapshot.last_name}`,
        },
        address_id: selectedAddress.id,
        shipping: shippingSnapshot,
      };

      const res = await fetch(`${API_URL}/api/payments/paystack/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to initialize payment");
      }

      // redirect to gateway
      window.location.href = data.authorization_url;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Secure Checkout
          </h1>
          <p className="text-white/90">
            Complete your order safely and securely
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6">
          <Link to="/cart">
            <span className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </span>
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    1
                  </span>
                  Shipping Information
                </h2>

                <CheckoutAddresses
                  onSelectAddress={setSelectedAddress}
                  selectedAddress={selectedAddress}
                />
              </div>

              {/* Payment */}
              <div className="bg-card rounded-2xl shadow-card p-6 text-center">
                <h2 className="text-xl font-semibold mb-2 flex items-center justify-center">
                  Payment <Lock className="h-5 w-5 text-green-600 ml-2" />
                </h2>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium text-center text-green-700 dark:text-green-400">
                    Click below to proceed to our secure Paystack payment
                    gateway.
                  </p>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-center mb-4">{error}</div>
              )}

              <Button
                type="submit"
                variant="luxury"
                size="xl"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" /> Redirecting...
                  </>
                ) : (
                  `Pay with Paystack - ${total.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}`
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl shadow-card p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {orderItems.map((item, index) => {
                  const itemPrice = item.variant?.price || 0;
                  return (
                    <div key={index} className="flex justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Qty: {item.quantity}</p>
                          {item.variant?.length && (
                            <p>Length: {item.variant.length}</p>
                          )}
                          {item.variant?.color && (
                            <p>Color: {item.variant.color}</p>
                          )}
                          {item.variant?.size && <p>Size: {item.variant.size}</p>}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {(itemPrice * item.quantity).toLocaleString("en-NG", {
                          style: "currency",
                          currency: "NGN",
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
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
                  <span className="text-green-600 font-medium">FREE</span>
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
                <div className="border-t border-border pt-3">
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

              <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground space-y-2">
                <p className="flex items-center justify-center gap-2">
                  <Lock size={16} className="text-green-600" /> 256-bit SSL
                  encryption
                </p>
                <p className="flex items-center justify-center gap-2">
                  <CheckCircle size={16} className="text-green-600" /> 7-day
                  money back guarantee
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Truck size={16} className="text-green-600" /> Free shipping
                  on orders over ₦300,000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
