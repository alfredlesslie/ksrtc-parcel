import React, { useState } from 'react';
import { useParcel } from '../context/ParcelContext';
import { StaffParcelModal } from './StaffParcelModal';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  Eye, 
  ArrowRight,
  CheckSquare,
  AlertCircle,
  Plus
} from 'lucide-react';

export const StaffDashboard = () => {
  const { parcels, setSelectedParcelId, setActiveScreen, updateParcelStatus } = useParcel();
  const [modalParcelId, setModalParcelId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate statistics (seeded with demo baseline + dynamic counts)
  const inTransitCount = parcels.filter((p) => p.currentStatus === 'IN_TRANSIT').length;
  const arrivedCount = parcels.filter((p) => p.currentStatus === 'ARRIVED').length;
  const readyCount = parcels.filter((p) => p.currentStatus === 'READY_FOR_COLLECTION').length;
  const bookingsCount = parcels.length >= 5 ? 24 + (parcels.length - 5) : 24;

  const stats = [
    { label: "Today's Bookings", value: bookingsCount, icon: Package, color: 'text-emerald-800', bg: 'bg-emerald-50' },
    { label: 'In Transit', value: 12 + inTransitCount - 1, icon: Truck, color: 'text-blue-800', bg: 'bg-blue-50' },
    { label: 'Arrived', value: 7 + arrivedCount - 1, icon: Clock, color: 'text-amber-800', bg: 'bg-amber-50' },
    { label: 'Ready for Collection', value: 5 + readyCount - 1, icon: CheckCircle2, color: 'text-emerald-800', bg: 'bg-emerald-50' }
  ];

  // Filtering
  const filteredParcels = parcels.filter((p) => {
    const matchesFilter =
      filterStatus === 'ALL' ||
      (filterStatus === 'IN_TRANSIT' && p.currentStatus === 'IN_TRANSIT') ||
      (filterStatus === 'ARRIVED' && p.currentStatus === 'ARRIVED') ||
      (filterStatus === 'READY' && p.currentStatus === 'READY_FOR_COLLECTION') ||
      (filterStatus === 'COLLECTED' && p.currentStatus === 'COLLECTED') ||
      (filterStatus === 'CANCELLED' && p.currentStatus === 'CANCELLED');

    const cleanQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !cleanQuery ||
      p.id.toLowerCase().includes(cleanQuery) ||
      p.origin.toLowerCase().includes(cleanQuery) ||
      p.destination.toLowerCase().includes(cleanQuery) ||
      p.receiver.name.toLowerCase().includes(cleanQuery) ||
      p.sender.name.toLowerCase().includes(cleanQuery);

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'BOOKED':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'ACCEPTED':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'LOADED':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'IN_TRANSIT':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'ARRIVED':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'READY_FOR_COLLECTION':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'COLLECTED':
        return 'bg-slate-800 text-slate-100 border-slate-700';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleQuickStatusUpdate = (parcel, nextStatus, note) => {
    updateParcelStatus(parcel.id, nextStatus, note, `${parcel.destination} Depot`);
  };

  return (
    <div className="flex-1 py-8 sm:py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Staff Operations Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              KSRTC Parcel Operations
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Manage depot bookings, update parcel status, and verify receiver collections.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveScreen('book')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Booking</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {item.label}
                  </span>
                  <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {item.value}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Active depot registry
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by ID, route, or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'IN_TRANSIT', label: 'In Transit' },
              { id: 'ARRIVED', label: 'Arrived' },
              { id: 'READY', label: 'Ready for Collection' },
              { id: 'COLLECTED', label: 'Collected' },
              { id: 'CANCELLED', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterStatus === tab.id
                    ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Parcels Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Active Consignments
            </h2>
            <span className="text-xs text-slate-500">
              Showing {filteredParcels.length} consignment{filteredParcels.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Consignment ID</th>
                  <th className="py-3.5 px-6">Route</th>
                  <th className="py-3.5 px-6">Category & Weight</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Last Updated</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredParcels.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      No consignments match your search or filter.
                    </td>
                  </tr>
                ) : (
                  filteredParcels.map((parcel) => (
                    <tr
                      key={parcel.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        {parcel.id}
                      </td>

                      {/* Route */}
                      <td className="py-4 px-6 font-medium text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <span>{parcel.origin}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-900">{parcel.destination}</span>
                        </div>
                      </td>

                      {/* Category & Weight */}
                      <td className="py-4 px-6 text-slate-600">
                        <span>{parcel.category}</span>
                        <span className="text-slate-400 ml-1.5">({parcel.weight} kg)</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                            parcel.currentStatus
                          )}`}
                        >
                          {parcel.currentStatus.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Last Updated */}
                      <td className="py-4 px-6 text-slate-500 font-mono text-xs">
                        {parcel.lastUpdated}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Status Update buttons */}
                          {parcel.currentStatus === 'IN_TRANSIT' && (
                            <button
                              onClick={() => handleQuickStatusUpdate(parcel, 'ARRIVED', `Arrived at ${parcel.destination} Depot`)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-lg border border-amber-200 transition-colors"
                              title="Mark Arrived"
                            >
                              Mark Arrived
                            </button>
                          )}

                          {parcel.currentStatus === 'ARRIVED' && (
                            <button
                              onClick={() => handleQuickStatusUpdate(parcel, 'READY_FOR_COLLECTION', `Staged at customer pickup counter at ${parcel.destination} Depot`)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors"
                              title="Mark Ready for Collection"
                            >
                              Mark Ready
                            </button>
                          )}

                          {/* View Modal */}
                          <button
                            onClick={() => setModalParcelId(parcel.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {/* Handover direct button if ready or arrived */}
                          {(parcel.currentStatus === 'READY_FOR_COLLECTION' || parcel.currentStatus === 'ARRIVED') && (
                            <button
                              onClick={() => {
                                setSelectedParcelId(parcel.id);
                                setActiveScreen('handover');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors"
                              title="Verify Receiver Handover"
                            >
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-200" />
                              <span>Handover</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Staff Parcel Detail & Status Modal */}
      {modalParcelId && (
        <StaffParcelModal
          parcelId={modalParcelId}
          onClose={() => setModalParcelId(null)}
        />
      )}
    </div>
  );
};
