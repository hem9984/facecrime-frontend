// FaceCheck.ID Clone - TypeScript Version (Using React)
import React, { useState } from 'react';
import '../App.css';
import CameraModal from './CameraModal';
import Pica from 'pica';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, User, Shield, Database, Mail } from 'lucide-react';
interface CameraCaptureProps {
  onImageCapture: (image: string) => void;
}
interface FAQItem {
  question: string;
  answer: string;
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
  const [loading, setLoading] = useState(false); // <-- 1. Add loading state
  
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
      // setCapturedImage(resizedImageData); // This line is removed as per the edit hint
      onImageCapture(resizedImageData);
      await handleSearchClick(resizedImageData); // <-- Call search logic here
    } catch (error) {
      console.error('Error processing camera capture:', error);
      toast.error("Failed to process image.");
    }
  };

  // Refactor handleSearchClick to accept an image parameter
  const handleSearchClick = async (image?: string) => {
    const imageToUse = image || null; // Use null if no image is captured
    if (!imageToUse) {
      toast.error("Please capture or upload an image first");
      return;
    }
    setLoading(true);
    try {
      await onImageCapture(imageToUse);
      toast.success("Searching for matches...");
    } finally {
      setLoading(false);
    }
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
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "How does the facial similarity detection work?",
      answer: "Our service uses advanced computer vision algorithms powered by JIRA v1 technology to analyze facial features and compare them against reference images. The system extracts key facial landmarks and creates a mathematical representation to determine similarity scores."
    },
    {
      question: "What file formats are supported for image uploads?",
      answer: "We support common image formats including JPEG, PNG, and WebP. Images should be clear, well-lit, and show the face directly for best results. Maximum file size is 10MB per image."
    },
    {
      question: "How long does the analysis take?",
      answer: "Most facial similarity analyses are completed within 2-5 seconds. Processing time may vary depending on image quality and server load."
    },
    {
      question: "Can I use this service for commercial purposes?",
      answer: "Yes, we offer commercial licensing options. Please contact us for enterprise pricing and API access for bulk processing needs."
    },
    {
      question: "Is there a limit to how many comparisons I can make?",
      answer: "Free accounts include 10 comparisons per day. Premium plans offer unlimited comparisons with additional features like batch processing and API access."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        try {
          const imageDataUrl = e.target.result as string;
          const resizedImageData = await resizeImage(imageDataUrl);
          onImageCapture(resizedImageData);
          await handleSearchClick(resizedImageData);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error("Failed to process uploaded image.");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Do something with the file, e.g., upload or preview
      console.log('Selected file:', file);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">FaceCrime.<span className="highlight">io</span></div>
        <div className="nav-links" style={{ marginLeft: "2rem" }}>
          <a href="#faq">FAQ</a>
          <a href="#description-of-service">Description of Service</a>
          <a href="#accuracy-of-information">Accuracy of Information</a>
          <a href="#data-privacy">Data Privacy</a>
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

          {/* Hide the actual file input */}
          <input
            type="file"
            accept="image/*"
            id="image-upload"
            style={{ display: 'none' }}
            onChange={handleImageUpload} // You need to define this handler
          />
          {/* Label acts as a button */}
          <div>
            <input
              type="file"
              id="file-upload"
              style={{ display: 'none' }}
              onChange={handleFileChange} // <-- implement this handler
            />
            <button
              type="button"
              className="custom-browse-button"
              style={{ color: 'white', backgroundColor: '#F50057', border: 'none', padding: '8px 80px', borderRadius: '4px', cursor: 'pointer' }}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Browse...
            </button>
          </div>
          
        </div>
        {/* 4. Loading indicator */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner" />
            <p className="loading-message">Processing your image…</p>
          </div>
        )}
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
            <span className="blue-text"><CheckIcon /></span><p>Pictures</p>
          </div>
          <div className="category-item">
            <span className="blue-text"><CheckIcon /></span><p>Comparisons</p>
          </div>
          <div className="category-item">
            <span className="blue-text"><CheckIcon /></span><p>Matches</p>
          </div>
        </div>
        <button 
          className="search-button" 
          onClick={openCameraModal}
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
    {/* Hero Section */}
    <div className="text-center mb-16 context-after">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Facial Similarity Detection
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powered by JIRA v1 technology for accurate and reliable facial comparison analysis
          </p>
        </div>
        {/* Service Description */}
        <section id="description-of-service" className="mb-16 context-after">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              
              <h3 className="text-2xl font-semibold text-gray-900"><User className="w-6 h-6 text-indigo-600 mr-3" /> Description of Service</h3>
            </div>
            <div className="prose prose-lg text-gray-700">
              <p className="mb-4">
                FaceSimilarity Pro is a cutting-edge facial recognition and comparison service that leverages 
                the power of JIRA v1 algorithms to provide accurate similarity analysis between facial images.
              </p>
              <p className="mb-4">
                Our service is designed for various applications including identity verification, 
                duplicate detection, and research purposes. The system analyzes facial geometry, 
                feature positioning, and biometric markers to generate precise similarity scores.
              </p>
              <p>
                Whether you're working on security applications, organizing photo collections, 
                or conducting research, our platform provides reliable and fast facial comparison capabilities.
              </p>
            </div>
          </div>
        </section>

        {/* Accuracy Information */}
        <section id="accuracy-of-information" className="mb-16 context-after">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              
              <h3 className="text-2xl font-semibold text-gray-900"><Shield className="w-6 h-6 text-green-600 mr-3" /> Accuracy of Information</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">High Accuracy Standards</h4>
                <p>Our JIRA v1 powered system achieves 98.5% accuracy under optimal conditions with clear, front-facing images.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-800 mb-2">Optimal Conditions</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Well-lit, clear images</li>
                    <li>• Front-facing poses</li>
                    <li>• Minimal obstructions</li>
                    <li>• High resolution (min 300x300px)</li>
                  </ul>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h5 className="font-medium text-amber-800 mb-2">Factors Affecting Accuracy</h5>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Image quality and lighting</li>
                    <li>• Facial angle and pose</li>
                    <li>• Age differences between photos</li>
                    <li>• Facial hair or accessories</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">
                Results should be used as a reference tool. For critical applications, 
                we recommend human verification of results.
              </p>
            </div>
          </div>
        </section>

        {/* Data Privacy */}
        <section id="data-privacy" className="mb-16 context-after">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              
              <h3 className="text-2xl font-semibold text-gray-900"><Database className="w-6 h-6 text-purple-600 mr-3" /> Data Privacy</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Your Privacy is Our Priority</h4>
                <p>We are committed to protecting your personal data and maintaining the highest standards of privacy.</p>
              </div>
              <div className="grid gap-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h5 className="font-medium mb-2">Data Processing</h5>
                  <p className="text-sm">Images are processed in real-time and are not permanently stored on our servers unless explicitly requested for account features.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h5 className="font-medium mb-2">Encryption</h5>
                  <p className="text-sm">All data transmission uses industry-standard SSL/TLS encryption. Temporary processing data is encrypted at rest.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h5 className="font-medium mb-2">Data Retention</h5>
                  <p className="text-sm">Uploaded images are automatically deleted within 24 hours unless saved to your account. Account data is retained according to your subscription terms.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h5 className="font-medium mb-2">Compliance</h5>
                  <p className="text-sm">We comply with GDPR, CCPA, and other applicable data protection regulations. Users have full control over their data.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-16 context-after">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className={`
                      w-full flex justify-between items-center px-6 py-4 text-left
                      bg-gray-50 hover:bg-indigo-50 transition-colors
                      focus:outline-none focus:ring-2 focus:ring-indigo-200
                      rounded-t-lg
                    `}
                    style={{
                      borderBottom: openFAQ === index ? '1px solid #e5e7eb' : 'none',
                      fontWeight: 500,
                      fontSize: '1rem',
                      letterSpacing: '0.01em',
                    }}
                  >
                    <span className="text-gray-900">{item.question}</span>
                    <span
                      className={`transition-transform duration-200 ${openFAQ === index ? 'rotate-180' : ''}`}
                    >
                      {openFAQ === index ? (
                        <ChevronUp className="w-5 h-5 text-indigo-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-indigo-500" />
                      )}
                    </span>
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-4 bg-white">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>


    
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
