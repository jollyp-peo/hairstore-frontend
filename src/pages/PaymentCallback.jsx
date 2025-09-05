import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { Button } from "../components/ui/Button";

const API_URL = import.meta.env.VITE_API_URL;

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { accessToken, refresh } = useAuth();

  const [isVerifying, setIsVerifying] = useState(true);
  const [status, setStatus] = useState("Verifying payment...");
  const [isPaid, setIsPaid] = useState(false);
  const [reference, setReference] = useState(null);

  useEffect(() => {
    const ref = searchParams.get("reference");
    setReference(ref);

    if (!ref) {
      setStatus("No payment reference found");
      setIsVerifying(false);
      setTimeout(() => navigate("/cart", { replace: true }), 3000);
      return;
    }

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
          token = accessToken; // context updated after refresh()
        }

        setStatus("Verifying payment with Paystack...");

        const res = await fetch(
          `${API_URL}/api/payments/paystack/verify?reference=${encodeURIComponent(
            ref
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${res.status}`);
        }

        const data = await res.json();

        if (data.success && data.paid) {
          setIsPaid(true);
          setStatus("Payment successful!");
          localStorage.removeItem("pending_payment_ref");
        } else if (data.success && !data.paid) {
          setStatus("Payment not completed. Please try again.");
          setTimeout(() => navigate("/cart", { replace: true }), 3000);
        } else {
          setStatus("Payment verification failed");
          setTimeout(() => navigate("/cart", { replace: true }), 3000);
        }
      } catch (err) {
        setStatus(`Error verifying payment: ${err.message}`);
        setTimeout(() => navigate("/cart", { replace: true }), 2000);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, accessToken, refresh]);

  // Show success screen if paid
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
            <strong>{reference}</strong> has been confirmed and will be
            processed within 1-3 business days.
          </p>
          <div className="space-y-3">
            <Button variant="luxury" className="w-full" asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/orders">Track Your Order</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  //Default state (verifying or failed)
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
