import React, { useState, useEffect } from 'react';
import { useParcel } from '../context/ParcelContext';
import { maskName } from '../data/mockData';
import { 
  ShieldCheck, 
  KeyRound, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  Building2, 
  User, 
  Phone, 
  AlertCircle,
  Clock,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReceiverHandover = () => {
  const { parcels, selectedParcelId, setSelectedParcelId, getParcelById, verifyHandover, setActiveScreen } = useParcel();

  // Prefer KRL-28493 as requested by prompt, or currently selected parcel
  const initialParcel = getParcelById(selectedParcelId) || getParcelById('KRL-28493') || parcels[0];
  const [activeParcelId, setActiveParcelId] = useState(initialParcel?.id || 'KRL-28493');
  
  const parcel = getParcelById(activeParcelId);

  const [verifyMode, setVerifyMode] = useState('OTP');
  const [otpValue, setOtpValue] = useState('');
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [handoverSuccess, setHandoverSuccess] = useState(parcel?.currentStatus === 'COLLECTED');
  const [collectedTimestamp, setCollectedTimestamp] = useState('');

  useEffect(() => {
    if (parcel) {
      const isCol = parcel.currentStatus === 'COLLECTED';
      setHandoverSuccess(isCol);
      if (isCol) {
        setCollectedTimestamp(parcel.lastUpdated || '18 Sept 2026, 12:45 PM');
      }
      setErrorMessage('');
      setOtpValue('');
    }
  }, [parcel?.id, parcel?.currentStatus]);

  const expectedOtp = parcel?.otp || '2849';

  const handleOtpAutoFill = () => {
    setOtpValue(expectedOtp);
    setErrorMessage('');
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!parcel) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const currentTs = `${now.getDate()} Sept ${now.getFullYear()}, ${timeString}`;

    if (verifyMode === 'OTP') {
      if (!otpValue.trim()) {
        setErrorMessage('Please enter the 4-digit verification OTP');
        return;
      }
      if (otpValue.trim() !== expectedOtp) {
        setErrorMessage(`Invalid OTP. For demo prototype, use code: ${expectedOtp}`);
        return;
      }

      verifyHandover(parcel.id, 'OTP', otpValue.trim());
      setCollectedTimestamp(currentTs);
      setHandoverSuccess(true);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}
    } else {
      if (!idNumber.trim()) {
        setErrorMessage('Please enter the receiver government ID number');
        return;
      }
      verifyHandover(parcel.id, 'ID', `${idType}: ${idNumber.trim()}`);
      setCollectedTimestamp(currentTs);
      setHandoverSuccess(true);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}
    }
  };

  return (
    <div className="flex-1 py-8 sm:py-12 bg-slate-50">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setActiveScreen('staff')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Staff Portal
          </button>

          {/* Quick Consignment Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Consignment:</span>
            <select
              value={activeParcelId}
              onChange={(e) => setActiveParcelId(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-900"
            >
              {parcels.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} ({p.currentStatus.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
            PARCEL HANDOVER
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Depot collection authentication and handover verification.
          </p>
        </div>

        {/* Handover Verification Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
          {/* Top Consignment Banner */}
          <div className="bg-slate-900 text-white p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Consignment
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white mt-0.5">
                {parcel?.id || 'KRL-28493'}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">
                Destination
              </span>
              <div className="text-sm sm:text-base font-bold text-emerald-400 flex items-center gap-1.5 justify-end mt-0.5">
                <Building2 className="w-4 h-4" />
                {parcel?.destination || 'Kochi'} Depot
              </div>
            </div>
          </div>

          {/* Receiver Info Summary (Requirement 12 - Masked Receiver) */}
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1 text-[10px]">
                  Receiver
                </span>
                <div className="text-base font-mono font-bold text-slate-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-800" />
                  {maskName(parcel?.receiver.name || 'Arjun Kumar')}
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1 text-[10px]">
                  Origin
                </span>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  {parcel?.origin} Depot
                </div>
              </div>
            </div>
          </div>

          {/* SUCCESS STATE (Requirement 12) */}
          {handoverSuccess ? (
            <div className="p-8 text-center space-y-5">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-950 uppercase tracking-tight">
                  ✓ PARCEL COLLECTED
                </h2>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-xs text-left max-w-sm mx-auto space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Consignment:</span>
                  <span className="font-mono font-bold text-slate-900">{parcel?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Collected at:</span>
                  <span className="font-bold text-slate-900">{parcel?.destination} Depot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & time:</span>
                  <span className="font-mono font-semibold text-slate-900">{collectedTimestamp}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-800">COLLECTED</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSelectedParcelId(parcel?.id);
                    setActiveScreen('track');
                  }}
                  className="px-5 py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors shadow-xs"
                >
                  View Tracking Journey
                </button>
                <button
                  onClick={() => setActiveScreen('staff')}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Back to Staff Portal
                </button>
              </div>
            </div>
          ) : (
            /* VERIFICATION FORM (Requirement 12) */
            <div className="p-6 sm:p-8 space-y-6">
              <form onSubmit={handleVerify} className="space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Verification: Enter 4-digit OTP
                    </label>
                    <span className="text-xs text-slate-400">
                      Demo OTP: <strong className="font-mono font-bold text-slate-800">{expectedOtp}</strong>
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="e.g. 2849"
                      value={otpValue}
                      onChange={(e) => {
                        setOtpValue(e.target.value.replace(/\D/g, ''));
                        setErrorMessage('');
                      }}
                      className="w-full text-center text-3xl font-mono font-extrabold tracking-widest py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                    />
                  </div>

                  {/* Auto-fill Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleOtpAutoFill}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline"
                    >
                      Click to Auto-fill Demo OTP ({expectedOtp})
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Handover */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl transition-all shadow-xs active:scale-98 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Handover & Mark Collected</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
