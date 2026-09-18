import React, { useState } from 'react';
import { useParcel } from '../context/ParcelContext';
import { 
  Package, 
  Search, 
  ArrowRight
} from 'lucide-react';

export const LandingPage = () => {
  const { setActiveScreen, setSelectedParcelId } = useParcel();
  const [quickSearchId, setQuickSearchId] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleQuickTrack = (e) => {
    e?.preventDefault();
    if (!quickSearchId.trim()) {
      setSearchError('Please enter a consignment ID');
      return;
    }
    const clean = quickSearchId.trim().toUpperCase();
    setSelectedParcelId(clean);
    setActiveScreen('track');
  };

  const handleSampleClick = (id) => {
    setSelectedParcelId(id);
    setActiveScreen('track');
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 lg:pt-28 lg:pb-20 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Brand Name */}
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-emerald-800">
            KSRTC PARCEL
          </span>

          {/* Tagline */}
          <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-none uppercase">
            BOOK. TRACK. <span className="text-emerald-800">COLLECT.</span>
          </h1>

          {/* Supporting Text */}
          <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            A simple digital journey for parcels travelling through the KSRTC network.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveScreen('book')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-800 text-white font-semibold text-sm sm:text-base hover:bg-emerald-900 active:scale-98 transition-all shadow-sm"
            >
              <Package className="w-5 h-5" />
              Book a Parcel
            </button>

            <button
              onClick={() => {
                setSelectedParcelId('KRL-28491');
                setActiveScreen('track');
              }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-slate-800 font-semibold text-sm sm:text-base border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:scale-98 transition-all"
            >
              <Search className="w-5 h-5 text-emerald-800" />
              Track a Parcel
            </button>
          </div>
        </div>
      </section>

      {/* Quick Consignment Lookup Section */}
      <section className="py-14 bg-slate-50 border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
              TRACK YOUR PARCEL
            </h2>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
            <form onSubmit={handleQuickTrack} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={quickSearchId}
                onChange={(e) => {
                  setQuickSearchId(e.target.value);
                  if (searchError) setSearchError('');
                }}
                placeholder="Enter Consignment ID"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm uppercase placeholder:normal-case placeholder:font-sans placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all"
              />
              <button
                type="submit"
                className="px-7 py-3 bg-emerald-800 text-white text-sm font-semibold rounded-xl hover:bg-emerald-900 transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Track</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {searchError && (
              <p className="mt-2 text-xs text-rose-600 font-medium px-1">{searchError}</p>
            )}

            {/* Small demo examples underneath */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="text-slate-400">Examples:</span>
              <button
                type="button"
                onClick={() => handleSampleClick('KRL-28491')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-medium transition-colors"
              >
                KRL-28491
              </button>
              <button
                type="button"
                onClick={() => handleSampleClick('KRL-28493')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-medium transition-colors"
              >
                KRL-28493
              </button>
              <button
                type="button"
                onClick={() => handleSampleClick('KRL-28494')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-medium transition-colors"
              >
                KRL-28494
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal HOW IT WORKS Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              HOW IT WORKS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-left">
            {/* 01 — BOOK */}
            <div className="space-y-3">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-800">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-wide uppercase">
                BOOK
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter route, sender, receiver and parcel details.
              </p>
            </div>

            {/* 02 — TRACK */}
            <div className="space-y-3">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-800">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-wide uppercase">
                TRACK
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Follow recorded parcel updates from booking to collection.
              </p>
            </div>

            {/* 03 — COLLECT */}
            <div className="space-y-3">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-800">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-wide uppercase">
                COLLECT
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Verify the receiver and complete secure handover at the destination depot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Minimal Footer */}
      <footer className="mt-auto bg-white border-t border-slate-100 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>KSRTC Parcel — Digital service concept</p>
        </div>
      </footer>
    </div>
  );
};
