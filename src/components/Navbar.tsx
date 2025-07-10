// FaceCheck.ID Clone - TypeScript Version (Using React)
import React, { useState } from 'react';
import '../App.css';
import CameraModal from './CameraModal';
import Pica from 'pica';
import { toast } from 'sonner';
import { Button } from './ui/button';
import ReactDOM from 'react-dom';

interface CameraCaptureProps {
  onImageCapture: (image: string) => void;
}

// Create a simple check icon component
const CheckIcon: React.FC = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

const Navbar: React.FC<CameraCaptureProps> = ({ onImageCapture }) => {
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Initialize pica instance with Lanczos filter
  const pica = new Pica({
    features: ['js', 'wasm', 'ww'],
    alpha: true,
    unsharpAmount: 80,
    unsharpRadius: 0.6,
    unsharpThreshold: 2
  });
  
  const openCameraModal = () => {
    setShowCameraModal(true);
  };

  const closeCameraModal = () => {
    setShowCameraModal(false);
  };

  const handleCameraCapture = async (imageData: string) => {
    try {
      const resizedImageData = await resizeImage(imageData);
      setCapturedImage(resizedImageData);
      onImageCapture(resizedImageData);
    } catch (error) {
      console.error('Error processing camera capture:', error);
      toast.error("Failed to process image.");
    }
  };

  const handleSearchClick = () => {
    if (!capturedImage) {
      toast.error("Please capture or upload an image first");
      return;
    }
    
    // Trigger the facial recognition search
    onImageCapture(capturedImage);
    toast.success("Searching for matches...");
  };

  const resizeImage = async (imageDataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          // Create source canvas with image
          const sourceCanvas = document.createElement('canvas');
          sourceCanvas.width = img.width;
          sourceCanvas.height = img.height;
          const sourceCtx = sourceCanvas.getContext('2d');
          if (sourceCtx) {
            sourceCtx.drawImage(img, 0, 0);
          }
          
          // Create destination canvas with target size
          const destCanvas = document.createElement('canvas');
          destCanvas.width = 640;
          destCanvas.height = 640;
          
          // Resize image using pica with Lanczos3 filter
          await pica.resize(sourceCanvas, destCanvas, {
            filter: 'lanczos3'
          });
          
          // Get data URL from resized image
          const resizedImageDataUrl = destCanvas.toDataURL('image/jpeg', 1.0);
          resolve(resizedImageDataUrl);
        } catch (error) {
          console.error('Error resizing image:', error);
          // If resize fails, return original image
          resolve(imageDataUrl);
        }
      };
      
      img.onerror = () => {
        console.error('Error loading image');
        reject('Error loading image');
      };
      
      img.src = imageDataUrl;
    });
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">FaceCrime.<span className="highlight">io</span></div>
        <div className="nav-links">
          <a href="#">FAQ</a>
          <a href="#">Description of Service</a>
          <a href="#">Accuracy of Information</a>
          <a href="#">Data Privacy</a>
          <a href="#">Contact Info</a>
        </div>
      </nav>

      <main className="main-content">
        <img src="/images/logo.png" alt="Logo" className="logo-img" />
        <div
            className="upload-box"
            style={{ backgroundImage: 'url("/images/photo.png")' }}
        >
          <p className="browse-text-color">
            Drop photo(s) of the person you want to find
          </p>

          <button onClick={openCameraModal}> Browse...</button>
          
        </div>
        <div className="categories-wrapper">
          <div className="category-item">
            <span className="blue-text"><CheckIcon /></span><p>Social Media</p>
          </div>
          <div className="category-item">
            <span className="blue-text"><CheckIcon /></span><p>Sex Offenders</p>
          </div>
          <div className="category-item">
            <span className="blue-text"><CheckIcon /></span><p>Mugshots</p>
          </div>
          <div className="category-item">
            <span className="blue-text"><CheckIcon /></span><p>Scammers</p>
          </div>
          <div className="category-item">
            <span className="blue-text"><CheckIcon /></span><p>Videos</p>
          </div>
          <div className="category-item">
            <span className="blue-text"><CheckIcon /></span><p>News & Blogs</p>
          </div>
        </div>
        <button 
          className="search-button" 
          onClick={capturedImage ? handleSearchClick : openCameraModal}
        >
          Reveal the Truth
        </button>
      </main>
    <div className="context-after">
      
        <p><b>Accuracy of Information</b></p>
        <p>FaceCrime does not claim to have complete or comprehensive data on all
            individuals. The database used for matching is limited and may not contain current or accurate information.
            Any matches provided by the Service should be considered preliminary and subject to verification through official channels.
            WE EXPLICITLY DISCLAIM ANY RESPONSIBILITY FOR MISIDENTIFICATION OR FALSE MATCHES. Users must exercise due diligence and not rely solely on
            the Service for identification purposes.
        </p>
        <p><b>Data Privacy</b></p>
        <p>Images uploaded to the Service are processed for the sole purpose of providing the facial recognition service. We do not store
            uploaded images beyond the time necessary to process your request. However, we cannot guarantee the security of data transmitted over the Internet.
        </p>
        <p><b>Contact Information</b></p>
        <p> For any questions about these Terms please contact us.</p>
    </div>
      <footer className="footer">
        
        <p>Facecrime.io's facial recognition AI technology is scary good!</p>
        <p>— Anonymous User</p>
      </footer>
      {showCameraModal && (
        <CameraModal
          isOpen={showCameraModal}
          onClose={closeCameraModal}
          onCapture={handleCameraCapture}
        />
      )}
    </div>
  );
};

export default Navbar;
