import React, { useState, useEffect } from 'react';
import { useParcel } from '../context/ParcelContext';
import { STATUS_INDEX, maskName } from '../data/mockData';
import { 
  Search, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Copy, 
  Check, 
  Info, 
  Bell, 
  AlertTriangle, 
  Building2, 
  Scale, 
  Package, 
  User, 
  CheckCircle2, 
  Calendar,
  X,
  Send,
  Ban,
  RotateCcw
} from 'lucide-react';

export const TrackParcel = () => {
  const { 
    parcels, 
    selectedParcelId, 
    setSelectedParcelId, 
    getParcelById, 
    reportIssue, 
    saveNotificationPreference,
    toggleCollectionEstimateUpdate,
    setActiveScreen
  } = useParcel();

  const [searchQuery, setSearchQuery] = useState(selectedParcelId || 'KRL-28491');
  const [copied, setCopied] = useState(false);

  // Modal States
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueProblem, setIssueProblem] = useState("Parcel hasn't reached expected depot");
  const [issueDetails, setIssueDetails] = useState('');
  const [reportedRef, setReportedRef] = useState(null);

  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyMobile, setNotifyMobile] = useState('');
  const [notifySaved, setNotifySaved] = useState(false);

  useEffect(() => {
    if (selectedParcelId) {
      setSearchQuery(selectedParcelId);
    }
  }, [selectedParcelId]);

  const parcel = getParcelById(searchQuery);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      setSelectedParcelId(searchQuery.trim().toUpperCase());
    }
  };

  const handleSelectSample = (id) => {
    setSearchQuery(id);
    setSelectedParcelId(id);
    setReportedRef(null);
    setNotifySaved(false);
  };

  const handleCopyId = () => {
    if (parcel) {
      navigator.clipboard.writeText(parcel.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!parcel) return;
    const ref = reportIssue(parcel.id, {
      problem: issueProblem,
      details: issueDetails
    });
    setReportedRef(ref || 'ISS-1042');
  };

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!notifyMobile.trim() || notifyMobile.trim().length < 10) return;
    saveNotificationPreference(parcel.id, notifyMobile);
    setNotifySaved(true);
  };

  const isCancelled = parcel?.currentStatus === 'CANCELLED';
  const isCollected = parcel?.currentStatus === 'COLLECTED';
  const isReady = parcel?.currentStatus === 'READY_FOR_COLLECTION';

  const currentStageIndex = parcel ? STATUS_INDEX[parcel.currentStatus] ?? 0 : 0;

  const journeyStages = [
    { id: 'BOOKED', label: 'BOOKED', defaultLoc: `${parcel?.origin || 'Origin'} Depot` },
    { id: 'ACCEPTED', label: 'ACCEPTED', defaultLoc: `${parcel?.origin || 'Origin'} Depot` },
    { id: 'LOADED', label: 'LOADED', defaultLoc: `${parcel?.origin || 'Origin'} Depot` },
    { id: 'IN_TRANSIT', label: 'IN TRANSIT', defaultLoc: 'KSRTC network' },
    { id: 'ARRIVED', label: 'ARRIVED', defaultLoc: `${parcel?.destination || 'Destination'} Depot` },
    { id: 'READY_FOR_COLLECTION', label: 'READY FOR COLLECTION', defaultLoc: `${parcel?.destination || 'Destination'} Depot` },
    { id: 'COLLECTED', label: 'COLLECTED', defaultLoc: `${parcel?.destination || 'Destination'} Depot` }
  ];

  return (
    <div className="flex-1 py-8 sm:py-12 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Track your parcel
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Recorded parcel updates from counter booking to depot collection.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                placeholder="Enter Consignment ID (e.g. KRL-28491)"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-sm tracking-wider uppercase focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all placeholder:normal-case placeholder:font-sans placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3.5 bg-emerald-800 text-white font-semibold text-sm rounded-xl hover:bg-emerald-900 active:scale-98 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </form>

          {/* Quick Demo Samples */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Sample consignments:</span>
            {parcels.slice(0, 5).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectSample(p.id)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all border ${
                  p.id === parcel?.id
                    ? 'bg-emerald-800 text-white border-emerald-800 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p.id}
              </button>
            ))}
          </div>
        </div>

        {/* NOT FOUND STATE */}
        {!parcel && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">Consignment Not Found</h2>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              No recorded updates matching "{searchQuery}". Try selecting a sample consignment above.
            </p>
            <button
              onClick={() => handleSelectSample('KRL-28491')}
              className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-xl hover:bg-emerald-900"
            >
              View KRL-28491 (In Transit)
            </button>
          </div>
        )}

        {/* PARCEL TRACKING FOUND */}
        {parcel && (
          <div className="space-y-6">
            {/* CANCELLED BANNER IF APPLICABLE */}
            {isCancelled && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 flex items-center gap-3">
                <Ban className="w-5 h-5 text-rose-600 shrink-0" />
                <div className="text-xs">
                  <strong className="text-sm block text-rose-900">This consignment has been cancelled.</strong>
                  Recorded status: CANCELLED. For courier inquiries or refunds, visit the origin depot counter.
                </div>
              </div>
            )}

            {/* MAIN TRACKING CARD (Requirement 7) */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md shadow-slate-200/40 overflow-hidden">
              {/* Header */}
              <div className="p-6 sm:p-8 bg-slate-900 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-wider">
                        {parcel.id}
                      </span>
                      <button
                        onClick={handleCopyId}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Copy Consignment ID"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="mt-2 text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                      <span>{parcel.origin} Depot</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">{parcel.destination} Depot</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Status:
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide uppercase ${
                      isCancelled 
                        ? 'bg-rose-700 text-white' 
                        : 'bg-emerald-700 text-white border border-emerald-500/40'
                    }`}>
                      {parcel.currentStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Latest Recorded Update Strip */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block uppercase text-[10px] font-bold tracking-wider">
                      LATEST RECORDED UPDATE
                    </span>
                    <span className="text-emerald-400 font-semibold mt-0.5 block font-mono">
                      {parcel.lastUpdated}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs">
                    Recorded at courier/depot checkpoint
                  </div>
                </div>
              </div>

              {/* VERTICAL JOURNEY TIMELINE (Requirement 7) */}
              <div className="p-6 sm:p-8">
                <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-[17px] sm:before:left-[21px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {journeyStages.map((stage, idx) => {
                    const stageIdx = STATUS_INDEX[stage.id] ?? idx;
                    const isCompleted = !isCancelled && stageIdx < currentStageIndex;
                    const isCurrent = !isCancelled && stageIdx === currentStageIndex;
                    const isPending = isCancelled || stageIdx > currentStageIndex;

                    const recordedEvent = parcel.timeline.find((t) => t.stage === stage.id);

                    return (
                      <div key={stage.id} className="relative flex items-start">
                        {/* Timeline Marker */}
                        <div className="absolute -left-[27px] sm:-left-[31px] mt-0.5">
                          {isCompleted ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : isCurrent ? (
                            <div className="relative flex items-center justify-center">
                              <span className="absolute w-6 h-6 rounded-full bg-emerald-500 opacity-50 animate-ping"></span>
                              <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-sm">
                                <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 text-slate-300 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            </div>
                          )}
                        </div>

                        {/* Stage Content */}
                        <div
                          className={`ml-4 flex-1 rounded-xl p-3.5 transition-all border ${
                            isCurrent
                              ? 'bg-emerald-50/80 border-emerald-200 shadow-2xs'
                              : isCompleted
                              ? 'bg-white border-slate-200'
                              : 'bg-slate-50/50 border-slate-200/60 opacity-60'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={`text-sm font-bold ${
                                isCurrent
                                  ? 'text-emerald-950 font-extrabold'
                                  : isCompleted
                                  ? 'text-slate-900'
                                  : 'text-slate-500'
                              }`}
                            >
                              {isCompleted && '✓ '}
                              {isCurrent && '● '}
                              {isPending && '○ '}
                              {stage.label}
                            </span>

                            <span className="text-xs font-mono text-slate-500">
                              {recordedEvent?.timestamp || (isPending ? 'Pending' : '')}
                            </span>
                          </div>

                          <div className="mt-1 text-xs text-slate-600 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{recordedEvent?.location || stage.defaultLoc}</span>
                          </div>

                          {recordedEvent?.note && (
                            <p className="mt-1.5 text-xs text-slate-600 bg-white/80 p-2 rounded-lg border border-slate-200/60">
                              {recordedEvent.note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* GRID: EXPECTED COLLECTION WINDOW & PARCEL DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* EXPECTED COLLECTION WINDOW (Requirement 6) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-800" />
                      {parcel.expectedCollection?.isUpdated ? 'COLLECTION ESTIMATE UPDATED' : 'EXPECTED COLLECTION'}
                    </span>

                    {/* Subtle Demo Toggle for testing delay update */}
                    <button
                      type="button"
                      onClick={() => toggleCollectionEstimateUpdate(parcel.id)}
                      className="text-[10px] font-semibold text-slate-400 hover:text-slate-700 bg-slate-100 px-2 py-0.5 rounded transition-colors"
                      title="Simulate delay / update estimate"
                    >
                      {parcel.expectedCollection?.isUpdated ? 'Reset Estimate' : 'Simulate Delay'}
                    </button>
                  </div>

                  {parcel.expectedCollection?.isUpdated ? (
                    <div className="space-y-2 mt-2">
                      <div className="text-xs text-slate-400 line-through">
                        Previous: {parcel.expectedCollection.previousTimeWindow}
                      </div>
                      <div className="text-2xl font-extrabold text-amber-900">
                        {parcel.expectedCollection.timeWindow}
                      </div>
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        {parcel.expectedCollection.depot || `${parcel.destination} Depot`}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 mt-2">
                      <div className="text-xs font-semibold text-slate-500">
                        {parcel.expectedCollection?.date || 'Today'}
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900">
                        {parcel.expectedCollection?.timeWindow || '2:00 PM – 4:00 PM'}
                      </div>
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 pt-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        {parcel.expectedCollection?.depot || `${parcel.destination} Depot`}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400 italic">
                  Demo estimate based on recorded transit updates.
                </div>
              </div>

              {/* PARCEL DETAILS SUMMARY (Requirement 8) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 block mb-4">
                  PARCEL DETAILS
                </span>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Category</span>
                    <span className="font-bold text-slate-900">{parcel.category}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Weight</span>
                    <span className="font-bold text-slate-900">{parcel.weight} kg</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Origin</span>
                    <span className="font-bold text-slate-900">{parcel.origin} Depot</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Destination</span>
                    <span className="font-bold text-slate-900">{parcel.destination} Depot</span>
                  </div>

                  {/* Masked Receiver Name for Privacy (Requirement 8) */}
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-slate-500">Receiver</span>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {maskName(parcel.receiver.name)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* NOTIFICATION PREFERENCE (Requirement 9) */}
            {!isReady && !isCollected && !isCancelled && (
              <div className="bg-emerald-950 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    Want to know when your parcel is ready?
                  </h3>
                  <p className="text-xs text-emerald-200 mt-1">
                    Receive an alert as soon as the consignment is checked in at the destination pickup counter.
                  </p>
                </div>

                <button
                  onClick={() => setShowNotifyModal(true)}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs"
                >
                  {parcel.notificationSaved ? '✓ Notification Enabled' : 'Notify me'}
                </button>
              </div>
            )}

            {/* REPORT AN ISSUE (Requirement 5) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Having an issue with this parcel?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Report transit delays, damaged consignments, or depot pickup difficulties.
                </p>
              </div>

              <button
                onClick={() => {
                  setReportedRef(null);
                  setShowIssueModal(true);
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors shrink-0"
              >
                Report an Issue
              </button>
            </div>
          </div>
        )}
      </div>

      {/* NOTIFICATION PREFERENCE MODAL (Requirement 9) */}
      {showNotifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-slate-900">NOTIFY ME</h3>
              </div>
              <button
                onClick={() => setShowNotifyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {notifySaved ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">
                  ✓ Notification preference saved
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This prototype will notify you when the parcel reaches Ready for Collection.
                </p>
                <button
                  onClick={() => setShowNotifyModal(false)}
                  className="mt-3 px-5 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="space-y-4">
                <p className="text-xs text-slate-600">
                  Enter your mobile number to receive destination arrival updates for consignment <strong className="font-mono">{parcel?.id}</strong>.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Mobile number:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9846123456"
                      value={notifyMobile}
                      onChange={(e) => setNotifyMobile(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNotifyModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900"
                  >
                    Enable Notification
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* REPORT AN ISSUE MODAL (Requirement 5) */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">REPORT AN ISSUE</h3>
                <p className="text-xs text-slate-500 font-mono">Consignment: {parcel?.id}</p>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportedRef ? (
              <div className="text-center py-5 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-base font-bold text-slate-900">✓ Issue Reported</h4>
                <div className="bg-slate-100 p-3 rounded-xl inline-block font-mono text-sm font-bold text-slate-800">
                  Reference: {reportedRef}
                </div>
                <p className="text-xs text-slate-600">
                  The destination depot has been notified.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setShowIssueModal(false)}
                    className="px-5 py-2 bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-900"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleIssueSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    What's the problem?
                  </label>
                  <div className="space-y-2">
                    {[
                      "Parcel hasn't reached expected depot",
                      "Parcel appears delayed",
                      "Parcel damaged",
                      "Unable to collect",
                      "Other"
                    ].map((prob) => (
                      <label
                        key={prob}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800"
                      >
                        <input
                          type="radio"
                          name="issueProblem"
                          value={prob}
                          checked={issueProblem === prob}
                          onChange={(e) => setIssueProblem(e.target.value)}
                          className="text-emerald-800 focus:ring-emerald-700"
                        />
                        <span>{prob}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Additional details:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide any additional context regarding the issue..."
                    value={issueDetails}
                    onChange={(e) => setIssueDetails(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
