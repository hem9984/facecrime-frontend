
import React, { useState } from 'react';
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
              [REDACTED] FACIAL RECOGNITION SYSTEM | SECURITY LEVEL: ALPHA
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <CameraCapture onImageCapture={handleImageCapture} />
              
              {isProcessing && (
                <div className="flex justify-center mt-4">
                  <div className="flex items-center gap-2 bg-fbi-navy/10 text-fbi-navy px-4 py-2 rounded">
                    <div className="w-5 h-5 border-2 border-fbi-navy border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing recognition request...</span>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <RecognitionResult 
                subject={recognitionResult}
                isLoading={isProcessing} 
              />
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              FACECRIME RECON PORTAL | CONFIDENTIAL
            </p>
            <p className="text-xs text-gray-400 mt-1">
              UNAUTHORIZED ACCESS WIll BE PUNISHED
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
