import React from 'react';
import { ParcelProvider, useParcel } from './context/ParcelContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { BookParcel } from './components/BookParcel';
import { BookingConfirmation } from './components/BookingConfirmation';
import { TrackParcel } from './components/TrackParcel';
import { StaffDashboard } from './components/StaffDashboard';
import { ReceiverHandover } from './components/ReceiverHandover';
import { Toast } from './components/Toast';

const AppContent = () => {
  const { activeScreen } = useParcel();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {activeScreen === 'home' && <LandingPage />}
        {activeScreen === 'book' && <BookParcel />}
        {activeScreen === 'confirmation' && <BookingConfirmation />}
        {activeScreen === 'track' && <TrackParcel />}
        {activeScreen === 'staff' && <StaffDashboard />}
        {activeScreen === 'handover' && <ReceiverHandover />}
      </main>

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ParcelProvider>
      <AppContent />
    </ParcelProvider>
  );
}
