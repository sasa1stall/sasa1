import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand & Descr */}
          <div className="space-y-4">
             <h3 className="text-2xl font-bold text-white tracking-tighter uppercase">
              <span className="text-primary-500">SAS A1</span> Beef Stall
            </h3>
            <p className="text-sm text-gray-400">
              Premium quality fresh meat delivered directly to your doorstep. We ensure the highest hygiene standards and halal cuts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-500 transition-colors"><Instagram className="w-5 h-5"/></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Facebook className="w-5 h-5"/></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Twitter className="w-5 h-5"/></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-primary-500 transition-colors">Shop Now</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Delivery Info</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Contact & Map */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Visit Us</h4>
            <div className="w-full h-48 bg-gray-800 rounded-lg overflow-hidden relative">
               <iframe 
                src="https://maps.google.com/maps?q=No.%201020%2C%202ND%20Area%2C%20Mailai%20Balaji%20Nagar%2C%20Pallikaranai%2C%20Chennai&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy" 
                title="Shop Location"
              ></iframe>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>No. 1020, 2ND Area, Mailai Balaji Nagar, Pallikaranai, Chennai - 600100</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary-500" />
                <span>+91 63839 38001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary-500" />
                <span>sasa1beefstall@gmail.com</span>
              </div>
            </div>
          </div>

        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} SAS A1 Beef Stall. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
