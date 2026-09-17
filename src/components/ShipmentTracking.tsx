import React, { useState } from 'react';
import { mockOrders } from '../data';
import { Search, PackageCheck, Truck, Clock, CheckCircle2, MapPin, Navigation, Phone, User } from 'lucide-react';
import { ShipmentStatus } from '../types';

export function ShipmentTracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(mockOrders[0]); // Default to first order for demo
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const order = mockOrders.find(o => o.trackingNumber.toLowerCase() === trackingNumber.toLowerCase());
    if (order) {
      setSearchedOrder(order);
    }
    setHasSearched(true);
  };

  const getStatusIcon = (status: ShipmentStatus, currentStatus: ShipmentStatus) => {
    const statuses: ShipmentStatus[] = ['processing', 'shipped', 'in_transit', 'delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    const stepIndex = statuses.indexOf(status);

    const isCompleted = stepIndex <= currentIndex;
    const isActive = stepIndex === currentIndex;

    let iconClass = 'h-8 w-8 ';
    if (isActive) iconClass += 'text-blue-600';
    else if (isCompleted) iconClass += 'text-green-600';
    else iconClass += 'text-gray-300';

    return (
      <div className="flex flex-col items-center z-10">
        <div className={`rounded-full bg-white p-2 border-2 ${isCompleted ? (isActive ? 'border-blue-600' : 'border-green-600') : 'border-gray-200'}`}>
          {status === 'processing' && <Clock className={iconClass} />}
          {status === 'shipped' && <PackageCheck className={iconClass} />}
          {status === 'in_transit' && <Truck className={iconClass} />}
          {status === 'delivered' && <CheckCircle2 className={iconClass} />}
        </div>
        <span className={`mt-2 text-sm font-medium bg-white px-2 rounded-lg ${isActive ? 'text-blue-700' : (isCompleted ? 'text-green-700' : 'text-gray-400')}`}>
          {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Track Your Shipment</h2>
        <p className="text-gray-600">Enter your tracking number below to see the current status of your order.</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            placeholder="e.g. TRK-99238472"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          Track
        </button>
      </form>

      {hasSearched && !searchedOrder && (
        <div className="text-center py-8 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500">No shipment found with that tracking number. Please check and try again.</p>
        </div>
      )}

      {(!hasSearched || searchedOrder) && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-6 mb-10 gap-4 sm:gap-0">
            <div>
              <p className="text-sm font-medium text-blue-600 tracking-wider uppercase mb-1">Order #{searchedOrder.id}</p>
              <h3 className="text-2xl font-bold text-gray-900">Shipment Status</h3>
            </div>
            <div className="text-left sm:text-right bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Expected Delivery</p>
              <p className="text-lg font-bold text-gray-900">Oct 30, 2023</p>
            </div>
          </div>

          {/* Timeline Progress */}
          <div className="relative mb-12">
            <div className="absolute top-8 left-10 right-10 h-1 bg-gray-200 hidden sm:block rounded-full"></div>
            <div 
              className="absolute top-8 left-10 h-1 bg-green-500 hidden sm:block transition-all duration-1000 ease-in-out rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"
              style={{ 
                width: 
                  searchedOrder.status === 'processing' ? '0%' :
                  searchedOrder.status === 'shipped' ? '33%' :
                  searchedOrder.status === 'in_transit' ? '66%' : '100%'
              }}
            ></div>

            <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-0">
              {getStatusIcon('processing', searchedOrder.status)}
              {getStatusIcon('shipped', searchedOrder.status)}
              {getStatusIcon('in_transit', searchedOrder.status)}
              {getStatusIcon('delivered', searchedOrder.status)}
            </div>
          </div>

          {/* Details & Live Location Grid */}
          <div className="pt-8 border-t border-gray-100 grid md:grid-cols-2 gap-8">
            
            {/* Left Column: Order Details & Driver */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-gray-900 flex items-center mb-4">
                  <PackageCheck className="h-5 w-5 mr-2 text-gray-500" /> Ordered Items
                </h4>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900 text-lg">{searchedOrder.productName}</span>
                    <span className="font-bold text-gray-900">${searchedOrder.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Quantity: {searchedOrder.quantity} units</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">Paid via Escrow</span>
                  </div>
                </div>
              </div>
              
              {searchedOrder.driverName && (
                <div>
                  <h4 className="text-lg font-bold text-gray-900 flex items-center mb-4">
                    <User className="h-5 w-5 mr-2 text-gray-500" /> Carrier Details
                  </h4>
                  <div className="flex items-center space-x-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{searchedOrder.driverName}</p>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone className="h-3 w-3 mr-1" /> {searchedOrder.driverPhone}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live Location */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gray-900 flex items-center">
                <Navigation className="h-5 w-5 mr-2 text-blue-500" /> Live Location
              </h4>
              
              <div className="relative h-[250px] w-full bg-gray-200 rounded-xl overflow-hidden shadow-inner border border-gray-200">
                {/* Mock map background using an aerial view */}
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
                  alt="Map view" 
                  className="w-full h-full object-cover opacity-70 filter grayscale-[20%]"
                />
                
                {/* Overlay UI Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-lg shadow-md border border-gray-100">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Current GPS Ping</p>
                  <p className="text-sm font-bold text-gray-900 flex items-center mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-red-500" /> 
                    {searchedOrder.currentLocation || "Location updating..."}
                  </p>
                </div>

                {/* Radar Ping Animation */}
                {searchedOrder.status !== 'delivered' && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <div className="absolute h-20 w-20 bg-blue-500/20 rounded-full animate-ping"></div>
                    <div className="absolute h-10 w-10 bg-blue-500/40 rounded-full animate-pulse"></div>
                    <div className="h-5 w-5 bg-blue-600 rounded-full border-2 border-white shadow-lg z-10 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
                
                {searchedOrder.status === 'delivered' && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                     <div className="h-8 w-8 bg-green-500 rounded-full border-2 border-white shadow-lg z-10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
