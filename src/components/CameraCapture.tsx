
import React, { useRef, useState } from 'react';
import { Camera, Upload, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CameraModal from './CameraModal';

interface CameraCaptureProps {
  onImageCapture: (image: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      if (!file.type.match('image.*')) {
        toast.error("Please select an image file.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageDataUrl = e.target.result.toString();
          setCapturedImage(imageDataUrl);
          onImageCapture(imageDataUrl);
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

  const handleCameraCapture = (imageData: string) => {
    setCapturedImage(imageData);
    onImageCapture(imageData);
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
