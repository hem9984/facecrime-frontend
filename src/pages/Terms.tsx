import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow">
          <Button 
            variant="ghost" 
            className="mb-4 flex items-center gap-1 text-fbi-navy"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Button>
          
          <h1 className="text-2xl font-bold mb-6 text-fbi-navy">Terms and Conditions</h1>
          
          <div className="space-y-6 text-sm">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
              <p>By accessing or using the FaceCrime facial recognition service ("Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Service.</p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold mb-2">2. Description of Service</h2>
              <p>FaceCrime provides a facial recognition service that attempts to match uploaded images against a database of known individuals. The Service is provided on an "as is" and "as available" basis without warranties of any kind.</p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold mb-2">3. Disclaimer of Warranties</h2>
              <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE PURSUANT TO APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
              <p className="mt-2">WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold mb-2">4. Limitation of Liability</h2>
              <p>IN NO EVENT SHALL FACECRIME, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE;</li>
                <li>ANY MISIDENTIFICATION OR INCORRECT MATCHING OF INDIVIDUALS;</li>
                <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE;</li>
                <li>ANY CONTENT OBTAINED FROM THE SERVICE; AND</li>
                <li>UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold mb-2">5. Accuracy of Information</h2>
              <p>FaceCrime does not claim to have complete or comprehensive data on all individuals. The database used for matching is limited and may not contain current or accurate information. Any matches provided by the Service should be considered preliminary and subject to verification through official channels.</p>
              <p className="mt-2">WE EXPLICITLY DISCLAIM ANY RESPONSIBILITY FOR MISIDENTIFICATION OR FALSE MATCHES. Users must exercise due diligence and not rely solely on the Service for identification purposes.</p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold mb-2">6. Prohibited Uses</h2>
              <p>You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, overburden, or impair the Service. Specifically, you agree not to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Use the Service to harass, stalk, or harm any individual;</li>
                <li>Use the Service for any discriminatory practices;</li>
                <li>Use the Service to violate any applicable law or regulation;</li>
                <li>Attempt to interfere with the proper functioning of the Service;</li>
                <li>Bypass any measures we may use to prevent or restrict access to the Service.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold mb-2">7. Indemnification</h2>
              <p>You agree to defend, indemnify, and hold harmless FaceCrime, its officers, directors, employees and agents, from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the Service or your violation of these Terms.</p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold mb-2">8. Data Privacy</h2>
              <p>Images uploaded to the Service are processed for the sole purpose of providing the facial recognition service. We do not store uploaded images beyond the time necessary to process your request. However, we cannot guarantee the security of data transmitted over the Internet.</p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold mb-2">9. Modifications to Terms</h2>
              <p>We reserve the right to modify these Terms at any time. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold mb-2">10. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which FaceCrime operates, without regard to its conflict of law provisions.</p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold mb-2">11. Contact Information</h2>
              <p>For any questions about these Terms, please contact us.</p>
            </section>
          </div>
          
          <div className="mt-8 border-t pt-4">
            <p className="text-xs text-gray-500 text-center">Last Updated: May 8, 2025</p>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 py-4 border-t border-gray-200">
        <div className="container mx-auto text-center text-xs text-gray-500">
          <p>© 2025 FaceCrime. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
