import React from 'react';
import { Sprout, Tractor, ShoppingCart, Truck, Home, DollarSign, LogIn, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../AuthContext';

export type ViewState = 'home' | 'farmer' | 'buyer' | 'tracking' | 'transactions' | 'admin';

interface NavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const { user, signIn, logOut } = useAuth();
  const isAdmin = user?.email === 'vinodrathod5931@gmail.com';
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'farmer', label: 'Farmer Portal', icon: Tractor },
    { id: 'buyer', label: 'Buyer Portal', icon: ShoppingCart },
    { id: 'transactions', label: 'Transactions', icon: DollarSign },
    { id: 'tracking', label: 'Shipment Tracking', icon: Truck },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Shield }] : []),
  ] as const;

  return (
    <nav className="bg-green-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <Sprout className="h-8 w-8 text-green-300" />
            <span className="font-bold text-xl tracking-tight">AgriTrade</span>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-green-900 text-white'
                    : 'text-green-100 hover:bg-green-700 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </button>
            ))}
            
            <div className="ml-4 pl-4 border-l border-green-700 flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-green-100 hidden lg:block">
                    {user.displayName || user.email}
                  </span>
                  <button
                    onClick={logOut}
                    className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-green-100 bg-green-700 hover:bg-green-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={signIn}
                  className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-green-800 bg-white hover:bg-green-100 transition-colors shadow-sm"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
