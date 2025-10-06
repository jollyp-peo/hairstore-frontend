import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { Button } from "../components/ui/Button";
import { useCart } from "../context/CartContext"; // import useCart to access clearCart

const API_URL = import.meta.env.VITE_API_URL;

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { accessToken, refresh } = useAuth();

  const [isVerifying, setIsVerifying] = useState(true);
  const [status, setStatus] = useState("Verifying payment...");
  const [isPaid, setIsPaid] = useState(false);
  const [reference, setReference] = useState(null);
  const { clearCart } = useCart(); // access clearCart function

useEffect(() => {
  const ref = searchParams.get("reference")?.split("?")[0]; 
  const autoVerify = searchParams.get("autoVerify") === "true";
  setReference(ref);

  if (!ref) {
    setStatus("No payment reference found");
    setIsVerifying(false);
    setTimeout(() => navigate("/cart", { replace: true }), 3000);
    return;
  }

  let intervalId;

  const verifyPayment = async () => {
    try {
      let token = accessToken;
      if (!token) {
        const refreshed = await refresh();
        if (!refreshed) {
          setStatus("Session expired. Redirecting to login...");
          setTimeout(() => navigate("/login", { replace: true }), 3000);
          return;
        }
        token = accessToken;
      }

      const res = await fetch(
        `${API_URL}/api/payments/verify?reference=${encodeURIComponent(ref)}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      if (data.success && data.paid) {
        setIsPaid(true);
        setStatus("Payment successful!");
        localStorage.removeItem("pending_payment_ref");

        // Clear cart via context
        clearCart();

        if (intervalId) clearInterval(intervalId); // stop polling if used
      } else {
        setStatus(autoVerify ? "Verifying payment..." : "Waiting for payment confirmation...");
      }
    } catch (err) {
      setStatus(`Error verifying payment: ${err.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  if (autoVerify) {
    verifyPayment();
  } else {
    intervalId = setInterval(verifyPayment, 3000);
    verifyPayment();
  }

  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}, [searchParams, navigate, accessToken, refresh, clearCart]);



  if (!isVerifying && isPaid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your order{" "}
            <strong>{reference}</strong> has been confirmed and will be processed
            within 1-3 business days.
          </p>
          <div className="space-y-3">
            <Button variant="luxury" className="w-full">
              <Link to="/products">Continue Shopping</Link>
            </Button>
            <Button variant="outline" className="w-full">
              <Link to="/orders">Track Your Order</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-6">{isVerifying && <Spinner size="lg" />}</div>
        <h1 className="text-2xl font-bold mb-4">Payment Verification</h1>
        <p className="text-muted-foreground mb-4">{status}</p>
        {!isVerifying && (
          <Button
            variant="ghost"
            onClick={() => navigate("/cart", { replace: true })}
            className="flex items-center mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Cart
          </Button>
        )}
      </div>
    </div>
  );
}
