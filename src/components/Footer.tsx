import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t-4 border-primary-600 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Descr */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-tight uppercase">
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                SAS A1
              </span>{" "}
              <span className="text-white">Beef Stall</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium quality fresh meat delivered directly to your doorstep. We
              ensure the highest hygiene standards and halal cuts.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-gradient-to-r hover:from-primary-600 hover:to-accent-600 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-gradient-to-r hover:from-primary-600 hover:to-accent-600 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-gradient-to-r hover:from-primary-600 hover:to-accent-600 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black text-white mb-4 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/"
                  className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-semibold hover:translate-x-1 inline-block transform duration-300"
                >
                  → Shop Now
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-semibold hover:translate-x-1 inline-block transform duration-300"
                >
                  → About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-semibold hover:translate-x-1 inline-block transform duration-300"
                >
                  → Delivery Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-semibold hover:translate-x-1 inline-block transform duration-300"
                >
                  → Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Map */}
          <div className="space-y-4">
            <h4 className="text-lg font-black text-white mb-4 uppercase tracking-wide">
              Visit Us
            </h4>
            <div className="w-full h-48 bg-gray-800 rounded-2xl overflow-hidden relative border-2 border-gray-700 shadow-xl">
              <iframe
                src="https://maps.google.com/maps?q=No.%201020%2C%202ND%20Area%2C%20Mailai%20Balaji%20Nagar%2C%20Pallikaranai%2C%20Chennai&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="Shop Location"
              ></iframe>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">
                  No. 1020, 2ND Area, Mailai Balaji Nagar, Pallikaranai, Chennai
                  - 600100
                </span>
              </div>
              <div className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform" />
                <span className="font-medium">+91 63839 38001</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform" />
                <span className="font-medium">sasa1beefstall@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t-2 border-gray-800 text-center">
          <p className="text-sm font-semibold text-gray-400">
            &copy; {new Date().getFullYear()}{" "}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent font-black">
              SAS A1 Beef Stall
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
