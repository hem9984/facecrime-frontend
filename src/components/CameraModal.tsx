
import React, { useRef, useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import Pica from 'pica';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const resizeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  // Initialize pica instance
  const pica = new Pica();

  useEffect(() => {
    // Start camera when modal opens
    if (isOpen) {
      startCamera();
    } else {
      // Stop camera when modal closes
      stopCamera();
    }

    // Clean up on component unmount
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 480 } }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
        setStream(mediaStream);
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Camera access denied. Please check your permissions.");
      onClose();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  const resizeImage = async (sourceCanvas: HTMLCanvasElement): Promise<string> => {
    try {
      if (!resizeCanvasRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = 224;
        canvas.height = 224;
        resizeCanvasRef.current = canvas;
      }
      
      const destCanvas = resizeCanvasRef.current;
      destCanvas.width = 224;
      destCanvas.height = 224;
      
      await pica.resize(sourceCanvas, destCanvas);
      return destCanvas.toDataURL('image/jpeg', 0.9);
    } catch (error) {
      console.error('Image resize error:', error);
      return sourceCanvas.toDataURL('image/jpeg', 0.9);
    }
  };

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        try {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Resize image to 224x224
          const resizedImageDataUrl = await resizeImage(canvas);
          
          // Send captured and resized image to parent
          onCapture(resizedImageDataUrl);
          
          // Close modal and stop camera
          stopCamera();
          onClose();
        } catch (error) {
          console.error("Error capturing image:", error);
          toast.error("Failed to capture image. Please try again.");
        }
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Take Photo</DialogTitle>
        </DialogHeader>
        
        <div className="relative bg-black rounded-md overflow-hidden">
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-[300px] object-cover"
          />
          {cameraActive && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-xs text-center">
              Position your face in frame
            </div>
          )}
          <div className="scanning-line"></div>
        </div>
        
        <div className="flex justify-between mt-2">
          <DialogClose asChild>
            <Button variant="outline" className="text-red-500 border-red-500">
              <X size={18} className="mr-1" /> Cancel
            </Button>
          </DialogClose>
          
          <Button 
            onClick={captureImage}
            className="bg-fbi-navy text-white hover:bg-fbi-navy/80"
            disabled={!cameraActive}
          >
            <Camera size={18} className="mr-1" /> Capture
          </Button>
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default CameraModal;
