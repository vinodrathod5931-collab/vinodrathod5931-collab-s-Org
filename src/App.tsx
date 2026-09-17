/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navigation, ViewState } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { FarmerPortal } from './components/FarmerPortal';
import { BuyerPortal } from './components/BuyerPortal';
import { ShipmentTracking } from './components/ShipmentTracking';
import { TransactionsView } from './components/TransactionsView';
import { AdminPortal } from './components/AdminPortal';
import { mockProduce, mockSeeds } from './data';
import { Product, Review } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [produceList, setProduceList] = useState<Product[]>(mockProduce);
  const [seedsList, setSeedsList] = useState<Product[]>(mockSeeds);

  const handleAddProduce = (newProduce: Product) => {
    setProduceList([newProduce, ...produceList]);
    if (currentView !== 'admin') {
      setCurrentView('buyer');
    }
  };

  const handleAddSeed = (newSeed: Product) => {
    setSeedsList([newSeed, ...seedsList]);
  };

  const handleAddReview = (productId: string, review: Review) => {
    setProduceList(prevList => prevList.map(produce => {
      if (produce.id === productId) {
        return {
          ...produce,
          reviews: [...(produce.reviews || []), review],
          reviewCount: (produce.reviewCount || 0) + 1,
          rating: produce.reviews?.length 
            ? ((produce.rating || 0) * produce.reviews.length + review.rating) / (produce.reviews.length + 1)
            : review.rating
        };
      }
      return produce;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navigation currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 px-4 sm:px-6 lg:px-8">
        {currentView === 'home' && <HomeView onNavigate={setCurrentView} />}
        {currentView === 'farmer' && <FarmerPortal onAddProduce={handleAddProduce} seeds={seedsList} />}
        {currentView === 'buyer' && <BuyerPortal produceList={produceList} onAddReview={handleAddReview} />}
        {currentView === 'transactions' && <TransactionsView />}
        {currentView === 'tracking' && <ShipmentTracking />}
        {currentView === 'admin' && <AdminPortal produceList={produceList} seedsList={seedsList} onAddProduce={handleAddProduce} onAddSeed={handleAddSeed} />}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} AgriTrade Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

