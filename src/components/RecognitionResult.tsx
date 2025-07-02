import React from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { RecognitionResult as RecognitionData } from '@/services/recognitionApi';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { User, Calendar, Venus, MapPin, Home, Shield } from 'lucide-react';
import '../index.css';

interface RecognitionResultProps {
  subject: RecognitionData | null;
  isLoading: boolean;
  onBack?: () => void;
}

const RecognitionResult: React.FC<RecognitionResultProps> = ({ subject, isLoading, onBack }) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="fbi-panel custom-fbi-panel">
        <div className="custom-spinner"></div>
        <p className="custom-analyzing-text">ANALYZING FACIAL FEATURES...</p>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="fbi-panel empty-result">
        <h2 className="result-heading">
          <span className="indicator"></span> 
          Recognition Results
        </h2>
        <div className="placeholder-image"></div>
      </div>
    );
  }

  const matchPercentFormatted = Math.round(subject.matchPercent * 100);

  const getMatchStatus = () => {
    if (matchPercentFormatted >= 75) {
      return { text: 'MATCH', className: 'match' };
    } else if (matchPercentFormatted >= 35) {
      return { text: 'REVIEW DETAILS TO CONFIRM MATCH', className: 'review' };
    } else {
      return { text: 'NOT A MATCH', className: 'no-match' };
    }
  };

  const matchStatus = getMatchStatus();
  const hasValidImage = subject.imageBase64 && subject.imageBase64.length > 0;

  return (
    <div className="fbi-panel recognition-result">
      <div className="result-header">
        {onBack && (
          <button 
            onClick={onBack}
            className="back-button"
            aria-label="Go back to home"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        )}
        <h2 className="result-heading">
          <span className="indicator"></span> 
          Recognition Results
        </h2>
      </div>

      <div className={`match-status ${matchStatus.className}`}>
        {matchStatus.text} - {matchPercentFormatted}% MATCH
      </div>

      <div className="image-container">
        {hasValidImage ? (
          <img 
            src={subject.imageBase64.startsWith('data:image') ? subject.imageBase64 : `data:image/jpeg;base64,${subject.imageBase64}`}
            alt="Subject" 
            className="subject-image"
          />
        ) : (
          <div className="no-image">
            <p className="no-image-text">No subject image available</p>
          </div>
        )}
      </div>

      <div className="details-section">
        <div className="overlay-warning">
          <div className="warning-message">
            Use of information from this website to harass an individual is a criminal offense
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-group">
            <div className="detail-item">
              <User className="icon" /><strong>Name:</strong><span>{subject.fullName || 'REDACTED'}</span>
            </div>
            <div className="detail-item">
              <Calendar className="icon" /><strong>DOB:</strong><span>{subject.dob}</span>
            </div>
            <div className="detail-item">
              <Venus className="icon" /><strong>Gender:</strong><span>{subject.gender}</span>
            </div>
            <div className="detail-item">
              <MapPin className="icon" /><strong>Location:</strong><span>{subject.location}</span>
            </div>
          </div>
          <div className="detail-group">
            <div className="detail-item">
              <Home className="icon" /><strong>Address:</strong>
              <span>
                {subject.streetAddress !== 'Unknown' ? subject.streetAddress : 'No address available'}<br />
                {subject.city !== 'Unknown' && `${subject.city}, `}{subject.state !== 'Unknown' && subject.state} {subject.zipCode !== 'Unknown' && subject.zipCode}<br />
                {subject.county !== 'Unknown' && `${subject.county} County`}
              </span>
            </div>
            <div className="detail-item">
              <Shield className="icon" /><strong>Status:</strong>
              <span>
                {subject.absconder ? (
                  <span className="status-alert">ON THE RUN</span>
                ) : (
                  <span className="status-ok">Not on the Run</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {subject.offenderUri && (
          <div className="criminal-record">
            <h3 className="record-title">
              <ExternalLink size={18} className="icon" /> Criminal Record
            </h3>
            <a 
              href={subject.offenderUri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="record-link"
            >
              View Official Criminal Record
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecognitionResult;
