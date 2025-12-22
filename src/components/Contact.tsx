import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Building,
  Navigation,
  Send,
} from 'lucide-react';

export function Contact() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl mb-6">Contact Us</h1>
            <p className="text-xl text-blue-100 mb-4">संपर्क करें</p>
            <p className="text-lg text-blue-200">
              We're here to listen. Reach out for queries, suggestions, or support.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl mb-6">Get in Touch</h2>
                <p className="text-gray-600 mb-8">
                  Whether you have a story to share, a question to ask, or feedback to give, we'd
                  love to hear from you. Your voice matters to us.
                </p>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="mb-2">Our Office</h3>
                      <p className="text-gray-700">Plot No. 8, Indira Press Complex</p>
                      <p className="text-gray-700">Zone-I, Maharana Pratap Nagar</p>
                      <p className="text-gray-700">Bhopal, Madhya Pradesh – 462011</p>
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="mb-2">Call Us</h3>
                      <a
                        href="tel:6268539458"
                        className="text-gray-700 hover:text-blue-600 transition-colors block"
                      >
                        +91 6268539458
                      </a>
                      <a
                        href="tel:9111122666"
                        className="text-gray-700 hover:text-blue-600 transition-colors block"
                      >
                        +91 9111122666
                      </a>
                      <p className="text-sm text-gray-500 mt-2">
                        For queries, suggestions, and support
                      </p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="mb-2">Working Hours</h3>
                      <p className="text-gray-700">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-700">Sunday: Closed</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Available for urgent matters 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl mb-6">Send us a Message</h2>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">
                      Your Name / आपका नाम
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">
                      Email Address / ईमेल
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-2">
                      Phone Number / फोन नंबर
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-gray-700 mb-2">
                      Subject / विषय
                    </label>
                    <select
                      id="subject"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Select a subject</option>
                      <option value="story">Share a Story / कहानी साझा करें</option>
                      <option value="complaint">File a Complaint / शिकायत दर्ज करें</option>
                      <option value="suggestion">Give Suggestion / सुझाव दें</option>
                      <option value="feedback">Provide Feedback / फीडबैक दें</option>
                      <option value="collaboration">Collaboration / सहयोग</option>
                      <option value="other">Other / अन्य</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-gray-700 mb-2">
                      Your Message / आपका संदेश
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Contact Us Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-12">How We Can Help</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl mb-3">Share Your Story</h3>
                <p className="text-gray-600">
                  Have a civic issue or success story? We want to hear it and amplify your voice.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl mb-3">Report an Issue</h3>
                <p className="text-gray-600">
                  Notice a problem in your locality? Report it to us and we'll investigate.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Navigation className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl mb-3">Collaborate</h3>
                <p className="text-gray-600">
                  Interested in collaborating? Let's work together to strengthen local democracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-8">Find Us</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1675589412450-571c4a5afe6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwZ292ZXJuYW5jZSUyMGluZGlhfGVufDF8fHx8MTc2NDE0MDI3OHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="CivicCast Office Location"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-center">
                  <div className="text-center text-white">
                    <MapPin className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-xl">Plot No. 8, Indira Press Complex</p>
                    <p className="text-lg">Maharana Pratap Nagar, Bhopal</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-blue-50">
                <p className="text-center text-gray-700">
                  <strong>Address:</strong> Plot No. 8, Indira Press Complex, Zone-I, Maharana
                  Pratap Nagar, Bhopal, Madhya Pradesh – 462011
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl mb-6">Your Voice Matters</h2>
            <p className="text-lg text-blue-100 mb-8">
              Every message, every call, every suggestion helps us serve you better. Together, we
              can build a more transparent and accountable governance system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:6268539458"
                className="bg-white text-blue-900 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                <span>Call Now</span>
              </a>
              <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-colors">
                Visit Our Office
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
