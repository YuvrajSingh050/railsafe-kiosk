"use client";

import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import { Order, OrderItem } from "@/types";

export function UnifiedBill({ order, origin }: { order: Order, origin?: string }) {
  const safeOrigin = origin || (typeof window !== "undefined" ? window.location.origin : "");
  const qrUrl = `${safeOrigin}/complaint?orderNumber=${order.orderNumber}&seatNumber=${order.seatNumber}`;

  return (
    <div className="bg-white rounded-xl border border-dashed border-gray-400 shadow-sm print-content text-black max-w-sm mx-auto font-mono text-sm overflow-hidden">
      {/* Top Half: Customer Bill */}
      <div className="p-6">
        <div className="text-center mb-4 border-b-2 border-black pb-2">
          <h2 className="font-bold text-lg leading-tight uppercase">Indian Railways</h2>
          <h3 className="font-bold">RailSafe Food Kiosk</h3>
        </div>
        
        <div className="mb-4">
          <p><strong>Bill No:</strong> {order.orderNumber}</p>
          <p><strong>Train No:</strong> {order.trainNumber} &nbsp; <strong>Coach:</strong> {order.coachNumber}</p>
          <p><strong>Seat No:</strong> {order.seatNumber}</p>
          <p><strong>Date:</strong> {format(new Date(order.createdAt), "dd-MMM-yyyy")} &nbsp; <strong>Time:</strong> {format(new Date(order.createdAt), "HH:mm")}</p>
        </div>
        
        <div className="border-t border-b border-black py-2 mb-4">
          <div className="flex justify-between font-bold mb-1">
            <span className="w-1/2">Item</span>
            <span className="w-1/6 text-center">Qty</span>
            <span className="w-1/6 text-right">Price</span>
            <span className="w-1/6 text-right">Total</span>
          </div>
          {order.items.map((item: OrderItem, idx: number) => (
            <div key={idx} className="flex justify-between mb-1">
              <span className="w-1/2 break-words pr-1 leading-tight">{item.name}</span>
              <span className="w-1/6 text-center">{item.quantity}</span>
              <span className="w-1/6 text-right">₹{item.price}</span>
              <span className="w-1/6 text-right">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between font-bold text-base mb-4">
          <span>TOTAL AMOUNT:</span>
          <span>₹{order.totalAmount}</span>
        </div>
        
        <div className="text-center border-t border-black pt-4 mb-4">
          <p className="font-bold uppercase">&quot;Pay exactly this amount.<br/>No extra charges applicable.&quot;</p>
          <p className="mt-2 text-xs">Report fraud: 139 / RailSafe App</p>
        </div>
        
        <div className="flex flex-col items-center justify-center pt-2 border-t border-black">
          <QRCodeSVG value={qrUrl} size={80} className="print-qr mb-2" />
          <p className="text-[10px] text-center leading-tight font-bold">
            Scan to report overcharging<br/>or file a complaint.
          </p>
        </div>
      </div>

      {/* Middle: Tear Separator */}
      <div className="relative h-8 flex items-center justify-center overflow-hidden">
        <div className="absolute w-full border-t-2 border-dashed border-gray-400"></div>
        <div className="bg-white px-2 z-10 text-xs font-bold text-gray-500 tracking-widest">
          ← TEAR HERE →
        </div>
      </div>

      {/* Bottom Half: Kitchen Slip */}
      <div className="p-6 pt-2 bg-amber-50">
        <div className="text-center mb-4 pb-2 border-b-2 border-dashed border-black">
          <h2 className="font-bold text-lg tracking-widest">- - KITCHEN SLIP - -</h2>
        </div>
        
        <div className="mb-4">
          <p><strong>Order No:</strong> {order.orderNumber}</p>
          <p><strong>Seat No:</strong> {order.seatNumber} | <strong>Coach:</strong> {order.coachNumber}</p>
        </div>
        
        <div className="border-t border-b border-black py-4 mb-4 text-base font-bold">
          {order.items.map((item: OrderItem, idx: number) => (
            <div key={idx} className="flex justify-between mb-2">
              <span>{item.quantity}x {item.name}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between text-sm">
          <p><strong>Status:</strong> {order.status.toUpperCase()}</p>
          <p><strong>Time:</strong> {format(new Date(order.createdAt), "HH:mm")}</p>
        </div>
        
        <div className="mt-4 border-t-2 border-dashed border-gray-400 pt-2 text-center text-xs text-gray-500">
          - - - - - - - - - - - - - - -
        </div>
      </div>
    </div>
  );
}
