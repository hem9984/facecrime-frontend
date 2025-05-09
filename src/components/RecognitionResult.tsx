
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RecognitionResult as RecognitionData } from '@/services/recognitionApi';
import { ExternalLink } from 'lucide-react';

interface RecognitionResultProps {
  subject: RecognitionData | null;
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
  
  // Determine match status based on match percentage
  const getMatchStatus = () => {
    if (matchPercentFormatted >= 75) {
      return { text: 'MATCH', color: 'bg-green-600', textColor: 'text-white' };
    } else if (matchPercentFormatted >= 35) {
      return { text: 'REVIEW DETAILS TO CONFIRM MATCH', color: 'bg-yellow-500', textColor: 'text-black' };
    } else {
      return { text: 'NOT A MATCH', color: 'bg-red-600', textColor: 'text-white' };
    }
  };
  
  const matchStatus = getMatchStatus();
  
  // Check if we have a valid image from the API
  const hasValidImage = subject.imageBase64 && subject.imageBase64.length > 0;

  return (
    <div className="fbi-panel relative">
      <h2 className="text-lg font-semibold mb-3 text-fbi-navy flex items-center">
        <span className="w-2 h-6 bg-fbi-red mr-2"></span> 
        Recognition Results
      </h2>
      
      {/* Match status banner */}
      <div className={`w-full ${matchStatus.color} ${matchStatus.textColor} text-center py-2 font-bold mb-2`}>
        {matchStatus.text} - {matchPercentFormatted}% MATCH
      </div>
      
      <div className="relative mb-4">
        {hasValidImage ? (
          <img 
            src={subject.imageBase64.startsWith('data:image') ? subject.imageBase64 : `data:image/jpeg;base64,${subject.imageBase64}`}
            alt="Subject" 
            className="w-full h-[250px] object-contain object-center border border-gray-300"
          />
        ) : (
          <div className="w-full h-[250px] bg-fbi-lightgray border border-gray-300 flex items-center justify-center">
            <p className="text-fbi-gray">No subject image available</p>
          </div>
        )}
      </div>

      <div className="space-y-3 relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none w-full h-full z-0">
          <div className="w-full h-full flex items-center justify-center">
            <div className="border border-red-200 bg-transparent p-6 -rotate-12 opacity-40">
              <div className="text-center text-red-500 text-sm mt-2 leading-tight">
                Use of information from this website to harass an individual is a criminal offense
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-gray-200 pb-2">
          <div className="font-semibold text-fbi-gray">Name:</div>
          <div className="font-mono">{subject.fullName || 'REDACTED'}</div>
        </div>
        
        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-gray-200 pb-2">
          <div className="font-semibold text-fbi-gray">DOB:</div>
          <div className="font-mono">{subject.dob}</div>
        </div>
        
        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-gray-200 pb-2">
          <div className="font-semibold text-fbi-gray">Gender:</div>
          <div className="font-mono">{subject.gender}</div>
        </div>

        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-gray-200 pb-2">
          <div className="font-semibold text-fbi-gray">Location:</div>
          <div className="font-mono">{subject.location}</div>
        </div>
        
        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-gray-200 pb-2">
          <div className="font-semibold text-fbi-gray">Address:</div>
          <div className="font-mono">
            {subject.streetAddress !== 'Unknown' ? subject.streetAddress : 'No address available'}<br/>
            {subject.city !== 'Unknown' && `${subject.city}, `}{subject.state !== 'Unknown' && subject.state} {subject.zipCode !== 'Unknown' && subject.zipCode}<br/>
            {subject.county !== 'Unknown' && `${subject.county} County`}
          </div>
        </div>

        <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-gray-200 pb-2">
          <div className="font-semibold text-fbi-gray">Status:</div>
          <div className="font-mono">
            {subject.absconder ? (
              <span className="flex items-center gap-2">
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-bold">ON THE RUN</span>
                <svg className="text-red-600 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Not on the Run</span>
            )}
          </div>
        </div>
        
        {/* Links section */}
        {subject.offenderUri && (
          <div className="border-t border-gray-200 pt-3 mt-3">
            <h3 className="text-sm font-semibold mb-2 text-fbi-navy">Criminal Record</h3>
            <div className="space-y-2">
              <a 
                href={subject.offenderUri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-fbi-navy text-white py-2 px-4 rounded flex items-center justify-center gap-2 hover:bg-fbi-navy/90 transition-colors"
              >
                <ExternalLink size={16} />
                <span>View Official Criminal Record</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecognitionResult;
