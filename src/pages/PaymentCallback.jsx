import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../utilis/supabaseClient";

const API_URL = import.meta.env.VITE_API_URL;

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying payment...");
  const navigate = useNavigate();

  useEffect(() => {
    const reference = searchParams.get("reference");
    console.log("🔍 Callback reference:", reference);

    const verifyPayment = async () => {
      try {
        // Get current Supabase session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        console.log("🔑 Supabase session:", session);
        if (sessionError) console.error("⚠️ Session error:", sessionError);

        const token = session?.access_token;
        if (!token) {
          setStatus("Authentication required. Please login again.");
          console.warn("⚠️ No Supabase token found.");
          return;
        }

        // Hit backend verify API
        const url = `${API_URL}/api/payments/paystack/verify?reference=${reference}`;
        console.log("🌍 Fetching verify endpoint:", url);

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }, credentials: "include",
        });

        console.log("📡 Response status:", res.status);
        const data = await res.json();
        console.log("📦 Response JSON:", data);

        if (res.ok && data.success && data.paid) {
          setStatus("✅ Payment successful! Redirecting...");
          setTimeout(() => navigate("/orders"), 2000);
        } else {
          setStatus("❌ Payment failed: " + (data.message || "Unknown error"));
          setTimeout(() => navigate("/cart"), 3000);
        }
      } catch (err) {
        console.error("💥 Verify error:", err);
        setStatus("⚠️ Error verifying payment. Please try again.");
        setTimeout(() => navigate("/cart"), 3000);
      }
    };

    if (reference) verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">{status}</h1>
      <p className="mt-2 text-gray-500">Please wait...</p>
    </div>
  );
}
