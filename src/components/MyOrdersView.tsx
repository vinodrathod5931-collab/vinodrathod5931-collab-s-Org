import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Package, Calendar, DollarSign, Clock, Truck, CheckCircle, Search } from 'lucide-react';

interface OrderDoc {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  userId: string;
  userEmail: string;
  status: string;
  orderDate: string;
}

export function MyOrdersView() {
  const { user, signIn } = useAuth();
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders: OrderDoc[] = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() } as OrderDoc);
        });
        
        // Sort manually by date desc if no index is set (Firestore needs composite index if sorting with where)
        fetchedOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        
        setOrders(fetchedOrders);
      } catch (error: any) {
        if (error?.code === 'permission-denied') {
          console.warn('Firestore permissions block fetching orders.');
        } else {
          console.error('Error fetching orders:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto mt-8">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">View Your Orders</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">Please sign in to view your past purchases and track current shipments.</p>
        <button
          onClick={signIn}
          className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
          <p className="text-gray-500 mt-1">Track and manage your recent purchases</p>
        </div>
        <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center">
          <Package className="h-4 w-4 mr-2" />
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Total
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
          <p className="text-gray-500 mt-2">When you purchase produce, your orders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const dateObj = new Date(order.orderDate);
            const formattedDate = !isNaN(dateObj.getTime()) 
              ? dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
              : 'Unknown Date';

            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center text-sm text-gray-500 space-x-6">
                    <div>
                      <span className="block text-xs uppercase tracking-wider font-semibold text-gray-400 mb-0.5">Order Placed</span>
                      <span className="flex items-center text-gray-900 font-medium">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" /> {formattedDate}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wider font-semibold text-gray-400 mb-0.5">Total</span>
                      <span className="flex items-center text-gray-900 font-medium">
                        <DollarSign className="h-4 w-4 text-gray-400" /> {order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="block text-xs uppercase tracking-wider font-semibold text-gray-400 mb-0.5 text-right">Order ID</span>
                    <span className="font-mono text-gray-600">#{order.id.slice(0, 8)}...</span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{order.productName}</h4>
                    <p className="text-gray-500">Quantity: {order.quantity} units</p>
                  </div>
                  
                  <div className="flex flex-col items-end min-w-[140px]">
                    {order.status === 'pending' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                        <Clock className="h-4 w-4 mr-1.5" /> Processing
                      </span>
                    )}
                    {order.status === 'shipped' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <Truck className="h-4 w-4 mr-1.5" /> Shipped
                      </span>
                    )}
                    {order.status === 'delivered' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4 mr-1.5" /> Delivered
                      </span>
                    )}
                    
                    <button className="mt-3 text-sm font-medium text-amber-600 hover:text-amber-700">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
