import React, { useState } from 'react';
import { useParcel } from '../context/ParcelContext';
import { STATUS_STAGES, STATUS_INDEX } from '../data/mockData';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Package, 
  Scale, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const StaffParcelModal = ({ parcelId, onClose }) => {
  const { getParcelById, updateParcelStatus, setActiveScreen, setSelectedParcelId } = useParcel();
  const parcel = getParcelById(parcelId);

  const [selectedStatus, setSelectedStatus] = useState(parcel?.currentStatus || 'ACCEPTED');
  const [customNote, setCustomNote] = useState('');

  if (!parcel) return null;

  const handleUpdate = (e) => {
    e.preventDefault();
    updateParcelStatus(parcel.id, selectedStatus, customNote.trim() || null);
    setCustomNote('');
  };

  const handleGoToHandover = () => {
    setSelectedParcelId(parcel.id);
    onClose();
    setActiveScreen('handover');
  };

  const statusOptions = [
    { id: 'ACCEPTED', label: 'Accepted at Counter' },
    { id: 'LOADED', label: 'Loaded on Fleet Bus' },
    { id: 'IN_TRANSIT', label: 'In Transit' },
    { id: 'ARRIVED', label: 'Arrived at Destination' },
    { id: 'READY_FOR_COLLECTION', label: 'Ready for Collection' },
    { id: 'COLLECTED', label: 'Collected (Receiver Handover)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                KSRTC Depot Staff Terminal
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {parcel.id}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-0.5">
              Consignment Operations & Status Control
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Top Route & Status Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Route</span>
              <div className="text-base font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
                <span>{parcel.origin} Depot</span>
                <ArrowRight className="w-4 h-4 text-emerald-800" />
                <span className="text-emerald-800">{parcel.destination} Depot</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Current Status</span>
              <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-800 text-white tracking-wide uppercase">
                {parcel.currentStatus.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Sender */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Sender Details
              </span>
              <div className="font-bold text-slate-900 text-sm">{parcel.sender.name}</div>
              <div className="text-slate-600 font-mono mt-0.5">+91 {parcel.sender.mobile}</div>
              <div className="text-slate-500 mt-0.5">{parcel.origin} Depot Counter</div>
            </div>

            {/* Receiver */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Receiver Details
              </span>
              <div className="font-bold text-slate-900 text-sm">{parcel.receiver.name}</div>
              <div className="text-slate-600 font-mono mt-0.5">+91 {parcel.receiver.mobile}</div>
              <div className="text-emerald-800 font-medium mt-0.5">{parcel.destination} Depot Collection</div>
            </div>

            {/* Attributes */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Parcel Details
              </span>
              <div className="font-bold text-slate-900 text-sm">{parcel.category} ({parcel.weight} kg)</div>
              <div className="text-slate-600 mt-0.5">{parcel.description}</div>
            </div>

            {/* Demo Verification OTP Code */}
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
              <span className="font-bold text-amber-800 uppercase tracking-wider block mb-1">
                Demo Handover OTP
              </span>
              <div className="font-mono text-base font-extrabold text-amber-950">
                {parcel.otp || '2849'}
              </div>
              <div className="text-amber-800 text-[11px] mt-0.5">
                Receiver shows this code at {parcel.destination} Depot counter
              </div>
            </div>
          </div>

          {/* STATUS CONTROLS */}
          <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              Update Parcel Status
            </h3>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {statusOptions.map((opt) => {
                  const isSelected = selectedStatus === opt.id;
                  const isCurrent = parcel.currentStatus === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedStatus(opt.id)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                        isSelected
                          ? 'bg-emerald-800 text-white border-emerald-800 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold leading-tight">{opt.id.replace(/_/g, ' ')}</div>
                      <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                        {opt.label}
                      </div>
                      {isCurrent && (
                        <span className={`inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded font-bold ${isSelected ? 'bg-emerald-900 text-white' : 'bg-slate-200 text-slate-700'}`}>
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Optional Checkpoint Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cleared depot inspection / Loaded on Bus KL-15-A-8902"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  disabled={selectedStatus === parcel.currentStatus && !customNote.trim()}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Save & Update Status
                </button>

                {(parcel.currentStatus === 'ARRIVED' || parcel.currentStatus === 'READY_FOR_COLLECTION') && (
                  <button
                    type="button"
                    onClick={handleGoToHandover}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <span>Proceed to OTP Handover</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* STATUS HISTORY LOG */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Recorded Status History
            </h3>

            <div className="space-y-2 text-xs">
              {parcel.timeline.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-slate-900">{item.stage}</span>
                    <span className="text-slate-500 ml-2">({item.location})</span>
                    {item.note && <p className="text-slate-600 text-[11px] mt-0.5">{item.note}</p>}
                  </div>
                  <span className="text-slate-400 font-mono text-[11px] shrink-0">
                    {item.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
