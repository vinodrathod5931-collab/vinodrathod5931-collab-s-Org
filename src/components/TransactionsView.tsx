import React from 'react';
import { Package, Truck, Calendar, DollarSign, RefreshCw, ShoppingCart, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { mockOrders } from '../data';
import { Order } from '../types';

export function TransactionsView() {
  const farmerSales = mockOrders.filter(o => o.role === 'buyer'); // When buyers buy, farmers sell produce
  const farmerPurchases = mockOrders.filter(o => o.role === 'farmer'); // When farmers buy seeds
  
  const totalSalesVolume = farmerSales.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalPurchaseVolume = farmerPurchases.reduce((acc, curr) => acc + curr.totalPrice, 0);

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Buying & Selling Information</h2>
        <p className="text-gray-600 mt-1">Review your recent transaction history, sales volume, and order statuses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Total Sales (Produce)</h3>
            <div className="h-10 w-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-gray-900">${totalSalesVolume.toFixed(2)}</p>
          <p className="text-sm text-green-600 font-medium mt-2 flex items-center">
             +12% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Total Purchases (Seeds)</h3>
            <div className="h-10 w-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-gray-900">${totalPurchaseVolume.toFixed(2)}</p>
          <p className="text-sm text-amber-600 font-medium mt-2 flex items-center">
             -5% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Active Shipments</h3>
            <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-gray-900">{mockOrders.filter(o => o.status !== 'delivered').length}</p>
          <p className="text-sm text-blue-600 font-medium mt-2">
            Items currently in transit
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <RefreshCw className="h-5 w-5 mr-2 text-gray-500" /> Recent Transactions
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Item Details
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockOrders.map((order) => {
                const isSale = order.role === 'buyer';
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">{order.id}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <Truck className="h-3 w-3 mr-1"/> {order.trackingNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isSale ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                          <TrendingUp className="h-3 w-3 mr-1" /> Sale (Produce)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800">
                          <ShoppingCart className="h-3 w-3 mr-1" /> Purchase (Seeds)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{order.productName}</div>
                      <div className="text-sm text-gray-500">Qty: {order.quantity} units</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        {order.totalPrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
