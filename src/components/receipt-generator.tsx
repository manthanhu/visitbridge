"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReceiptProps {
  applicationId: string;
  paymentId: string;
  studentName: string;
  visitTitle: string;
  companyName: string;
  amount: number;
  date: string;
}

export function ReceiptGenerator({
  applicationId,
  paymentId,
  studentName,
  visitTitle,
  companyName,
  amount,
  date,
}: ReceiptProps) {
  
  const handlePrint = () => {
    // Basic print functionality for receipt.
    // In a real production app, this would use pdfmake or jspdf.
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Payment Receipt - VisitBridge</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
            .title { font-size: 20px; margin-top: 10px; }
            .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .col { flex: 1; }
            .label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 4px; }
            .value { font-size: 16px; font-weight: 500; margin-bottom: 16px; }
            .line-item { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 12px 0; }
            .total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 16px; margin-top: 16px; }
            .footer { margin-top: 60px; text-align: center; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">VisitBridge</div>
            <div class="title">Payment Receipt</div>
          </div>
          
          <div class="details">
            <div class="col">
              <div class="label">Billed To</div>
              <div class="value">${studentName}</div>
              
              <div class="label">Date</div>
              <div class="value">${date}</div>
            </div>
            <div class="col" style="text-align: right;">
              <div class="label">Receipt Number</div>
              <div class="value">${paymentId}</div>
              
              <div class="label">Booking ID</div>
              <div class="value">${applicationId}</div>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <div class="line-item" style="font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase;">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <div class="line-item">
              <span>Industrial Visit: ${visitTitle} (${companyName})</span>
              <span>INR ${amount.toFixed(2)}</span>
            </div>
            <div class="line-item total">
              <span>Total Paid</span>
              <span>INR ${amount.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for booking with VisitBridge.</p>
            <p>This is a computer generated receipt and does not require a signature.</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    // Slight delay to ensure content is loaded before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <Button 
      onClick={handlePrint} 
      className="w-full sm:w-auto px-6 h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors flex items-center justify-center gap-2"
    >
      <Download className="h-4 w-4" /> Download Receipt
    </Button>
  );
}
