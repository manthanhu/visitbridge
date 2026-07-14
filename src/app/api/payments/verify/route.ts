import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Verify signature
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payment = await prisma.payments.findUnique({
      where: { id: paymentId },
      include: { visit_requests: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Process in transaction
    await prisma.$transaction(async (tx) => {
      // Update Payment
      await tx.payments.update({
        where: { id: paymentId },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "PAID",
          paidAt: new Date(),
        },
      });

      // We do not change visit_requests status since it's already APPROVED and now payment handles it.
      // Or we can add logic if necessary.

      // Create Transaction log
      await tx.transactions.create({
        data: {
          id: `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          paymentId: paymentId,
          type: "PAYMENT",
          amount: payment.amount,
          razorpayPaymentId: razorpay_payment_id,
          status: "SUCCESS",
          metadata: {
            razorpay_order_id,
          },
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
