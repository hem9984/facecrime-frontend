
import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, FlipHorizontal } from 'lucide-react';
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
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  // Initialize pica instance with Lanczos filter
  const pica = new Pica({
    features: ['js', 'wasm', 'ww'],
    alpha: true,
    unsharpAmount: 80,
    unsharpRadius: 0.6,
    unsharpThreshold: 2
  });

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
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      if (stream) {
        // If we already have a stream, stop it before starting a new one
        stopCamera();
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 640 } }
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

  const flipCamera = () => {
    // Toggle between front and back cameras
    // we should default to rear camera
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  const resizeImage = async (sourceCanvas: HTMLCanvasElement): Promise<string> => {
    try {
      if (!resizeCanvasRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 640;
        resizeCanvasRef.current = canvas;
      }
      
      const destCanvas = resizeCanvasRef.current;
      destCanvas.width = 640;
      destCanvas.height = 640;
      
      // Use LANCZOS by setting the filter to lanczos3 (Lanczos with a=3)
      await pica.resize(sourceCanvas, destCanvas, {
        filter: 'lanczos3'
      });
      
      return destCanvas.toDataURL('image/jpeg', 1.0);
    } catch (error) {
      console.error('Image resize error:', error);
      return sourceCanvas.toDataURL('image/jpeg', 1.0);
    }
  };

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 640;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        try {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Resize image to 640x640 using Lanczos
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
              Position the face in frame
            </div>
          )}
          
          {/* Always visible flip camera button (fixed position) */}
          <Button 
            onClick={flipCamera}
            variant="outline"
            className="absolute top-2 right-2 p-2 bg-black/30 border-none text-white hover:bg-black/50"
            size="icon"
          >
            <FlipHorizontal size={20} />
            <span className="sr-only">Flip Camera</span>
          </Button>
          
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
