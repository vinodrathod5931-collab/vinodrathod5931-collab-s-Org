import React, { useState } from 'react';
import { Calendar, Map, Leaf, Sprout } from 'lucide-react';

const regions = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West', 'Central'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Simplified mock data for seasonal planting based on region and month
const plantingGuideData: Record<string, Record<string, { crop: string; notes: string }[]>> = {
  'West': {
    'September': [
      { crop: 'Garlic', notes: 'Plant cloves before the first frost.' },
      { crop: 'Winter Wheat', notes: 'Ideal for cover crop or spring harvest.' },
      { crop: 'Spinach', notes: 'Sow now for late fall or winter harvesting.' },
      { crop: 'Radishes', notes: 'Fast-growing, perfect for cooler weather.' }
    ],
    'October': [
      { crop: 'Fava Beans', notes: 'Great as a winter cover crop.' },
      { crop: 'Onions', notes: 'Overwintering varieties work best.' }
    ]
  },
  'Midwest': {
    'September': [
      { crop: 'Cover Crops (Clover)', notes: 'Protect soil during harsh winters.' },
      { crop: 'Lettuce', notes: 'Requires row covers if frost approaches early.' }
    ]
  },
  'Southeast': {
    'September': [
      { crop: 'Broccoli', notes: 'Thrives in the cooling southern autumn.' },
      { crop: 'Carrots', notes: 'Sow seeds directly into loose soil.' },
      { crop: 'Kale', notes: 'Sweetens after the first light frost.' }
    ]
  },
  // Fallback default for other combinations to ensure UI always shows something
  'default': [
    { crop: 'Lettuce', notes: 'A versatile crop for mild temperatures.' },
    { crop: 'Radishes', notes: 'Quick harvest cycle, easy to grow.' },
    { crop: 'Cover Crops', notes: 'Good for soil health in off-seasons.' }
  ]
};

export function SeasonalPlantingGuide() {
  const currentMonthIndex = new Date().getMonth();
  
  const [selectedRegion, setSelectedRegion] = useState('West');
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);

  const getRecommendations = () => {
    const regionData = plantingGuideData[selectedRegion];
    if (regionData && regionData[selectedMonth]) {
      return regionData[selectedMonth];
    }
    // Fallback if we don't have specific mock data mapped
    return plantingGuideData['default'];
  };

  const recommendations = getRecommendations();

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden mb-8">
      <div className="bg-emerald-50 px-6 py-5 border-b border-emerald-100">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mr-3">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Seasonal Planting Guide</h3>
            <p className="text-sm text-emerald-700 font-medium">Optimal seed recommendations by region and month</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Map className="h-4 w-4 mr-1 text-gray-400" /> Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-2 px-3 border"
            >
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-400" /> Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-2 px-3 border"
            >
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((item, idx) => (
            <div key={idx} className="border border-emerald-100 bg-emerald-50/30 rounded-xl p-4 hover:bg-emerald-50 transition-colors">
              <div className="flex items-start">
                <Leaf className="h-5 w-5 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900">{item.crop}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
