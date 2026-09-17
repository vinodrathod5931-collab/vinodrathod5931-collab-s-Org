import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, getDocs, doc, updateDoc, addDoc, orderBy } from 'firebase/firestore';
import { Shield, Users, Package, RefreshCw, AlertTriangle, Plus, CheckCircle2, Search, X, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface AdminPortalProps {
  produceList: Product[];
  seedsList: Product[];
  onAddProduce: (product: Product) => void;
  onAddSeed: (product: Product) => void;
}

export function AdminPortal({ produceList, seedsList, onAddProduce, onAddSeed }: AdminPortalProps) {
  const { user, signInWithEmail } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [email, setEmail] = useState('vinodrathod5931@gmail.com');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [isAddingBooking, setIsAddingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  const isAdmin = user?.email === 'vinodrathod5931@gmail.com';

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'));
      const querySnapshot = await getDocs(q);
      const fetchedOrders: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() });
      });
      // Sort manually by date desc
      fetchedOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      setOrders(fetchedOrders);
    } catch (err: any) {
      console.error('Error fetching all orders:', err);
      if (err?.code === 'permission-denied') {
        alert("Firestore permissions are blocking access. Make sure you have deployed the Admin rules.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllOrders();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status.');
    }
  };

  // Add booking form state
  const [bookingForm, setBookingForm] = useState({
    productId: '',
    quantity: 1,
    userEmail: '',
    userId: 'admin-created'
  });

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.productId || !bookingForm.userEmail) {
      alert("Please fill in all required fields.");
      return;
    }
    
    const product = produceList.find(p => p.id === bookingForm.productId);
    if (!product) return;
    
    try {
      await addDoc(collection(db, 'orders'), {
        productId: product.id,
        productName: product.name,
        quantity: bookingForm.quantity,
        totalPrice: product.pricePerUnit * bookingForm.quantity,
        userId: bookingForm.userId,
        userEmail: bookingForm.userEmail,
        status: 'pending',
        orderDate: new Date().toISOString(),
        createdByAdmin: true
      });
      
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setIsAddingBooking(false);
        setBookingForm({ productId: '', quantity: 1, userEmail: '', userId: 'admin-created' });
        fetchAllOrders();
      }, 2000);
      
    } catch (err) {
      console.error('Error adding booking:', err);
      alert('Failed to add booking manually.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-gray-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-500 mt-2">Sign in to access the management portal</p>
          </div>
          
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
                placeholder="Enter admin password"
              />
            </div>
            
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start text-red-600 text-sm">
                <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <p>{loginError}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-70"
            >
              {isLoggingIn ? 'Verifying...' : 'Access Portal'}
            </button>
            <div className="text-center mt-4">
               <p className="text-xs text-gray-500">
                 Note: You must have "Email/Password" enabled in your Firebase Authentication providers for this to work.
               </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-gray-700" />
            Admin Dashboard
          </h2>
          <p className="text-gray-600 mt-1">Manage platform orders and product catalog.</p>
        </div>
        
        {activeTab === 'orders' && (
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={fetchAllOrders}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setIsAddingBooking(true)}
              className="px-4 py-2 bg-gray-900 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-gray-800 flex items-center justify-center transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </button>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'orders'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="h-5 w-5 mr-2" />
            Manage Orders
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'products'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Manage Catalog
          </button>
        </nav>
      </div>

      {activeTab === 'orders' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center text-gray-500 mb-2">
            <Package className="h-5 w-5 mr-2" /> Total Orders
          </div>
          <div className="text-3xl font-bold text-gray-900">{orders.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center text-amber-500 mb-2">
            <RefreshCw className="h-5 w-5 mr-2" /> Pending
          </div>
          <div className="text-3xl font-bold text-gray-900">{orders.filter(o => o.status === 'pending').length}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center text-green-500 mb-2">
            <CheckCircle2 className="h-5 w-5 mr-2" /> Delivered
          </div>
          <div className="text-3xl font-bold text-gray-900">{orders.filter(o => o.status === 'delivered').length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-900">
          All Orders
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User / ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading orders...' : 'No orders found in the system.'}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.userEmail}</div>
                      <div className="text-xs text-gray-400 font-mono">#{order.id.slice(0, 8)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.productName} (x{order.quantity})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-amber-100 text-amber-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="block w-full pl-3 pr-8 py-1.5 text-xs border-gray-300 focus:outline-none focus:ring-gray-900 focus:border-gray-900 rounded-md"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddingBooking && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Manual Admin Booking</h3>
              <button 
                onClick={() => setIsAddingBooking(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {bookingSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Booking Created</h4>
                <p className="text-gray-500">The manual booking was successfully added to the system.</p>
              </div>
            ) : (
              <form onSubmit={handleAddBooking} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                  <input
                    type="email"
                    required
                    value={bookingForm.userEmail}
                    onChange={(e) => setBookingForm({...bookingForm, userEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900 shadow-sm"
                    placeholder="customer@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                  <select
                    required
                    value={bookingForm.productId}
                    onChange={(e) => setBookingForm({...bookingForm, productId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900 shadow-sm"
                  >
                    <option value="">-- Choose Produce --</option>
                    {produceList.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (${p.pricePerUnit}/{p.unit})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={bookingForm.quantity}
                    onChange={(e) => setBookingForm({...bookingForm, quantity: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900 shadow-sm"
                  />
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingBooking(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                  >
                    Create Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      </>
      ) : (
        <AdminProductCatalog produceList={produceList} seedsList={seedsList} onAddProduce={onAddProduce} onAddSeed={onAddSeed} />
      )}
    </div>
  );
}

function AdminProductCatalog({ produceList, seedsList, onAddProduce, onAddSeed }: AdminPortalProps) {
  const [productType, setProductType] = useState<'produce' | 'seeds'>('produce');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quantity || !price) return;
    
    const newProduct: Product = {
      id: `${productType === 'produce' ? 'p' : 's'}-${Date.now()}`,
      name,
      category: productType,
      pricePerUnit: Number(price),
      unit,
      stock: Number(quantity),
      description,
      imageUrl: productType === 'produce' 
        ? 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=400'
        : 'https://images.unsplash.com/photo-1586521746200-d830b06b2a09?auto=format&fit=crop&q=80&w=400',
    };
    
    if (productType === 'produce') {
      onAddProduce(newProduct);
    } else {
      onAddSeed(newProduct);
    }
    
    // reset form
    setName('');
    setQuantity('');
    setPrice('');
    setDescription('');
    alert(`${productType === 'produce' ? 'Produce' : 'Seed'} added to catalog!`);
  };

  const listToDisplay = productType === 'produce' ? produceList : seedsList;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Add to Catalog</h3>
          <form className="space-y-4" onSubmit={handleAddProduct}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setProductType('produce')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${productType === 'produce' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                  Produce
                </button>
                <button
                  type="button"
                  onClick={() => setProductType('seeds')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${productType === 'seeds' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                  Seeds
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-gray-900 focus:border-gray-900" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input required value={quantity} onChange={e => setQuantity(e.target.value)} type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-gray-900 focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <input required value={unit} onChange={e => setUnit(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-gray-900 focus:border-gray-900" placeholder="e.g. kg, Bags" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input required value={price} onChange={e => setPrice(e.target.value)} type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-gray-900 focus:border-gray-900" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-gray-900 focus:border-gray-900" rows={2}></textarea>
            </div>
            
            <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 rounded-lg transition-colors text-sm">
              Add {productType === 'produce' ? 'Produce' : 'Seed'}
            </button>
          </form>
        </div>
      </div>
      
      <div className="md:col-span-2">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 capitalize">{productType} Catalog</h3>
            <span className="text-sm text-gray-500">{listToDisplay.length} items</span>
          </div>
          <div className="divide-y divide-gray-100">
            {listToDisplay.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No products found in this category.</div>
            ) : (
              listToDisplay.map(product => (
                <div key={product.id} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900">{product.name}</h4>
                      <span className="font-medium text-gray-900">${product.pricePerUnit}/{product.unit}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.description}</p>
                    <div className="mt-2 text-xs font-medium text-gray-500 bg-gray-100 inline-block px-2 py-1 rounded">
                      Stock: {product.stock} {product.unit}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
