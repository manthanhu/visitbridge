"use client";

import { QRCodeSVG } from "qrcode.react";

export function BookingQR({ value, size = 120 }: { value: string; size?: number }) {
  return (
    <div className="bg-white p-2 rounded-lg">
      <QRCodeSVG value={value} size={size} level="M" />
    </div>
  );
}
