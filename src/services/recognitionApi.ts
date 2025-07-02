
// Recognition API service

// Full response from the backend
export interface RecognitionResponse {
    row_id: number;
    id: string;
    prefix: string;
    firstname: string;
    middlename: string;
    lastname: string;
    suffix: string;
    gender: string;
    dob: string;
    location_name: string;
    location_type: string;
    streetaddress: string;
    city: string;
    county: string;
    state: string;
    zipcode: string;
    latitude: number;
    longitude: number;
    offenderuri: string;
    imageuri: string;
    absconder: boolean;
    jurisdictionid: string;
    imagebase64: string;
    matchPercent: number;
  }
  
  // Simplified interface for components that don't need all fields
  export interface RecognitionResult {
    // Basic identity
    fullName: string;
    gender: string;
    dob: string;
    
    // Location info
    location: string;
    streetAddress: string;
    city: string;
    county: string;
    state: string;
    zipCode: string;
    
    // Match details
    imageBase64: string;
    matchPercent: number;
    
    // Links
    offenderUri: string;
    imageUri: string;
    
    // Additional details
    absconder: boolean;
    
    // Original response for access to all fields
    rawResponse: RecognitionResponse | null;
  }
  
  // This function sends the image to the real API endpoint
  export const recognizeFace = async (imageData: string): Promise<RecognitionResult> => {
    try {
      console.log("Sending face recognition request to API endpoint");
      
      // Ensure imageData is properly formatted
      // If it's a data URL, extract the base64 part
      let processedImageData = imageData;
      if (imageData.startsWith('data:image')) {
        processedImageData = imageData.split(',')[1];
      }
      
      console.log("Image data length:", processedImageData.length);
      
      // Create the request body with the image data
      const requestBody = {
        image: processedImageData
      };
      
      // Make the POST request to the specified endpoint
      // const response = await fetch('https://anthonylamelas.tail9dec88.ts.net/submission', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(requestBody)
      // });
  
      const response = await fetch('https://muchnic.tail9dec88.ts.net/submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      // Check if the request was successful
      if (!response.ok) {
        // Try to get more information about the error
        try {
          const errorData = await response.text();
          console.error("API error response:", errorData);
          throw new Error(`API request failed with status: ${response.status}. Details: ${errorData}`);
        } catch (textError) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
      }
      
      // Parse the response from the API
      const result = await response.json();
      console.log("API response via proxy:", result);
      
      // Check if we got an empty result
      if (result.results && result.results.length === 0) {
        return createEmptyResult("No matches found");
      }
      
      return processApiResponse(result);
    } catch (error) {
      console.error("Error during face recognition API call:", error);
      return createEmptyResult("API Error - Could not retrieve data");
    }
  };
  
  // Helper function to create an empty result
  const createEmptyResult = (message: string): RecognitionResult => {
    return {
      fullName: "NO FACE DETECTED - TRY AGAIN LATER",
      gender: 'Unknown',
      dob: 'Unknown',
      location: 'Unknown',
      streetAddress: 'Unknown',
      city: 'Unknown',
      county: 'Unknown',
      state: 'Unknown',
      zipCode: 'Unknown',
      imageBase64: '',
      matchPercent: 0,
      offenderUri: '',
      imageUri: '',
      absconder: false,
      rawResponse: null
    };
  };
  
  // Process the API response into our RecognitionResult format
  const processApiResponse = (result: any): RecognitionResult => {
    // Format the full name with available name parts
    const formatName = (prefix?: string, first?: string, middle?: string, last?: string, suffix?: string) => {
      // Log the name parts to debug
      console.log("Name parts:", { prefix, first, middle, last, suffix });
      
      const parts = [];
      if (prefix) parts.push(prefix);
      if (first) parts.push(first);
      if (middle) parts.push(middle);
      if (last) parts.push(last);
      if (suffix) parts.push(suffix);
      
      const fullName = parts.join(' ');
      console.log("Formatted name:", fullName);
      
      return fullName || 'Unknown';
    };
    
    // Format the location data into a single field
    const formatLocation = (location?: string, type?: string) => {
      if (location && type) {
        return `${location} (${type})`;
      }
      return location || type || 'Unknown';
    };
    
    // Format the date of birth to be more human-readable
    const formatDOB = (dob?: string) => {
      if (!dob) return 'Unknown';
      
      try {
        const date = new Date(dob);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      } catch (e) {
        return dob; // Return original if parsing fails
      }
    };
    
    // Return a formatted result with the data from the API
    return {
      fullName: formatName(result.prefix, result.firstname, result.middlename, result.lastname, result.suffix),
      gender: result.gender || 'Unknown',
      dob: formatDOB(result.dob),
      
      location: formatLocation(result.location_name, result.location_type),
      streetAddress: result.streetaddress || 'Unknown',
      city: result.city || 'Unknown',
      county: result.county || 'Unknown',
      state: result.state || 'Unknown',
      zipCode: result.zipcode || 'Unknown',
      
      imageBase64: result.imagebase64 || '',
      matchPercent: result.matchPercent || 0,
      
      offenderUri: result.offenderuri || '',
      imageUri: result.imageuri || '',
      
      absconder: result.absconder || false,
      
      rawResponse: result
    };
  };
  