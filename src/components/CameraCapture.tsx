
import React, { useRef, useState } from 'react';
import { Camera, Upload, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CameraModal from './CameraModal';
import Pica from 'pica';
import { removeBackground } from '@imgly/background-removal';
import { Loader2 } from 'lucide-react';

interface CameraCaptureProps {
  onImageCapture: (image: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Initialize pica instance with Lanczos filter
  const pica = new Pica({
    features: ['js', 'wasm', 'ww'],
    alpha: true,
    unsharpAmount: 80,
    unsharpRadius: 0.6,
    unsharpThreshold: 2
  });
  
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
          destCanvas.width = 224;
          destCanvas.height = 224;
          
          // Resize image using pica with Lanczos3 filter
          await pica.resize(sourceCanvas, destCanvas, {
            filter: 'lanczos3'
          });
          
          // Get data URL from resized image
          const resizedImageDataUrl = destCanvas.toDataURL('image/jpeg', 0.9);
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

  const processWithBackgroundRemoval = async (imageDataUrl: string): Promise<string> => {
    try {
      setIsProcessing(true);
      toast.info("Removing background, please wait...");

      // Create an image element from the data URL
      const img = new Image();
      const loadPromise = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = imageDataUrl;
      });
      await loadPromise;

      // Use the removeBackground function from the library
      const blob = await removeBackground(img, {
        output: {
          format: 'image/png',
          quality: 0.8,
        },
      });

      // Convert blob to data URL
      const resultDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      return resultDataUrl;
    } catch (error) {
      console.error('Background removal failed:', error);
      toast.error("Background removal failed. Using original image.");
      return imageDataUrl;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      if (!file.type.match('image.*')) {
        toast.error("Please select an image file.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          try {
            setIsProcessing(true);
            const imageDataUrl = e.target.result.toString();
            
            // First remove background
            const bgRemovedImageUrl = await processWithBackgroundRemoval(imageDataUrl);
            
            // Display the background-removed image directly
            setCapturedImage(bgRemovedImageUrl);
            
            // Then resize for API submission
            const resizedImageDataUrl = await resizeImage(bgRemovedImageUrl);
            onImageCapture(resizedImageDataUrl);
          } catch (error) {
            console.error('Error processing image:', error);
            toast.error("Failed to process image.");
          } finally {
            setIsProcessing(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const resetCapture = () => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCameraCapture = async (imageData: string) => {
    try {
      setIsProcessing(true);
      // First remove background
      const bgRemovedImageUrl = await processWithBackgroundRemoval(imageData);
      
      // Display the background-removed image directly
      setCapturedImage(bgRemovedImageUrl);
      
      // Then resize for API submission
      const resizedImageDataUrl = await resizeImage(bgRemovedImageUrl);
      onImageCapture(resizedImageDataUrl);
    } catch (error) {
      console.error('Error processing camera capture:', error);
      toast.error("Failed to process image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const openCameraModal = () => {
    setShowCameraModal(true);
  };

  const closeCameraModal = () => {
    setShowCameraModal(false);
  };

  return (
    <div className="fbi-panel relative">
      <h2 className="text-lg font-semibold mb-3 text-fbi-navy">Subject Identification</h2>
      
      {capturedImage ? (
        <div className="relative">
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-full max-h-[400px] object-contain border border-gray-300" 
          />
          <div className="flex justify-between mt-2">
            <Button 
              onClick={resetCapture}
              variant="outline"
              className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
            >
              <RefreshCcw size={16} />
              <span>Retake Photo</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="border border-gray-300 bg-fbi-lightgray h-[300px] flex items-center justify-center flex-col p-4">
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <Loader2 size={40} className="animate-spin text-fbi-navy mb-4" />
                <p className="text-center text-fbi-gray">Processing image...</p>
              </div>
            ) : (
              <>
                <p className="mb-6 text-center text-fbi-gray">
                  Please capture an image or upload a photo to identify the subject
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                  <Button 
                    onClick={openCameraModal}
                    className="official-btn flex items-center gap-2"
                  >
                    <Camera size={18} />
                    <span>Take Photo</span>
                  </Button>
                  <Button 
                    onClick={handleUploadClick}
                    className="bg-fbi-gray text-white hover:bg-gray-600 flex items-center gap-2"
                  >
                    <Upload size={18} />
                    <span>Upload Image</span>
                  </Button>
                </div>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}
      
      {/* Camera Modal */}
      <CameraModal 
        isOpen={showCameraModal}
        onClose={closeCameraModal}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};

export default CameraCapture;
