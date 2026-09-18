import React, { useState } from 'react';
import { useParcel } from '../context/ParcelContext';
import { DEPOTS, CATEGORIES, calculateEstimatedCharge } from '../data/mockData';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Package,
  MapPin,
  Calendar,
  User,
  Phone,
  ShieldAlert,
  Scale,
  Info,
  Building
} from 'lucide-react';

export const BookParcel = () => {
  const { createParcel, setActiveScreen } = useParcel();

  // Current step: 1, 2, or 3
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    origin: 'Thrissur',
    destination: 'Ernakulam',
    bookingDate: new Date().toISOString().split('T')[0],
    senderName: '',
    senderMobile: '',
    receiverName: '',
    receiverMobile: '',
    category: 'Documents',
    weight: '1.5',
    description: '',
    isFragile: false
  });

  const [errors, setErrors] = useState({});

  const estimatedCharge = calculateEstimatedCharge(formData.weight, formData.isFragile);

  const validateStep1 = () => {
    const errs = {};
    if (!formData.origin) errs.origin = 'Select origin depot';
    if (!formData.destination) errs.destination = 'Select destination depot';
    if (formData.origin && formData.destination && formData.origin === formData.destination) {
      errs.destination = 'Destination depot cannot be the same as origin depot';
    }
    if (!formData.bookingDate) errs.bookingDate = 'Select booking date';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.senderName.trim()) errs.senderName = 'Sender name is required';
    if (!formData.senderMobile.trim()) {
      errs.senderMobile = 'Sender mobile is required';
    } else if (!/^\d{10}$/.test(formData.senderMobile.trim())) {
      errs.senderMobile = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.receiverName.trim()) errs.receiverName = 'Receiver name is required';
    if (!formData.receiverMobile.trim()) {
      errs.receiverMobile = 'Receiver mobile is required';
    } else if (!/^\d{10}$/.test(formData.receiverMobile.trim())) {
      errs.receiverMobile = 'Enter a valid 10-digit mobile number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!formData.category) errs.category = 'Select a category';
    const weightNum = parseFloat(formData.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      errs.weight = 'Enter a valid weight in kg';
    } else if (weightNum > 50) {
      errs.weight = 'Maximum supported counter parcel weight is 50 kg';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setErrors({});
      setCurrentStep((prev) => prev - 1);
    } else {
      setActiveScreen('home');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep3()) return;
    createParcel(formData);
  };

  return (
    <div className="flex-1 py-8 sm:py-12 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb / Back */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {currentStep === 1 ? 'Back to Home' : 'Previous Step'}
          </button>
        </div>

        {/* Title Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            Counter Registration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Book a Parcel
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Register your parcel for delivery across KSRTC's statewide bus depot network.
          </p>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            {/* Step 1 Pill */}
            <div
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${currentStep === 1
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                  : currentStep > 1
                    ? 'text-slate-800'
                    : 'text-slate-400'
                }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep > 1
                      ? 'bg-emerald-800 text-white'
                      : currentStep === 1
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                >
                  {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
                </span>
                <span className="text-xs hidden sm:inline">Step 1</span>
              </div>
              <span className="text-xs font-medium">Route & Date</span>
            </div>

            {/* Step 2 Pill */}
            <div
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${currentStep === 2
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                  : currentStep > 2
                    ? 'text-slate-800'
                    : 'text-slate-400'
                }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep > 2
                      ? 'bg-emerald-800 text-white'
                      : currentStep === 2
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                >
                  {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
                </span>
                <span className="text-xs hidden sm:inline">Step 2</span>
              </div>
              <span className="text-xs font-medium">Contact Details</span>
            </div>

            {/* Step 3 Pill */}
            <div
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${currentStep === 3
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                  : 'text-slate-400'
                }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === 3
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-200 text-slate-600'
                    }`}
                >
                  3
                </span>
                <span className="text-xs hidden sm:inline">Step 3</span>
              </div>
              <span className="text-xs font-medium">Parcel Details</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            {/* STEP 1: ROUTE & DATE */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Select Origin and Destination Depots
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    KSRTC parcels travel via designated inter-depot bus routes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Origin Depot */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                      Origin Depot
                    </label>
                    <select
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                    >
                      {DEPOTS.map((d) => (
                        <option key={`origin-${d}`} value={d}>
                          {d} Depot
                        </option>
                      ))}
                    </select>
                    {errors.origin && (
                      <p className="text-xs text-rose-600 mt-1">{errors.origin}</p>
                    )}
                  </div>

                  {/* Destination Depot */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-emerald-800" />
                      Destination Depot
                    </label>
                    <select
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                    >
                      {DEPOTS.map((d) => (
                        <option key={`dest-${d}`} value={d}>
                          {d} Depot
                        </option>
                      ))}
                    </select>
                    {errors.destination && (
                      <p className="text-xs text-rose-600 mt-1">{errors.destination}</p>
                    )}
                  </div>
                </div>

                {/* Booking Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                    Booking Date
                  </label>
                  <input
                    type="date"
                    value={formData.bookingDate}
                    onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                    className="w-full sm:w-1/2 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                  />
                  {errors.bookingDate && (
                    <p className="text-xs text-rose-600 mt-1">{errors.bookingDate}</p>
                  )}
                </div>

                {/* Route preview pill */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-emerald-100" />
                  </div>
                  <div>
                    <span className="font-bold text-emerald-950">
                      Route: {formData.origin} Depot → {formData.destination} Depot
                    </span>
                    <p className="text-emerald-800 mt-0.5">
                      Handled directly by regular KSRTC bus and parcel courier services.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white font-semibold text-sm rounded-xl hover:bg-emerald-900 active:scale-98 transition-all"
                  >
                    <span>Continue to Contact Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SENDER & RECEIVER */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Sender and Receiver Information
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Receiver will receive pickup alerts and verification codes at the destination depot.
                  </p>
                </div>

                {/* Sender Group */}
                <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <User className="w-4 h-4 text-emerald-800" />
                    Sender Details ({formData.origin} Depot)
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Sender Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Varma"
                        value={formData.senderName}
                        onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                      />
                      {errors.senderName && (
                        <p className="text-xs text-rose-600 mt-1">{errors.senderName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Sender Mobile Number (10 digits) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="9847123456"
                          value={formData.senderMobile}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              senderMobile: e.target.value.replace(/\D/g, '')
                            })
                          }
                          className="w-full pl-12 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                        />
                      </div>
                      {errors.senderMobile && (
                        <p className="text-xs text-rose-600 mt-1">{errors.senderMobile}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Receiver Group */}
                <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <User className="w-4 h-4 text-emerald-800" />
                    Receiver Details ({formData.destination} Depot)
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Receiver Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Pooja Pillai"
                        value={formData.receiverName}
                        onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                      />
                      {errors.receiverName && (
                        <p className="text-xs text-rose-600 mt-1">{errors.receiverName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Receiver Mobile Number (10 digits) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="9446987654"
                          value={formData.receiverMobile}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              receiverMobile: e.target.value.replace(/\D/g, '')
                            })
                          }
                          className="w-full pl-12 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                        />
                      </div>
                      {errors.receiverMobile && (
                        <p className="text-xs text-rose-600 mt-1">{errors.receiverMobile}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white font-semibold text-sm rounded-xl hover:bg-emerald-900 active:scale-98 transition-all"
                  >
                    <span>Continue to Parcel Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PARCEL DETAILS & PRICING */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Parcel Category, Weight & Pricing
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Specify parcel attributes for verification at counter check-in.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-emerald-800" />
                      Parcel Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-xs text-rose-600 mt-1">{errors.category}</p>
                    )}
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-emerald-800" />
                      Approximate Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="50"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                    />
                    {errors.weight && (
                      <p className="text-xs text-rose-600 mt-1">{errors.weight}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Package Description / Contents
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Books, boxed electronics, fabric, etc."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                  />
                </div>

                {/* Fragile Toggle */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${formData.isFragile ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-600'}`}>
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900">Fragile or Delicate Handling</span>
                      <p className="text-xs text-slate-500">
                        Adds fragile sticker and separate priority stowage (+₹25)
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFragile}
                      onChange={(e) => setFormData({ ...formData, isFragile: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"></div>
                  </label>
                </div>

                {/* Estimated Charge Breakdown Card */}
                <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-900 shadow-md">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
                    <div>
                      <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                        Estimated Counter Rate
                      </span>
                      <div className="text-2xl font-extrabold text-white mt-0.5">
                        ₹{estimatedCharge}
                      </div>
                    </div>
                    <div className="text-right text-xs text-emerald-200 space-y-0.5">
                      <div>Base Fare: ₹50</div>
                      <div>Weight ({formData.weight || 0} kg): ₹{Math.max(0, Math.ceil(parseFloat(formData.weight) || 1) * 18)}</div>
                      {formData.isFragile && <div>Fragile Care: ₹25</div>}
                    </div>
                  </div>

                  <div className="mt-3 flex items-start gap-2 text-xs text-emerald-200/90 leading-relaxed">
                    <Info className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>
                      Demo pricing — final charges are determined at the KSRTC courier counter.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-7 py-3 bg-emerald-800 text-white font-semibold text-sm rounded-xl hover:bg-emerald-900 active:scale-98 shadow-sm transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm & Generate Booking</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
