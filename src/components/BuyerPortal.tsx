import React, { useState } from 'react';
import { Product, Review } from '../types';
import { ShoppingCart, Search, MapPin, Heart, Package, MessageSquare, X, CheckCircle2, List } from 'lucide-react';
import { StarRating } from './StarRating';
import { PriceTrendChart } from './PriceTrendChart';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { MyOrdersView } from './MyOrdersView';

function ProduceCard({ produce, isWishlisted, onToggleWishlist, onAddReview }: { produce: Product, isWishlisted: boolean, onToggleWishlist: (id: string) => void, onAddReview?: (productId: string, review: Review) => void }) {
  const [quantity, setQuantity] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [showReviews, setShowReviews] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  const { user, signIn } = useAuth();

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= produce.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleBulkBuy = () => {
    const bulkQty = Math.max(10, Math.min(50, produce.stock));
    setQuantity(bulkQty);
  };

  const handleOrder = async () => {
    if (!user) {
      // Require sign-in before booking
      try {
        await signIn();
      } catch (err) {
        return; // user cancelled or error
      }
      return;
    }

    setIsBooking(true);
    try {
      await addDoc(collection(db, 'orders'), {
        productId: produce.id,
        productName: produce.name,
        quantity,
        totalPrice: produce.pricePerUnit * quantity,
        userId: user.uid,
        userEmail: user.email,
        status: 'pending',
        orderDate: new Date().toISOString(),
      });
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 3000);
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        console.warn('Firestore permissions block placing order.');
        alert('Cannot place order: Firestore security rules are blocking access. Please update your rules.');
      } else {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
      }
    } finally {
      setIsBooking(false);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || !onAddReview) return;
    
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author: 'Current User', // Mocked user
      rating: reviewRating,
      text: reviewText.trim(),
      date: new Date().toISOString().split('T')[0]
    };
    
    onAddReview(produce.id, newReview);
    setReviewText('');
    setReviewRating(5);
    setIsReviewModalOpen(false);
    setShowReviews(true);
  };

  const totalPrice = (produce.pricePerUnit * quantity).toFixed(2);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
        <div className="relative h-48 w-full bg-gray-200">
          <img src={produce.imageUrl} alt={produce.name} className="w-full h-full object-cover" />
          <button
            onClick={() => onToggleWishlist(produce.id)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm"
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-bold text-gray-900">{produce.name}</h3>
          </div>
          
          {produce.farmerLocation && (
            <p className="text-sm text-gray-500 flex items-center mb-2">
              <MapPin className="h-3.5 w-3.5 mr-1" /> {produce.farmerLocation}
            </p>
          )}

          <div className="mt-1 mb-3 flex items-center justify-between">
            <StarRating rating={produce.rating || 4.2} reviewCount={produce.reviewCount || 10} />
            <button 
              onClick={() => setIsReviewModalOpen(true)}
              className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center"
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1" /> Add Review
            </button>
          </div>
          <div className="text-sm text-gray-500 mb-3 space-x-2 flex flex-wrap gap-y-2">
            <span className="inline-block bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-medium">Verified</span>
            <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-medium">Stock: {produce.stock} {produce.unit}</span>
          </div>
          <p className="text-sm text-gray-600 mb-4 flex-1">{produce.description}</p>
          
          <div className="border-t border-gray-100 pt-4 mt-auto">
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-2xl font-bold text-amber-700">${totalPrice}</span>
                <span className="text-sm text-gray-500 ml-1">total</span>
                <div className="text-xs text-gray-400 mt-0.5">${produce.pricePerUnit} per {produce.unit}</div>
              </div>
              
              <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
                <button 
                  onClick={() => handleQuantityChange(-1)} 
                  className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-2 py-1 font-medium text-gray-900 min-w-[2.5rem] text-center text-sm border-x border-gray-200">
                  {quantity}
                </span>
                <button 
                  onClick={() => handleQuantityChange(1)} 
                  className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  disabled={quantity >= produce.stock}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={handleOrder}
                disabled={isBooking || bookingSuccess}
                className={`flex-1 flex items-center justify-center font-medium py-2.5 rounded-lg transition-colors ${
                  bookingSuccess 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : isBooking 
                      ? 'bg-amber-400 text-white cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {bookingSuccess ? (
                  <><CheckCircle2 className="h-4 w-4 mr-2" /> Booked!</>
                ) : isBooking ? (
                  'Processing...'
                ) : (
                  <><ShoppingCart className="h-4 w-4 mr-2" /> Order</>
                )}
              </button>
              <button 
                onClick={handleBulkBuy}
                className="flex-1 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2.5 rounded-lg transition-colors border border-indigo-200"
              >
                <Package className="h-4 w-4 mr-2" />
                Bulk Buy
              </button>
            </div>
            
            {produce.reviews && produce.reviews.length > 0 && (
              <div className="mt-4 border-t border-gray-100 pt-3">
                <button 
                  onClick={() => setShowReviews(!showReviews)}
                  className="w-full text-left text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center justify-between"
                >
                  <span>Customer Reviews ({produce.reviews.length})</span>
                  <span>{showReviews ? 'Hide' : 'Show'}</span>
                </button>
                
                {showReviews && (
                  <div className="mt-3 space-y-3 max-h-40 overflow-y-auto pr-1">
                    {produce.reviews.map(review => (
                      <div key={review.id} className="bg-gray-50 p-3 rounded-lg text-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-gray-900">{review.author}</span>
                          <span className="text-gray-500 text-xs">{review.date}</span>
                        </div>
                        <div className="flex items-center mb-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <svg key={star} className={`h-3 w-3 ${star <= review.rating ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-600">{review.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Review {produce.name}</h3>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitReview} className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
                    >
                      <svg 
                        className={`h-8 w-8 ${star <= reviewRating ? 'text-amber-400' : 'text-gray-300'} hover:text-amber-400 transition-colors`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 shadow-sm resize-none"
                  placeholder="Share your experience with this produce..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reviewText.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-600 border border-transparent rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

interface BuyerPortalProps {
  produceList: Product[];
  onAddReview?: (productId: string, review: Review) => void;
}

export function BuyerPortal({ produceList, onAddReview }: BuyerPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'shop' | 'orders'>('shop');

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((wId) => wId !== id) : [...prev, id]
    );
  };

  const filteredProduce = produceList.filter((produce) => {
    if (showWishlistOnly && !wishlistIds.includes(produce.id)) return false;
    
    const query = searchQuery.toLowerCase();
    const matchName = produce.name.toLowerCase().includes(query);
    const matchLocation = produce.farmerLocation?.toLowerCase().includes(query) ?? false;
    return matchName || matchLocation;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('shop')}
            className={`${
              activeTab === 'shop'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Browse Produce
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`${
              activeTab === 'orders'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
          >
            <List className="h-5 w-5 mr-2" />
            My Orders
          </button>
        </nav>
      </div>

      {activeTab === 'orders' ? (
        <MyOrdersView />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Buyer Portal</h2>
              <p className="text-gray-600 mt-1">Browse and purchase quality agricultural produce directly through our secure platform.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              {/* Wishlist Toggle Button */}
              <button
                onClick={() => setShowWishlistOnly(!showWishlistOnly)}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center border shadow-sm ${
                  showWishlistOnly 
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Heart className={`h-5 w-5 mr-2 ${showWishlistOnly ? 'fill-current' : 'text-gray-400'}`} />
                Wishlist {wishlistIds.length > 0 && `(${wishlistIds.length})`}
              </button>

              {/* Search Bar */}
              <div className="w-full sm:w-72 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
                  placeholder="Search produce or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <PriceTrendChart />

          {filteredProduce.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
              {showWishlistOnly && wishlistIds.length === 0 ? (
                 <>
                   <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                   <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                   <p className="text-gray-500 mt-1">Click the heart icon on any produce to save it for later.</p>
                 </>
              ) : (
                 <>
                   <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                   <h3 className="text-lg font-medium text-gray-900">No produce found</h3>
                   <p className="text-gray-500 mt-1">Try adjusting your search terms.</p>
                 </>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProduce.map((produce) => (
                <ProduceCard 
                  key={produce.id} 
                  produce={produce} 
                  isWishlisted={wishlistIds.includes(produce.id)}
                  onToggleWishlist={toggleWishlist}
                  onAddReview={onAddReview}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
