import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { month: 'Jan', wheat: 230, tomatoes: 1.2, corn: 2.5 },
  { month: 'Feb', wheat: 235, tomatoes: 1.3, corn: 2.6 },
  { month: 'Mar', wheat: 245, tomatoes: 1.4, corn: 2.7 },
  { month: 'Apr', wheat: 255, tomatoes: 1.4, corn: 2.8 },
  { month: 'May', wheat: 260, tomatoes: 1.5, corn: 3.0 },
  { month: 'Jun', wheat: 250, tomatoes: 1.5, corn: 3.0 },
];

export function PriceTrendChart() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm mb-8">
      <div className="flex items-center mb-8">
        <div className="h-12 w-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mr-4">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Market Price Trends</h3>
          <p className="text-sm text-gray-500 mt-1">Historical pricing (USD) for top commodities over the last 6 months</p>
        </div>
      </div>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} 
              dy={10} 
            />
            <YAxis 
              yAxisId="left" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} 
              dx={-10}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} 
              dx={10}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '0.75rem', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ fontWeight: 600 }}
            />
            <Legend 
              iconType="circle" 
              wrapperStyle={{ paddingTop: '24px', fontSize: '14px', fontWeight: 500 }} 
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              name="Wheat (per Ton)" 
              dataKey="wheat" 
              stroke="#d97706" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2 }} 
              activeDot={{ r: 6, strokeWidth: 0 }} 
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              name="Tomatoes (per kg)" 
              dataKey="tomatoes" 
              stroke="#dc2626" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2 }} 
              activeDot={{ r: 6, strokeWidth: 0 }} 
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              name="Sweet Corn (per Dozen)" 
              dataKey="corn" 
              stroke="#eab308" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2 }} 
              activeDot={{ r: 6, strokeWidth: 0 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
