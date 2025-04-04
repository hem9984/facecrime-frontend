
import React, { useState } from 'react';
import Header from '@/components/Header';
import CameraCapture from '@/components/CameraCapture';
import RecognitionResult from '@/components/RecognitionResult';
import { Button } from '@/components/ui/button';
import { recognizeFace } from '@/services/recognitionApi';
import { toast } from 'sonner';

const Index = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<{
    name: string;
    image: string;
    location: string;
    bio: string;
  } | null>(null);

  const handleImageCapture = (image: string) => {
    setCapturedImage(image);
    setRecognitionResult(null);
  };

  const handleSubmit = async () => {
    if (!capturedImage) {
      toast.error("Please capture or upload an image first.");
      return;
    }

    try {
      setIsProcessing(true);
      const result = await recognizeFace(capturedImage);
      setRecognitionResult(result);
      toast.success("Recognition complete.");
    } catch (error) {
      console.error("Recognition error:", error);
      toast.error("Recognition failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

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
              
              <div className="flex justify-center">
                <Button 
                  className="official-btn text-lg py-4 px-8 w-full sm:w-auto"
                  onClick={handleSubmit}
                  disabled={!capturedImage || isProcessing}
                >
                  {isProcessing ? "Processing..." : "Submit for Recognition"}
                </Button>
              </div>
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
              UNAUTHORIZED ACCESS IS A VIOLATION OF FEDERAL LAW
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
