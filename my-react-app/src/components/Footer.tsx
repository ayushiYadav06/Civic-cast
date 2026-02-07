import {
  Building2,
  Megaphone,
  TrendingUp,
  Shield,
  FileText,
  Star,
  BarChart3,
  MessageCircle,
  Users,
  Train,
  Phone,
  Mail,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
} from 'lucide-react';
import logo from '../assets/logo.png';

type PageId = 
  | 'home' 
  | 'about' 
  | 'contact'
  | 'local-governance'
  | 'peoples-voice'
  | 'progress-path'
  | 'criminal-alert'
  | 'ground-report'
  | 'civic-cost-special'
  | 'accountability-meter'
  | 'todays-question'
  | 'direct-from-citizen'
  | 'india-on-track';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleNavigate = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { name: 'स्थानीय सुशासन', icon: Building2 },
    { name: 'जनता की आवाज', icon: Megaphone },
    { name: 'प्रगति पथ', icon: TrendingUp },
    { name: 'आपराधिक सतर्कता', icon: Shield },
    { name: 'ग्राउंड रिपोर्ट', icon: FileText },
    { name: 'Civic कॉस्ट स्पेशल', icon: Star },
    { name: 'जवाबदेही मीटर', icon: BarChart3 },
    { name: 'आज का सवाल', icon: MessageCircle },
    { name: 'सीधे नागरिक से', icon: Users },
    { name: 'पटरी पर भारत', icon: Train },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="mb-6 bg-white rounded-lg inline-block">
              <img src={logo} alt="CivicCast Logo" className="h-20 md:h-30 w-auto" />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Strengthening local democracy through information, dialogue, and accountability.
            </p>
            <p className="text-gray-400 text-sm">
              स्थानीय लोकतंत्र को मजबूत करना
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigate('home')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Home / होम
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('about')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About Us / हमारे बारे में
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('contact')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact / संपर्क करें
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((category) => {
                const Icon = category.icon;
                return (
                  <li key={category.name}>
                    <button className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                      <Icon className="w-3 h-3" />
                      <span>{category.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Plot No. 8, Indira Press Complex, Zone-I, Maharana Pratap Nagar, Bhopal, MP –
                  462011
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <a
                    href="tel:6268539458"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    +91 6268539458
                  </a>
                  <a
                    href="tel:9111122666"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    +91 9111122666
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} CivicCast. All rights reserved. | स्वतंत्र और नागरिक-केंद्रित पत्रकारिता
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <a
                  href="https://www.youtube.com/"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>

                <a
                  href="https://www.instagram.com/"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>

                <a
                  href="https://www.linkedin.com/"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>

                <a
                  href="https://twitter.com/"
                  aria-label="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>

                <a
                  href="https://www.facebook.com/"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>

              <div className="flex items-center gap-6">
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </button>
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Use
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}