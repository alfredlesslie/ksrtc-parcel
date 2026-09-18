import React, { useState } from 'react';
import { useParcel } from '../context/ParcelContext';
import { QRCodeDisplay } from './QRCodeDisplay';
import { 
  CheckCircle2, 
  Printer, 
  Search, 
  ArrowLeft, 
  Copy, 
  Check, 
  Building2, 
  User, 
  Phone, 
  AlertCircle,
  XCircle,
  CreditCard,
  Ban
} from 'lucide-react';

export const BookingConfirmation = () => {
  const { getParcelById, selectedParcelId, setActiveScreen, setSelectedParcelId, cancelParcel } = useParcel();
  const [copied, setCopied] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of plans');
  const [otherReasonText, setOtherReasonText] = useState('');

  const parcel = getParcelById(selectedParcelId);

  if (!parcel) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">No Booking Selected</h2>
          <p className="text-sm text-slate-500 mt-1 mb-4">
            Please create a new booking or enter a consignment ID.
          </p>
          <button
            onClick={() => setActiveScreen('home')}
            className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl font-medium text-sm hover:bg-emerald-900"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isCancelled = parcel.currentStatus === 'CANCELLED';

  const handleCopyId = () => {
    navigator.clipboard.writeText(parcel.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTrack = () => {
    setSelectedParcelId(parcel.id);
    setActiveScreen('track');
  };

  const handleConfirmCancel = () => {
    const finalReason = cancelReason === 'Other' && otherReasonText.trim() ? otherReasonText.trim() : cancelReason;
    cancelParcel(parcel.id, finalReason);
    setShowCancelModal(false);
  };

  return (
    <div className="flex-1 py-8 sm:py-12 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Header Banner or Cancelled Banner */}
        <div className="text-center mb-8 no-print">
          {isCancelled ? (
            <div>
              <div className="w-14 h-14 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Ban className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Booking Cancelled
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Consignment {parcel.id} has been cancelled.
              </p>
            </div>
          ) : (
            <div>
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-800" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Booking Registered
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Present this digital receipt or QR code at the KSRTC origin courier counter.
              </p>
            </div>
          )}
        </div>

        {/* Printable Digital Receipt Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md shadow-slate-200/50 overflow-hidden print-card">
          {/* Header Receipt Strip */}
          <div className={`${isCancelled ? 'bg-slate-900' : 'bg-emerald-950'} text-white px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4 transition-colors`}>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                KSRTC Parcel Consignment
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-wider">
                  {parcel.id}
                </span>
                <button
                  onClick={handleCopyId}
                  className="no-print p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 transition-colors"
                  title="Copy Consignment ID"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-300">Status</span>
              <span className={`mt-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                isCancelled ? 'bg-rose-600 text-white' : 'bg-emerald-800 text-emerald-100 border border-emerald-700'
              }`}>
                {parcel.currentStatus.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Main Receipt Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Route & Booking Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-200">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Origin Depot
                </span>
                <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-800" />
                  {parcel.origin} Depot
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Booked on: {parcel.bookingDate}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Destination Depot
                </span>
                <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-800" />
                  {parcel.destination} Depot
                </div>
                <div className="text-xs text-emerald-800 font-semibold mt-1">
                  {isCancelled ? 'Booking Cancelled' : 'Ready for collection upon arrival'}
                </div>
              </div>
            </div>

            {/* Sender, Receiver, QR Code Split */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Sender Details */}
              <div className="space-y-1 text-sm bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Sender (Origin)
                </span>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  {parcel.sender.name}
                </div>
                <div className="text-xs text-slate-600 font-mono flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  +91 {parcel.sender.mobile}
                </div>
              </div>

              {/* Receiver Details */}
              <div className="space-y-1 text-sm bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Receiver (Destination)
                </span>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  {parcel.receiver.name}
                </div>
                <div className="text-xs text-slate-600 font-mono flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  +91 {parcel.receiver.mobile}
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center justify-center text-center p-2">
                <QRCodeDisplay value={parcel.id} size={130} />
                <span className="text-[11px] text-slate-400 mt-1">
                  {isCancelled ? 'Cancelled ID' : 'Digital Parcel ID'}
                </span>
              </div>
            </div>

            {/* Parcel Attributes Row */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Category
                </span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{parcel.category}</p>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Weight
                </span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{parcel.weight} kg</p>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Handling
                </span>
                <p className={`font-bold text-sm mt-0.5 ${parcel.isFragile ? 'text-amber-700 font-bold' : 'text-slate-900'}`}>
                  {parcel.isFragile ? 'Fragile' : 'Standard'}
                </p>
              </div>
            </div>

            {/* PAYMENT SECTION (Requirement 10) */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-800" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    PAYMENT
                  </span>
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  Estimate: ₹{parcel.estimatedCost}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200/80">
                <div>
                  <span className="text-slate-500 block">Payment Method</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    Pay at KSRTC Courier Counter
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Payment Status</span>
                  <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded font-bold ${
                    isCancelled ? 'bg-slate-200 text-slate-600' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {isCancelled ? 'Cancelled' : 'Pending at counter'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic pt-1">
                Demo estimate — final charges are determined at the KSRTC courier counter.
              </p>
            </div>

            {/* Cancelled Notice or Customer Guidelines */}
            {isCancelled ? (
              <div className="text-xs text-rose-800 bg-rose-50 p-4 rounded-xl border border-rose-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-rose-600" />
                  Booking Cancelled
                </div>
                <p>Cancellation/refund, if applicable, is subject to the applicable KSRTC courier policy.</p>
              </div>
            ) : (
              <div className="text-xs text-slate-500 bg-slate-100/70 p-3.5 rounded-xl border border-slate-200">
                <strong className="text-slate-700">Notice for Customer:</strong> Bring your parcel packaged securely to the {parcel.origin} Depot courier counter. Present this digital parcel receipt at the counter to verify weight, pay charges, and complete check-in.
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 no-print">
          <button
            onClick={handleTrack}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-800 text-white font-semibold text-sm rounded-xl hover:bg-emerald-900 shadow-sm transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Track Parcel</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 hover:bg-slate-50 shadow-2xs transition-all"
          >
            <Printer className="w-4 h-4 text-emerald-800" />
            <span>Download Receipt</span>
          </button>

          {!isCancelled && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="inline-flex items-center gap-1.5 px-5 py-3.5 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 font-semibold text-sm rounded-xl border border-rose-200 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel Booking</span>
            </button>
          )}

          <button
            onClick={() => setActiveScreen('home')}
            className="inline-flex items-center gap-2 px-5 py-3.5 bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* CANCELLATION MODAL (Requirement 3) */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Cancel Parcel Booking?
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Consignment: {parcel.id}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Reason for Cancellation
              </label>

              {[
                'Change of plans',
                'Incorrect booking details',
                'No longer required',
                'Other'
              ].map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800 transition-colors"
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={r}
                    checked={cancelReason === r}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>{r}</span>
                </label>
              ))}

              {cancelReason === 'Other' && (
                <input
                  type="text"
                  placeholder="Please specify reason"
                  value={otherReasonText}
                  onChange={(e) => setOtherReasonText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
                />
              )}
            </div>

            <p className="text-[11px] text-slate-500 mb-6 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              Cancellation/refund, if applicable, is subject to the applicable KSRTC courier policy.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white transition-colors shadow-xs"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
