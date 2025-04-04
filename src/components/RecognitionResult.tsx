
import React from 'react';

interface Subject {
  name: string;
  image: string;
  location: string;
  bio: string;
}

interface RecognitionResultProps {
  subject: Subject | null;
  isLoading: boolean;
}

const RecognitionResult: React.FC<RecognitionResultProps> = ({ subject, isLoading }) => {
  if (isLoading) {
    return (
      <div className="fbi-panel h-full min-h-[250px] flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-fbi-navy border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-fbi-navy font-medium tracking-wide">ANALYZING FACIAL FEATURES...</p>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="fbi-panel h-full min-h-[250px] flex items-center justify-center">
        <p className="text-fbi-gray italic">No recognition data available</p>
      </div>
    );
  }

  return (
    <div className="fbi-panel relative">
      <h2 className="text-lg font-semibold mb-3 text-fbi-navy flex items-center">
        <span className="w-2 h-6 bg-fbi-red mr-2"></span> 
        Recognition Results
      </h2>
      
      <div className="relative mb-4">
        <div className="absolute top-4 left-4 py-1 px-3 bg-fbi-red/90 text-white text-xs tracking-wider">
          MATCH FOUND
        </div>
        <img 
          src={subject.image} 
          alt={subject.name} 
          className="w-full h-[250px] object-cover object-center border border-gray-300"
        />
      </div>

      <div className="space-y-3 relative">
        <div className="absolute -rotate-12 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
          <div className="classified-stamp">Classified</div>
        </div>
        
        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-gray-200 pb-2">
          <div className="font-semibold text-fbi-gray">Name:</div>
          <div className="font-mono">{subject.name}</div>
        </div>
        
        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-gray-200 pb-2">
          <div className="font-semibold text-fbi-gray">Location:</div>
          <div className="font-mono">{subject.location}</div>
        </div>
        
        <div className="grid grid-cols-[120px_1fr] gap-2 pt-1">
          <div className="font-semibold text-fbi-gray">Bio:</div>
          <div className="font-mono text-sm">{subject.bio}</div>
        </div>
      </div>
    </div>
  );
};

export default RecognitionResult;
