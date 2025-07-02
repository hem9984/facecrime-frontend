import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, FlipHorizontal } from 'lucide-react';
import { Button } from './ui/button';
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
          
          // Close modal first
          stopCamera();
          onClose();
          // Then send image to parent
          onCapture(resizedImageDataUrl);
        } catch (error) {
          console.error("Error capturing image:", error);
          toast.error("Failed to capture image. Please try again.");
        }
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 24,
              minWidth: 350,
              minHeight: 420,
              width: '90vw',
              maxWidth: 420,
              boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 1.5px 4px rgba(0,0,0,0.12)',
              position: 'relative',
              animation: 'modalFadeIn 0.25s cubic-bezier(.4,0,.2,1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Close (X) button in top-right */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                zIndex: 2,
              }}
              aria-label="Close"
            >
              <X size={22} color="#888" />
            </button>

            <h2
              style={{
                fontWeight: 700,
                fontSize: 22,
                marginBottom: 18,
                textAlign: 'center',
                letterSpacing: '-0.5px',
                width: '100%',
              }}
            >
              Take Photo
            </h2>

            <div
              style={{
                position: 'relative',
                background: 'black',
                borderRadius: 12,
                overflow: 'hidden',
                width: '100%',
                maxWidth: 350,
                height: 300,
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 12,
                  background: 'black',
                }}
              />
              {cameraActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.5)',
                    padding: 8,
                    color: 'white',
                    fontSize: 12,
                    textAlign: 'center',
                  }}
                >
                  Position the face in frame
                </div>
              )}

              {/* Flip camera button */}
              <Button
                onClick={flipCamera}
                variant="outline"
                className="absolute top-2 right-2 p-2 bg-black/30 border-none text-white hover:bg-black/50"
                size="icon"
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  background: 'rgba(0,0,0,0.3)',
                  border: 'none',
                  color: 'white',
                }}
              >
                <FlipHorizontal size={20} />
                <span className="sr-only">Flip Camera</span>
              </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 8 }}>
              <Button
                variant="outline"
                className="text-red-500 border-red-500 flex-1"
                onClick={onClose}
                style={{ minWidth: 0, flex: 1 }}
              >
                <X size={18} className="mr-1" /> Cancel
              </Button>

              <Button
                onClick={captureImage}
                className="bg-fbi-navy text-white hover:bg-fbi-navy/80 flex-1"
                disabled={!cameraActive}
                style={{ minWidth: 0, flex: 1 }}
              >
                <Camera size={18} className="mr-1" /> Capture
              </Button>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>
          {/* Modal fade-in animation */}
          <style>
            {`
              @keyframes modalFadeIn {
                from { opacity: 0; transform: translateY(40px) scale(0.98);}
                to { opacity: 1; transform: translateY(0) scale(1);}
              }
            `}
          </style>
        </div>
      )}
    </>
  );
};

export default CameraModal;
