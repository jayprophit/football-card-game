import React, { useState, useRef, useEffect } from 'react';

interface CameraUploadProps {
  onImageCaptured: (imageUrl: string) => void;
  onCancel: () => void;
}

const CameraUpload: React.FC<CameraUploadProps> = ({
  onImageCaptured,
  onCancel
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize camera stream
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            facingMode: 'user',
            width: { ideal: 300 },
            height: { ideal: 300 }
          } 
        });
        
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError('Could not access camera. Please ensure you have granted camera permission.');
        console.error('Error accessing camera:', err);
      }
    };
    
    initCamera();
    
    // Clean up on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Capture image from video
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
        
        // Convert canvas to data URL
        const imageUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageUrl);
      }
    }
  };
  
  // Save the captured image
  const saveImage = () => {
    if (capturedImage) {
      onImageCaptured(capturedImage);
    }
  };
  
  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
  };
  
  // Allow uploading an image file as an alternative
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          setCapturedImage(e.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="camera-upload">
      <h2>Upload Player Image</h2>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      {!capturedImage ? (
        <>
          <div className="camera-preview">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
            />
          </div>
          
          <button 
            className="capture-btn"
            onClick={captureImage}
            disabled={!!error}
          >
            Take Photo
          </button>
          
          <div className="upload-alternative">
            <p>Or upload an image:</p>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
            />
          </div>
        </>
      ) : (
        <>
          <div className="camera-preview">
            <img src={capturedImage} alt="Captured" />
          </div>
          
          <div className="capture-controls">
            <button 
              className="save-btn"
              onClick={saveImage}
            >
              Use This Photo
            </button>
            
            <button 
              className="retake-btn"
              onClick={retakePhoto}
            >
              Retake
            </button>
          </div>
        </>
      )}
      
      <button 
        className="cancel-btn"
        onClick={onCancel}
      >
        Cancel
      </button>
      
      {/* Hidden canvas for image capture */}
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default CameraUpload;
