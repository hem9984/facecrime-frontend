
import React from 'react';
import { ShieldCheck, AlignJustify} from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-fbi-navy text-white py-3 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlignJustify className="w-8 h-8"/>
          <div>
            <h1 className="text-xl font-bold tracking-tight">FACECRIME</h1>
            <p className="text-xs text-fbi-gold">Know who you're really talking to.</p>
          </div>
        </div>
        <div className="flex items-center">
          <ShieldCheck className="h-8 w-8 text-fbi-gold" />
        </div>
      </div>
    </header>
  );
};

export default Header;
