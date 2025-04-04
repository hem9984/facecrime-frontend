
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CameraCaptureProps {
  onImageCapture: (image: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 480 } } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
        setHasPermission(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
      toast.error("Camera access denied. Please try using file upload instead.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get data URL from canvas
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        
        // Pass the captured image up
        onImageCapture(imageDataUrl);
        
        // Stop the camera
        stopCamera();
      }
    }
  };
  
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
          
          // If camera is active, stop it
          if (isCameraActive) {
            stopCamera();
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

  // Clean up function to stop camera when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

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
          <button 
            onClick={resetCapture}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
            aria-label="Reset capture"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="relative">
          {isCameraActive ? (
            <>
              <div className="relative">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-[300px] object-cover border border-gray-300 bg-black"
                />
                <div className="scanning-line"></div>
              </div>
              <div className="flex justify-center mt-3">
                <Button 
                  onClick={captureImage}
                  className="official-btn"
                >
                  Capture Image
                </Button>
              </div>
            </>
          ) : (
            <div className="border border-gray-300 bg-fbi-lightgray h-[300px] flex items-center justify-center flex-col p-4">
              <p className="mb-6 text-center text-fbi-gray">
                Please capture an image or upload a photo to identify the subject
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                <Button 
                  onClick={startCamera}
                  className="official-btn flex items-center gap-2"
                  disabled={hasPermission === false}
                >
                  <Camera size={18} />
                  <span>Activate Camera</span>
                </Button>
                <Button 
                  onClick={handleUploadClick}
                  className="bg-fbi-gray text-white hover:bg-gray-600 flex items-center gap-2"
                >
                  <Upload size={18} />
                  <span>Upload Image</span>
                </Button>
              </div>
              {hasPermission === false && (
                <p className="mt-4 text-sm text-red-600">
                  Camera access denied. Please enable camera permissions or use file upload instead.
                </p>
              )}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}
      
      {/* Hidden canvas for capturing images */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
