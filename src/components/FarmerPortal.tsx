import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { Package, PlusCircle, ShoppingBag, ImagePlus } from 'lucide-react';
import { StarRating } from './StarRating';
import { SeasonalPlantingGuide } from './SeasonalPlantingGuide';

interface FarmerPortalProps {
  onAddProduce: (product: Product) => void;
  seeds: Product[];
}

export function FarmerPortal({ onAddProduce, seeds }: FarmerPortalProps) {
  const [activeTab, setActiveTab] = useState<'sell' | 'buy'>('sell');

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Farmer Portal</h2>
          <p className="text-gray-600 mt-1">Manage your produce listings and purchase high-quality seeds.</p>
        </div>
      </div>

      <SeasonalPlantingGuide />

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('sell')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'sell'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="h-5 w-5 mr-2" />
            Sell Produce
          </button>
          <button
            onClick={() => setActiveTab('buy')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'buy'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Buy Seeds
          </button>
        </nav>
      </div>

      {activeTab === 'sell' && <SellProduceForm onAddProduce={onAddProduce} />}
      {activeTab === 'buy' && <BuySeedsCatalog seeds={seeds} />}
    </div>
  );
}

function SellProduceForm({ onAddProduce }: { onAddProduce: (p: Product) => void }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quantity || !price) return;
    
    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name,
      category: 'produce',
      pricePerUnit: Number(price),
      unit,
      stock: Number(quantity),
      description,
      // Provide a default image if none uploaded
      imageUrl: imagePreview || 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=400',
    };
    
    onAddProduce(newProduct);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-2xl">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <PlusCircle className="h-5 w-5 mr-2 text-green-600" /> List New Produce
      </h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Produce Image</label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${imagePreview ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-32 object-contain rounded" />
            ) : (
              <>
                <ImagePlus className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload product picture</span>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Produce Name</label>
          <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500" placeholder="e.g. Organic Potatoes" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input required value={quantity} onChange={e => setQuantity(e.target.value)} type="number" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500" placeholder="e.g. 100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500">
              <option>kg</option>
              <option>Ton</option>
              <option>Boxes</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Price per Unit ($)</label>
          <input required value={price} onChange={e => setPrice(e.target.value)} type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500" placeholder="e.g. 2.50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500" rows={3} placeholder="Describe the quality and harvest date..."></textarea>
        </div>
        <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-2.5 rounded-lg transition-colors">
          Submit Listing to Platform
        </button>
      </form>
    </div>
  );
}

function BuySeedsCatalog({ seeds }: { seeds: Product[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {seeds.map((seed) => (
        <div key={seed.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="h-48 w-full bg-gray-200">
            <img src={seed.imageUrl} alt={seed.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900">{seed.name}</h3>
            <div className="mt-1 mb-3">
              <StarRating rating={seed.rating || 4.0} reviewCount={seed.reviewCount} />
            </div>
            <p className="text-sm text-gray-500 mb-4 flex-1">{seed.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-green-700">${seed.pricePerUnit}</span>
              <span className="text-sm text-gray-500">per {seed.unit}</span>
            </div>
            <button className="w-full bg-green-100 text-green-700 hover:bg-green-200 font-medium py-2 rounded-lg transition-colors">
              Purchase Seeds
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
