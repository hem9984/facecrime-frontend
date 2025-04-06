
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Subject {
  image: string;
  offense: string;
  height: string;
  weight: string;
  hairColor: string;
  eyeColor: string;
  race: string;
  sexOffender: boolean;
  matchPercent: number;
}

interface RecognitionResultProps {
  subject: Subject | null;
  isLoading: boolean;
}

const RecognitionResult: React.FC<RecognitionResultProps> = ({ subject, isLoading }) => {
  const isMobile = useIsMobile();
  
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
      <div className="fbi-panel h-full min-h-[250px]">
        <h2 className="text-lg font-semibold mb-3 text-fbi-navy flex items-center">
          <span className="w-2 h-6 bg-fbi-red mr-2"></span> 
          Recognition Results
        </h2>
        
        <div className="w-full h-[250px] bg-white border border-gray-300"></div>
      </div>
    );
  }

  // Round the match percentage to whole number
  const matchPercentFormatted = Math.round(subject.matchPercent * 100);
  
  // Check if we have a valid image from the API
  const hasValidImage = subject.image && subject.image.length > 0;

  return (
    <div className="fbi-panel relative">
      <h2 className="text-lg font-semibold mb-3 text-fbi-navy flex items-center">
        <span className="w-2 h-6 bg-fbi-red mr-2"></span> 
        Recognition Results
      </h2>
      
      <div className="relative mb-4">
        <div className="absolute top-4 left-4 py-1 px-3 bg-fbi-red/90 text-white text-xs tracking-wider">
          {hasValidImage ? "MATCH FOUND" : "NO IMAGE AVAILABLE"}
        </div>
        <div className="absolute top-4 right-4 py-1 px-3 bg-fbi-navy/90 text-white text-xs tracking-wider">
          {matchPercentFormatted}% MATCH
        </div>
        {hasValidImage ? (
          <img 
            src={subject.image.startsWith('data:image') ? subject.image : `data:image/jpeg;base64,${subject.image}`}
            alt="Subject" 
            className="w-full h-[250px] object-cover object-center border border-gray-300"
          />
        ) : (
          <div className="w-full h-[250px] bg-fbi-lightgray border border-gray-300 flex items-center justify-center">
            <p className="text-fbi-gray">No subject image available</p>
          </div>
        )}
      </div>

      <div className="space-y-3 relative">
        <div className="absolute -rotate-12 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
          <div className="classified-stamp">Classified</div>
        </div>
        
        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-gray-200 pb-2">
          <div className="font-semibold text-fbi-gray">Name:</div>
          <div className="font-mono">REDACTED</div>
        </div>
        
        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-gray-200 pb-2">
          <div className="font-semibold text-fbi-gray">Offense:</div>
          <div className="font-mono text-red-600">{subject.offense}</div>
        </div>

        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-gray-200 pb-2">
          <div className="font-semibold text-fbi-gray">Sex Offender:</div>
          <div className="font-mono">
            {subject.sexOffender ? 
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-bold">REGISTERED</span> : 
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Not Registered</span>
            }
          </div>
        </div>

        {isMobile ? (
          // Mobile layout - stack all physical details vertically
          <div className="border-b border-gray-200 py-2 space-y-2">
            <div className="grid grid-cols-[110px_1fr] gap-1">
              <div className="font-semibold text-fbi-gray">Height:</div>
              <div className="font-mono">{subject.height}</div>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-1">
              <div className="font-semibold text-fbi-gray">Weight:</div>
              <div className="font-mono">{subject.weight}</div>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-1">
              <div className="font-semibold text-fbi-gray">Hair:</div>
              <div className="font-mono">{subject.hairColor}</div>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-1">
              <div className="font-semibold text-fbi-gray">Eyes:</div>
              <div className="font-mono">{subject.eyeColor}</div>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-1">
              <div className="font-semibold text-fbi-gray">Race:</div>
              <div className="font-mono">{subject.race}</div>
            </div>
          </div>
        ) : (
          // Desktop layout - 2 columns
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-gray-200 py-2">
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <div className="font-semibold text-fbi-gray">Height:</div>
              <div className="font-mono">{subject.height}</div>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <div className="font-semibold text-fbi-gray">Weight:</div>
              <div className="font-mono">{subject.weight}</div>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <div className="font-semibold text-fbi-gray">Hair:</div>
              <div className="font-mono">{subject.hairColor}</div>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <div className="font-semibold text-fbi-gray">Eyes:</div>
              <div className="font-mono">{subject.eyeColor}</div>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <div className="font-semibold text-fbi-gray">Race:</div>
              <div className="font-mono">{subject.race}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecognitionResult;
