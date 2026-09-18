import React from 'react';
import { useParcel } from '../context/ParcelContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useParcel();

  if (!toastMessage) return null;

  const isError = toastMessage.type === 'error';
  const isInfo = toastMessage.type === 'info';

  return (
    <div className="fixed bottom-5 right-5 z-50 pointer-events-none transition-all duration-300 transform translate-y-0">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium backdrop-blur-md ${
          isError
            ? 'bg-rose-900/90 text-white border-rose-700 shadow-rose-950/20'
            : isInfo
            ? 'bg-slate-900/90 text-white border-slate-700 shadow-slate-950/20'
            : 'bg-emerald-950/90 text-white border-emerald-700 shadow-emerald-950/20'
        }`}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
        ) : isInfo ? (
          <Info className="w-5 h-5 text-sky-300 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        )}
        <span>{toastMessage.message}</span>
      </div>
    </div>
  );
};
