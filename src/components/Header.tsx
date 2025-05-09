
import React from 'react';
import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-fbi-navy text-white py-3 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-fbi-gold" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">FACECRIME</h1>
            <p className="text-xs text-fbi-gold">FACIAL RECOGNITION PORTAL</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="hidden md:block text-right">
            <p className="text-sm">SECURITY CLEARANCE</p>
            <p className="text-xs text-fbi-gold">PRIVATE SECTOR</p>
          </div>
          <div className="w-3 h-3 bg-fbi-red rounded-full ml-3 animate-pulse-red"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
