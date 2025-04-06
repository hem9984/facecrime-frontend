// Recognition API service

interface RecognitionResult {
  image: string; // This will be base64 encoded string
  offense: string;
  height: string;
  weight: string;
  hairColor: string;
  eyeColor: string;
  race: string;
  sexOffender: boolean;
  matchPercent: number;
}

// This function sends the image to the real API endpoint
export const recognizeFace = async (imageData: string): Promise<RecognitionResult> => {
  try {
    // Show that we're making a request to the real endpoint
    console.log("Sending face recognition request to real API endpoint");
    
    // Create the request body with the image data
    const requestBody = {
      image: imageData
    };
    
    // Make the POST request to the specified endpoint
    const response = await fetch('https://muchnic.tail9dec88.ts.net/submission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    // Parse the response from the API
    const result = await response.json();
    
    // If the API returns differently structured data, map it to our interface
    // For now, we'll assume the API returns data in the format we expect
    return {
      image: imageData, // Use the submitted image
      offense: result.offense || "Unknown offense",
      height: result.height || "Unknown",
      weight: result.weight || "Unknown",
      hairColor: result.hairColor || "Unknown",
      eyeColor: result.eyeColor || "Unknown",
      race: result.race || "Unknown",
      sexOffender: result.sexOffender || false,
      matchPercent: result.matchPercent || 0.5
    };
  } catch (error) {
    console.error("Error during face recognition API call:", error);
    
    // You might want to handle this differently in production
    // For now, we'll return some fallback data so the UI doesn't break
    return {
      image: imageData,
      offense: "API Error - Could not retrieve data",
      height: "Unknown",
      weight: "Unknown",
      hairColor: "Unknown",
      eyeColor: "Unknown",
      race: "Unknown",
      sexOffender: false,
      matchPercent: 0
    };
  }
};



// // Mock recognition API service

// interface RecognitionResult {
//   image: string; // This will be base64 encoded string
//   offense: string;
//   height: string;
//   weight: string;
//   hairColor: string;
//   eyeColor: string;
//   race: string;
//   sexOffender: boolean; // Added sex offender status
//   matchPercent: number; // Added match percentage as a decimal
// }

// // This function simulates sending the image to a backend service
// // In a real app, this would be an actual API call
// export const recognizeFace = async (imageData: string): Promise<RecognitionResult> => {
//   // Simulate API processing time
//   await new Promise(resolve => setTimeout(resolve, 2000));
  
//   // In a real app, the backend would return a completely different image
//   // Here we're just using the same image for demonstration
  
//   // Return mock data
//   return {
//     image: imageData, // Use the submitted image as temporary placeholder
//     offense: "Thoughtcrime, Infosec Protocol Violations, District-7 Regulations",
//     height: "6'1\"",
//     weight: "185 lbs",
//     hairColor: "Brown",
//     eyeColor: "Blue",
//     race: "Caucasian",
//     sexOffender: true, // Mock data for sex offender status
//     matchPercent: 0.677 // Mock data for match percentage (67.7%)
//   };
// };

// // Function to add a simple filter to the image to simulate processing
// // In a real app, the backend would return a completely different image
// const addFilterToImage = (imageData: string): Promise<string> => {
//   const canvas = document.createElement('canvas');
//   const img = document.createElement('img');
  
//   return new Promise<string>((resolve) => {
//     img.onload = () => {
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext('2d');
      
//       if (ctx) {
//         // Draw the original image
//         ctx.drawImage(img, 0, 0);
        
//         // Apply a red tint filter
//         ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
        
//         // Add scan lines
//         for (let i = 0; i < canvas.height; i += 4) {
//           ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
//           ctx.fillRect(0, i, canvas.width, 1);
//         }
        
//         // Add a "Processing complete" text overlay
//         ctx.font = '16px monospace';
//         ctx.fillStyle = 'white';
//         ctx.strokeStyle = 'black';
//         ctx.lineWidth = 3;
//         ctx.strokeText('SUBJECT IDENTIFIED', 20, 30);
//         ctx.fillText('SUBJECT IDENTIFIED', 20, 30);

//         // Resolve with the modified image
//         resolve(canvas.toDataURL('image/jpeg'));
//       } else {
//         // If context creation fails, return original
//         resolve(imageData);
//       }
//     };
    
//     // Set the image source to the original data
//     img.src = imageData;
//   });
// };
