
// Mock recognition API service

interface RecognitionResult {
  name: string;
  image: string;
  location: string;
  bio: string;
  offense: string;
  height: string;
  weight: string;
  hairColor: string;
  eyeColor: string;
  race: string;
}

// This function simulates sending the image to a backend service
// In a real app, this would be an actual API call
export const recognizeFace = async (imageData: string): Promise<RecognitionResult> => {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a fake base64 image by modifying the original
  // In a real app, this would be returned by the server
  const processedImage = await addFilterToImage(imageData);
  
  // Return mock data
  return {
    name: "John Doe",
    image: processedImage,
    location: "Washington, D.C.",
    bio: "Subject #47291. Suspected of thoughtcrime activities in the Eastern District. Multiple violations of infosec protocols. Under surveillance since 2023.",
    offense: "Thoughtcrime, Infosec Protocol Violations, District-7 Regulations",
    height: "6'1\"",
    weight: "185 lbs",
    hairColor: "Brown",
    eyeColor: "Blue",
    race: "Caucasian"
  };
};

// Function to add a simple filter to the image to simulate processing
// In a real app, the backend would return a completely different image
const addFilterToImage = (imageData: string): Promise<string> => {
  const canvas = document.createElement('canvas');
  const img = document.createElement('img');
  
  return new Promise<string>((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Apply a red tint filter
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add scan lines
        for (let i = 0; i < canvas.height; i += 4) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(0, i, canvas.width, 1);
        }
        
        // Add a "Processing complete" text overlay
        ctx.font = '16px monospace';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText('SUBJECT IDENTIFIED', 20, 30);
        ctx.fillText('SUBJECT IDENTIFIED', 20, 30);

        // Resolve with the modified image
        resolve(canvas.toDataURL('image/jpeg'));
      } else {
        // If context creation fails, return original
        resolve(imageData);
      }
    };
    
    // Set the image source to the original data
    img.src = imageData;
  });
};
