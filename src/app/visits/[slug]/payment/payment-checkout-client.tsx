"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: unknown;
  }
}

export default function PaymentCheckoutClient({
  visitId,
  user,
}: {
  visitId: string;
  user: { name: string; email: string; contact: string };
}) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const res = await initializeRazorpay();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      // Create Order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitId }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        toast.error(orderData.error || "Failed to create order");
        setIsProcessing(false);
        return;
      }

      // Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "VisitBridge",
        description: "Industrial Visit Booking",
        order_id: orderData.orderId,
        handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; error?: { description: string } }) {
          try {
            // Verify Payment
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId: orderData.paymentId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              toast.success("Payment successful!");
              router.push(`/visits/${visitId}/payment/success`);
            } else {
              toast.error(verifyData.error || "Payment verification failed");
              router.push(`/visits/${visitId}/payment/failed`);
            }
          } catch (err) {
            toast.error("An error occurred during verification.");
            router.push(`/visits/${visitId}/payment/failed`);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.contact,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new (window as unknown as { Razorpay: new (options: unknown) => { on: (e: string, h: Function) => void, open: () => void } }).Razorpay(options);
      
      paymentObject.on('payment.failed', function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; error?: { description: string } }){
        toast.error(response.error?.description || "Payment failed");
        router.push(`/visits/${visitId}/payment/failed`);
      });

      paymentObject.open();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button 
        onClick={handlePayment} 
        disabled={isProcessing}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Processing...
          </>
        ) : (
          <>
            <Shield className="h-5 w-5" /> Pay Securely with Razorpay
          </>
        )}
      </button>
    </>
  );
}
