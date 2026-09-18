import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PARCELS, STATUS_STAGES, STATUS_INDEX, calculateEstimatedCharge } from '../data/mockData';

const ParcelContext = createContext(null);

const STORAGE_KEY = 'ksrtc_parcel_demo_data_v2';

export const ParcelProvider = ({ children }) => {
  const [parcels, setParcels] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed reading from localStorage', e);
    }
    return INITIAL_PARCELS;
  });

  const [activeScreen, setActiveScreen] = useState('home'); // 'home' | 'book' | 'confirmation' | 'track' | 'staff' | 'handover'
  const [selectedParcelId, setSelectedParcelId] = useState('KRL-28491');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parcels));
    } catch (e) {
      console.warn('Failed saving to localStorage', e);
    }
  }, [parcels]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const resetDemoData = () => {
    setParcels(INITIAL_PARCELS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PARCELS));
    setSelectedParcelId('KRL-28491');
    showToast('Demo data reset to default state');
  };

  const getParcelById = (id) => {
    if (!id) return null;
    const cleanId = id.trim().toUpperCase();
    return parcels.find((p) => p.id.toUpperCase() === cleanId) || null;
  };

  const generateNextConsignmentId = () => {
    const num = Math.floor(28500 + Math.random() * 999);
    return `KRL-${num}`;
  };

  const createParcel = (bookingForm) => {
    const newId = generateNextConsignmentId();
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const dateFormatted = `${now.getDate()} Sept ${now.getFullYear()}`;

    const cost = calculateEstimatedCharge(bookingForm.weight, bookingForm.isFragile);
    const generatedOtp = String(Math.floor(1000 + Math.random() * 9000));

    const newParcel = {
      id: newId,
      origin: bookingForm.origin,
      destination: bookingForm.destination,
      bookingDate: dateFormatted,
      sender: {
        name: bookingForm.senderName.trim(),
        mobile: bookingForm.senderMobile.trim()
      },
      receiver: {
        name: bookingForm.receiverName.trim(),
        mobile: bookingForm.receiverMobile.trim()
      },
      category: bookingForm.category,
      weight: parseFloat(bookingForm.weight) || 1.0,
      description: bookingForm.description?.trim() || 'General parcel consignment',
      isFragile: Boolean(bookingForm.isFragile),
      estimatedCost: cost,
      currentStatus: 'BOOKED',
      paymentStatus: 'Pending at counter',
      lastUpdated: `${now.getDate()} Sept ${now.getFullYear()}, ${timeString}`,
      otp: generatedOtp,
      expectedCollection: {
        date: 'Tomorrow',
        timeWindow: '2:00 PM – 5:00 PM',
        depot: `${bookingForm.destination} Depot`,
        isUpdated: false,
        previousTimeWindow: null
      },
      notificationSaved: false,
      reportedIssues: [],
      timeline: [
        {
          stage: 'BOOKED',
          location: `${bookingForm.origin} Depot`,
          timestamp: `${now.getDate()} Sept ${now.getFullYear()}, ${timeString}`,
          note: `Booking registered at ${bookingForm.origin} courier counter`
        }
      ]
    };

    setParcels((prev) => [newParcel, ...prev]);
    setSelectedParcelId(newId);
    setActiveScreen('confirmation');
    showToast(`Booking registered! Consignment: ${newId}`);
    return newParcel;
  };

  const cancelParcel = (parcelId, reason = 'Change of plans') => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const timestamp = `${now.getDate()} Sept ${now.getFullYear()}, ${timeString}`;

    setParcels((prev) =>
      prev.map((parcel) => {
        if (parcel.id !== parcelId) return parcel;

        const cancelEvent = {
          stage: 'CANCELLED',
          location: `${parcel.origin} Depot`,
          timestamp,
          note: `Booking cancelled by customer. Reason: ${reason}`
        };

        return {
          ...parcel,
          currentStatus: 'CANCELLED',
          lastUpdated: timestamp,
          timeline: [...parcel.timeline, cancelEvent]
        };
      })
    );

    showToast('Booking cancelled successfully');
  };

  const updateParcelStatus = (parcelId, newStatus, customNote = null, customLocation = null) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const timestamp = `${now.getDate()} Sept ${now.getFullYear()}, ${timeString}`;

    setParcels((prev) =>
      prev.map((parcel) => {
        if (parcel.id !== parcelId) return parcel;

        let location = customLocation;
        if (!location) {
          if (newStatus === 'BOOKED' || newStatus === 'ACCEPTED' || newStatus === 'LOADED') {
            location = `${parcel.origin} Depot`;
          } else if (newStatus === 'IN_TRANSIT') {
            location = 'KSRTC network';
          } else {
            location = `${parcel.destination} Depot`;
          }
        }

        let note = customNote;
        if (!note) {
          const stageConfig = STATUS_STAGES.find((s) => s.id === newStatus);
          note = `Status updated to ${stageConfig?.label || newStatus}`;
        }

        const newTimelineEvent = {
          stage: newStatus,
          location,
          timestamp,
          note
        };

        return {
          ...parcel,
          currentStatus: newStatus,
          lastUpdated: timestamp,
          timeline: [...parcel.timeline, newTimelineEvent]
        };
      })
    );

    showToast('Status updated successfully');
  };

  const verifyHandover = (parcelId, verificationType = 'OTP', verificationValue = '') => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const timestamp = `${now.getDate()} Sept ${now.getFullYear()}, ${timeString}`;

    setParcels((prev) =>
      prev.map((parcel) => {
        if (parcel.id !== parcelId) return parcel;

        const note =
          verificationType === 'OTP'
            ? `Verified via Receiver Mobile OTP (${verificationValue}). Parcel handed over.`
            : `Verified via Government Photo ID (${verificationValue}). Parcel handed over.`;

        const newTimelineEvent = {
          stage: 'COLLECTED',
          location: `${parcel.destination} Depot`,
          timestamp,
          note
        };

        return {
          ...parcel,
          currentStatus: 'COLLECTED',
          lastUpdated: timestamp,
          timeline: [...parcel.timeline, newTimelineEvent]
        };
      })
    );

    showToast('Parcel collected successfully! Handover verified.');
  };

  const reportIssue = (parcelId, { problem, details }) => {
    const refCode = `ISS-${Math.floor(1040 + Math.random() * 50)}`;
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const timestamp = `${now.getDate()} Sept ${now.getFullYear()}, ${timeString}`;

    setParcels((prev) =>
      prev.map((parcel) => {
        if (parcel.id !== parcelId) return parcel;

        const newIssue = {
          reference: refCode,
          problem,
          details,
          timestamp
        };

        return {
          ...parcel,
          reportedIssues: [...(parcel.reportedIssues || []), newIssue]
        };
      })
    );

    showToast(`Issue reported! Reference: ${refCode}`);
    return refCode;
  };

  const saveNotificationPreference = (parcelId, mobile) => {
    setParcels((prev) =>
      prev.map((parcel) => {
        if (parcel.id !== parcelId) return parcel;
        return {
          ...parcel,
          notificationSaved: true,
          notificationMobile: mobile
        };
      })
    );
    showToast('Notification preference saved');
  };

  const toggleCollectionEstimateUpdate = (parcelId) => {
    setParcels((prev) =>
      prev.map((parcel) => {
        if (parcel.id !== parcelId) return parcel;
        const current = parcel.expectedCollection || {
          date: 'Today',
          timeWindow: '2:00 PM – 4:00 PM',
          depot: `${parcel.destination} Depot`,
          isUpdated: false
        };

        if (current.isUpdated) {
          return {
            ...parcel,
            expectedCollection: {
              ...current,
              isUpdated: false,
              timeWindow: current.previousTimeWindow || '2:00 PM – 4:00 PM',
              previousTimeWindow: null
            }
          };
        } else {
          return {
            ...parcel,
            expectedCollection: {
              ...current,
              isUpdated: true,
              previousTimeWindow: current.timeWindow,
              timeWindow: '4:00 PM – 6:00 PM'
            }
          };
        }
      })
    );
    showToast('Collection estimate window updated');
  };

  const value = {
    parcels,
    activeScreen,
    setActiveScreen,
    selectedParcelId,
    setSelectedParcelId,
    getParcelById,
    createParcel,
    cancelParcel,
    updateParcelStatus,
    verifyHandover,
    reportIssue,
    saveNotificationPreference,
    toggleCollectionEstimateUpdate,
    resetDemoData,
    toastMessage,
    showToast
  };

  return <ParcelContext.Provider value={value}>{children}</ParcelContext.Provider>;
};

export const useParcel = () => {
  const context = useContext(ParcelContext);
  if (!context) {
    throw new Error('useParcel must be used within a ParcelProvider');
  }
  return context;
};
