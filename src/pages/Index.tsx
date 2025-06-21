
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import CameraCapture from '@/components/CameraCapture';
import RecognitionResult from '@/components/RecognitionResult';
import { Button } from '@/components/ui/button';
import { recognizeFace, RecognitionResult as RecognitionData } from '@/services/recognitionApi';
import { toast } from 'sonner';

const Index = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionData | null>(null);

  const handleImageCapture = async (image: string) => {
    setCapturedImage(image);
    setRecognitionResult(null);
    
    // Automatically submit for recognition
    try {
      setIsProcessing(true);
      
      // Extract base64 string from data URL if needed
      const base64Image = image.split(',')[1] || image;
      
      const result = await recognizeFace(base64Image);
      setRecognitionResult(result);
      toast.success("Recognition complete.");
    } catch (error) {
      console.error("Recognition error:", error);
      toast.error("Recognition failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Recognition is now automatically triggered when an image is captured

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-fbi-navy p-3 mb-6">
            <h2 className="text-white text-sm md:text-base tracking-wide text-center font-mono">
              FACIAL RECOGNITION SYSTEM | SECURITY LEVEL: Private Sector
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
            <div className="fbi-panel relative">
              <h2 className="font-semibold text-lg text-blue-900 mb-2">
                Check if someone is on a sex offender registry—just using their photo.
              </h2>
              <p className="text-sm text-gray-700">
                No names, no guesswork. Because 64% of offenders lie about who{' '}
                <a href="#" className="text-blue-700 underline">they are</a>.
              </p>
            </div>
              <CameraCapture onImageCapture={handleImageCapture} />
              
              {isProcessing && (
                <div className="flex justify-center mt-4">
                  <div className="flex items-center gap-2 bg-fbi-navy/10 text-fbi-navy px-4 py-2 rounded">
                    <div className="w-5 h-5 border-2 border-fbi-navy border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing recognition request...</span>
                  </div>
                </div>
              )}
              <RecognitionResult 
                subject={recognitionResult}
                isLoading={isProcessing} 
              />
            </div>
            
            <div>
              <div className="fbi-panel relative mb-[24px]">
                <h2 className="font-bold text-lg text-black-700 mb-2">
                  Description of Service
                </h2>
              </div>
              <div className="fbi-panel relative mb-[24px]">
                <h2 className="font-bold text-lg text-black-700 mb-2">
                  Accuracy of Information
                </h2>
              </div>
              <div className="fbi-panel relative mb-[24px]">
                <h2 className="font-bold text-lg text-black-700 mb-2">
                  Data Privacy
                </h2>
              </div>
              <div className="fbi-panel relative mb-[32px]">
                <h2 className="font-bold text-lg text-black-700 mb-2">
                  Contact Information
                </h2>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              FACECRIME RECON PORTAL | PUBLIC DOMAIN
            </p>
            <p className="text-xs text-gray-400 mt-1">
              USE OF INFORMATION FROM THIS WEBSITE TO HARASS AN INDIVIDUAL IS A CRIMINAL OFFENSE
            </p>
          </div>
        </div>
      </main>
      
      <footer className="py-4 mt-auto border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">© 2025 FaceCrime. All rights reserved.</p>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-fbi-navy hover:underline transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
