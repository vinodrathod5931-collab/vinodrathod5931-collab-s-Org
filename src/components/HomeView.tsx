import React from 'react';
import { ArrowRight, Leaf, ShieldCheck, Truck, Star, Users } from 'lucide-react';
import { ViewState } from './Navigation';

interface HomeViewProps {
  onNavigate: (view: ViewState) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section with Background Image */}
      <section className="relative rounded-3xl overflow-hidden mt-6 shadow-xl">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" 
            alt="Farming landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40"></div>
        </div>
        
        <div className="relative px-6 py-24 sm:py-32 lg:px-16 flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="inline-flex items-center rounded-full px-4 py-1.5 bg-green-500/20 border border-green-400/30 text-green-300 font-medium text-sm mb-6 backdrop-blur-sm">
            <Star className="h-4 w-4 mr-2 fill-green-400 text-green-400" /> Top Rated Agricultural Network
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
            Smarter Trade for <br/>
            <span className="text-green-400">Better Harvests</span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl leading-relaxed">
            The premium intermediary platform where quality meets transparency. Farmers grow and sell, buyers source the best, and we handle the trust and tracking.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('farmer')}
              className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-green-900/50 flex items-center justify-center"
            >
              I am a Farmer <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => onNavigate('buyer')}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-gray-900 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-amber-900/50 flex items-center justify-center"
            >
              I am a Buyer <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
        {[
          { label: 'Verified Farmers', value: '12,000+' },
          { label: 'Tons of Produce', value: '500k+' },
          { label: 'Happy Buyers', value: '8,500+' },
          { label: 'Average Rating', value: '4.8/5.0' },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why choose AgriTrade?</h2>
          <p className="mt-4 text-lg text-gray-600">Built to solve the real problems of modern agricultural commerce.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="h-14 w-14 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Leaf className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Resources</h3>
            <p className="text-gray-600 leading-relaxed">Access a wide variety of high-yield, top-rated seeds. Verified farmer ratings ensure you plant only the best.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="h-14 w-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Intermediary</h3>
            <p className="text-gray-600 leading-relaxed">We stand in the middle. Payments and quality are guaranteed, allowing farmers and buyers to trade with absolute confidence.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="h-14 w-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Truck className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Live Tracking</h3>
            <p className="text-gray-600 leading-relaxed">Integrated logistics provide step-by-step visibility. Always know exactly where your produce or seeds are in transit.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
