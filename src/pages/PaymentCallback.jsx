import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const API_URL = import.meta.env.VITE_API_URL;

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying payment...");
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();

  const { accessToken, refresh } = useAuth();

  useEffect(() => {
    const reference = searchParams.get("reference");
    console.log("Callback reference:", reference);

    if (!reference) {
      setStatus("No payment reference found");
      setIsVerifying(false);
      setTimeout(() => navigate("/cart"), 3000);
      return;
    }

    const verifyPayment = async () => {
      try {
        console.log("Starting payment verification process...");

        let token = accessToken;
        if (!token) {
          console.warn("No accessToken, trying refresh...");
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
          `${API_URL}/api/payments/paystack/verify?reference=${encodeURIComponent(reference)}`,
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
        console.log("API Response data:", data);

        if (data.success && data.paid) {
          setStatus("Payment successful! Redirecting to orders...");
          localStorage.removeItem("pending_payment_ref");
          setTimeout(() => navigate("/orders", { replace: true }), 5000);
        } else if (data.success && !data.paid) {
          setStatus("Payment not completed. Please try again.");
          setTimeout(() => navigate("/cart", { replace: true }), 3000);
        } else {
          setStatus("Payment verification failed: " + (data.message || "Unknown error"));
          setTimeout(() => navigate("/cart", { replace: true }), 3000);
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus(`Error verifying payment: ${err.message}`);
        setTimeout(() => navigate("/cart", { replace: true }), 2000);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, accessToken, refresh]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-6">{isVerifying && <Spinner size="lg" />}</div>

        <h1 className="text-2xl font-bold mb-4">Payment Verification</h1>
        <p className="text-muted-foreground mb-4">{status}</p>

        {!isVerifying && (
          <div className="space-y-2">
            <button
              onClick={() => navigate("/cart", { replace: true })}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Return to Cart
            </button>
            <button
              onClick={() => navigate("/orders", { replace: true })}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              View Orders
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Retry Verification
            </button>
          </div>
        )}

        <div className="mt-6 text-sm text-muted-foreground">
          <p><strong>Reference:</strong> {searchParams.get("reference")}</p>
          <p><strong>Has token:</strong> {accessToken ? "Yes" : "No"}</p>
          <p><strong>Status:</strong> {status}</p>
        </div>
      </div>
    </div>
  );
}
