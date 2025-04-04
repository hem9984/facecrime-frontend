
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-fbi-navy text-white py-3 px-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <Shield className="h-7 w-7 text-fbi-gold mr-3" />
          <h1 className="text-lg font-bold tracking-tight">FACECRIME</h1>
        </div>
      </div>
      
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="fbi-panel max-w-md w-full text-center py-8 px-6">
          <h1 className="font-mono text-4xl font-bold mb-2 text-fbi-red">404</h1>
          <p className="text-lg text-fbi-navy mb-6">ACCESS RESTRICTED</p>
          
          <div className="w-16 h-1 bg-fbi-navy mx-auto mb-6"></div>
          
          <p className="text-gray-700 mb-8">
            The requested resource could not be found or you do not have sufficient clearance to access this area.
          </p>
          
          <Button asChild className="official-btn">
            <a href="/">Return to Authorized Area</a>
          </Button>
          
          <p className="mt-6 text-xs text-gray-500">
            This access attempt has been logged. Reference ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
