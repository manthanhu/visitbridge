import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { visitId } = await req.json();
    if (!visitId) {
      return NextResponse.json({ error: "Visit ID is required" }, { status: 400 });
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check application status
    const application = await prisma.visit_requests.findUnique({
      where: {
        studentId_visitId: {
          studentId: studentProfile.id,
          visitId: visitId,
        },
      },
      include: {
        company_visits: true,
      },
    });

    if (!application || application.status !== "APPROVED") {
      return NextResponse.json({ error: "Invalid application status for payment" }, { status: 400 });
    }

    // Check if payment already exists and is pending
    let payment = await prisma.payments.findUnique({
      where: { visitRequestId: application.id },
    });

    if (payment && payment.status === "PAID") {
      return NextResponse.json({ error: "Already paid" }, { status: 400 });
    }

    const visitFee = application.company_visits.fee;
    const platformFee = visitFee * 0.05; // 5% platform fee
    const tax = (visitFee + platformFee) * 0.18; // 18% GST
    const totalAmount = visitFee + platformFee + tax;
    
    // Amount is in paise for INR
    const amountInPaise = Math.round(totalAmount * 100);

    const orderOptions = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${application.id.slice(0, 10)}`,
      payment_capture: 1, // Auto capture
    };

    const order = await razorpay.orders.create(orderOptions);

    if (payment) {
      // Update existing payment
      payment = await prisma.payments.update({
        where: { id: payment.id },
        data: {
          razorpayOrderId: order.id,
          amount: totalAmount,
        },
      });
    } else {
      // Create new payment
      payment = await prisma.payments.create({
        data: {
          id: `pay_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          visitRequestId: application.id,
          studentId: studentProfile.id,
          amount: totalAmount,
          currency: "INR",
          razorpayOrderId: order.id,
          status: "PENDING",
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
