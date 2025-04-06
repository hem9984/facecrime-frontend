
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
    
    // Return the result from the API, using fallbacks for missing fields
    return {
      image: result.image || "", // Don't use the submitted image
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
    
    // Return empty data in error case - no image
    return {
      image: "", // Empty image instead of using the submitted one
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
