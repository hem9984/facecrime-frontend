import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { toast } from 'sonner';
import { recognizeFace, RecognitionResult as RecognitionData } from './services/recognitionApi';
import RecognitionResult from './components/RecognitionResult';

const App: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionData | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleImageCapture = async (image: string) => {
    console.log("Captured image:", image); // <-- Add this line
    setRecognitionResult(null);
    setShowResult(false);
    setCapturedImage(image); // Store the captured image
    
    // Automatically submit for recognition
    try {
      setIsProcessing(true);
      
      // Extract base64 string from data URL if needed
      const base64Image = image.split(',')[1] || image;
      
      const result = await recognizeFace(base64Image);
      setRecognitionResult(result);
      setShowResult(true);
      toast.success("Recognition complete.");
    } catch (error) {
      console.error("Recognition error:", error);
      toast.error("Recognition failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    setShowResult(false);
    setRecognitionResult(null);
    setCapturedImage(null); // Clear captured image on back
  };

  return !showResult ? (
    <Navbar onImageCapture={handleImageCapture} />
  ) : (
    <RecognitionResult 
      subject={recognitionResult} 
      isLoading={isProcessing} 
      onBack={handleBack}
      originalPhotoUrl={capturedImage}
    />
  );
};

export default App;
