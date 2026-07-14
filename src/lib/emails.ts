// In a real application, you would use a server-side service like Resend, SendGrid, or AWS SES.
// Since the user is using EmailJS (which is primarily client-side), we'll mock the server-side email functions 
// or you could call EmailJS REST API from here if you have the private key.
// For now, we'll log them as requested to mock a server-side email queue.

export async function sendApplicationReceivedEmail(email: string, name: string, visitTitle: string) {
  console.log(`[EMAIL] To: ${email} | Subject: Application Received for ${visitTitle} | Body: Hi ${name}, your application has been received and is under review.`);
  return true;
}

export async function sendPaymentSuccessEmail(email: string, name: string, visitTitle: string, amount: number) {
  console.log(`[EMAIL] To: ${email} | Subject: Payment Successful for ${visitTitle} | Body: Hi ${name}, we have received your payment of INR ${amount}. Your booking is confirmed.`);
  return true;
}

export async function sendApplicationRejectedEmail(email: string, name: string, visitTitle: string, reason: string) {
  console.log(`[EMAIL] To: ${email} | Subject: Application Update for ${visitTitle} | Body: Hi ${name}, unfortunately your application was rejected. Reason: ${reason}`);
  return true;
}

export async function sendRefundProcessedEmail(email: string, name: string, visitTitle: string, amount: number) {
  console.log(`[EMAIL] To: ${email} | Subject: Refund Processed for ${visitTitle} | Body: Hi ${name}, a refund of INR ${amount} has been processed for your cancelled booking.`);
  return true;
}
