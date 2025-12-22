import { ImageWithFallback } from './figma/ImageWithFallback';
import logo from "../assets/logo.png";
import {
  Target,
  Eye,
  Award,
  Briefcase,
  GraduationCap,
  Users,
  Lightbulb,
  Heart,
  Shield,
  FileText,
  Handshake,
} from 'lucide-react';

export function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <img src={logo} alt="CivicCast Logo" className="w-64 bg-white h-auto" />
            </div>
            <h1 className="text-4xl md:text-5xl mb-6">हमारे बारे में</h1>
            <p className="text-xl text-blue-100 mb-4">CivicCast के बारे में</p>
            <p className="text-lg text-blue-200 leading-relaxed">
              CivicCast एक स्वतंत्र और नागरिक-केंद्रित मंच है, जो सूचना, संवाद और जवाबदेही के माध्यम से स्थानीय लोकतंत्र को मजबूत करने के लिए समर्पित है। हमारा मानना है कि एक सक्रिय और जागरूक नागरिक ही सशक्त समाज की नींव है।
            </p>
            <p className="text-base text-blue-100 mt-4">
              हमारा उद्देश्य सरकार और नागरिक के बीच की दूरी को मिटाना है, ताकि हर आवाज़ सुनी जा सके और हर समस्या का समाधान सुनिश्चित किया जा सके।
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission - Detailed */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">हमारा मिशन</h2>
              <p className="text-lg text-gray-600">हमारा लक्ष्य</p>
              <div className="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
            </div>

              <p className="text-center text-gray-700 text-lg mb-12 max-w-4xl mx-auto">
                हमारा मिशन तीन स्तंभों पर टिका है:
              </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-4 text-center">सटीक सूचना का प्रसारण</h3>
                <p className="text-gray-700 text-center leading-relaxed">
                  हम 'स्थानीय सुशासन' और 'आपराधिक सतर्कता' जैसे खंडों के माध्यम से सरकारी निर्णयों, नीतियों और सुरक्षा से जुड़ी हर महत्वपूर्ण खबर को सटीकता और निष्पक्षता के साथ प्रस्तुत करते हैं।
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-4 text-center">नागरिक संवाद को प्रोत्साहन</h3>
                <p className="text-gray-700 text-center leading-relaxed">
                  हम केवल खबरें नहीं देते; 'जनता की आवाज़' और 'आज का सवाल' जैसे इंटरैक्टिव मंचों के ज़रिए नागरिकों को अपनी राय साझा करने और स्थानीय मुद्दों पर सामूहिक चर्चा करने के अवसर प्रदान करते हैं।
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-4 text-center">जवाबदेही सुनिश्चित करना</h3>
                <p className="text-gray-700 text-center leading-relaxed">
                  हम 'प्रगति पथ' और अपने 'जवाबदेही मीटर' के ज़रिए विकास कार्यों और सरकारी विभागों के प्रदर्शन को ट्रैक करते हैं। हमारा उद्देश्य है कि सत्तासीन लोग जनता के प्रति जवाबदेह रहें और करदाताओं के धन का सही व न्यायसंगत उपयोग सुनिश्चित हो।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do - Detailed */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">हम क्या करते हैं?</h2>
              <p className="text-lg text-gray-600">हमारी कार्यपद्धति</p>
              <div className="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg">
              <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                <div>
                  <div className="flex items-start gap-4 mb-6">
                    <FileText className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl mb-3">गहन विश्लेषण और रिपोर्टिंग</h3>
                      <p className="text-gray-700 leading-relaxed">
                        CivicCast पर आपको सिर्फ ब्रेकिंग न्यूज़ नहीं मिलेगी; हमारे 'ग्राउंड रिपोर्ट' और 'CivicCast स्पेशल' सेक्शन में स्थानीय मुद्दों का गहन, डेटा-आधारित विश्लेषण प्रस्तुत किया जाता है।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Heart className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl mb-3">नागरिकों की प्रेरक कहानियाँ</h3>
                      <p className="text-gray-700 leading-relaxed">
                        हम उन नागरिकों की प्रेरक कहानियों को प्रमुखता से प्रस्तुत करते हैं जो अपने इलाके में सकारात्मक बदलाव ला रहे हैं — 'सीधे नागरिक से'।
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1682934459361-c514c64ed3c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsaXNtJTIwbmV3cyUyMHJlcG9ydGVyfGVufDF8fHx8MTc2NDE0MDI3OXww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Journalism"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Support Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">आपके समर्थन की आवश्यकता</h2>
              <p className="text-lg text-gray-600">हम आपके साथ चाहते हैं</p>
              <div className="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 md:p-12 rounded-xl shadow-lg">
              <div className="flex items-start gap-6 mb-8">
                <Handshake className="w-12 h-12 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    सच्ची और स्वतंत्र पत्रकारिता के लिए संसाधन आवश्यक हैं। CivicCast किसी भी राजनीतिक दल या कॉर्पोरेट हितों से स्वतंत्र है। हमारे काम का आधार हमारे पाठकों का विश्वास और समर्थन है।
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    आप हमें पढ़ें, साझा करें और हमें बेहतर बनाने के लिए अपने सुझाव दें। आपका जुड़ाव हमारी ताकत है।
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg text-center">
                  <Eye className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <h4 className="mb-2">पढ़ें</h4>
                  <p className="text-sm text-gray-600">हमारी रिपोर्टों के साथ जानकारी में बने रहें</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center">
                  <Users className="w-10 h-10 text-green-600 mx-auto mb-3" />
                  <h4 className="mb-2">साझा करें</h4>
                  <p className="text-sm text-gray-600">अपने समुदाय में जागरूकता फैलाएँ</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center">
                  <Lightbulb className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
                  <h4 className="mb-2">सुझाव दें</h4>
                  <p className="text-sm text-gray-600">हमारी कवरेज को बेहतर बनाने में मदद करें</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      {/* <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">हमारे संस्थापक</h2>
              <p className="text-lg text-gray-600">संस्थापक और प्रमुख टीम</p>
              <div className="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-64 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                    <span className="text-5xl text-blue-600">GK</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl mb-2">गौरव खरे</h3>
                  <p className="text-lg text-gray-600 mb-1">गौरव खरे</p>
                  <div className="flex items-center gap-2 text-blue-600 mb-4">
                    <Briefcase className="w-4 h-4" />
                    <span>संस्थापक / प्रमुख सलाहकार</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-gray-700">
                          6 वर्षों के अनुभव वाले पीआर और डिजिटल संचार विशेषज्ञ
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-gray-700">
                          जिन्हें लोकल टेक नवाचार के लिए "बुंदेलखंड का टेक गुरु" कहा जाता है।
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-gray-700">
                          CivicCast की स्वतंत्र पत्रकारिता को व्यापक दर्शकों तक पहुँचाने में सक्रिय भूमिका निभाते हैं।
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-64 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                    <span className="text-5xl text-green-600">AP</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl mb-2">आशीष पटेरिया</h3>
                  <p className="text-lg text-gray-600 mb-1">आशीष पटेरिया</p>
                  <div className="flex items-center gap-2 text-green-600 mb-4">
                    <Briefcase className="w-4 h-4" />
                    <span>संचार एवं दृश्य रणनीति प्रमुख</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-gray-700">
                          भोपाल में पत्रकारिता के क्षेत्र में 8 वर्षों का अनुभव
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-gray-700">
                          'हिंदुस्थान समाचार' के साथ उनके योगदान के लिए प्रसिद्ध
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-gray-700">
                          AAFT से फिल्ममेकिंग और मास कम्युनिकेशन में प्रशिक्षित
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-gray-700">
                          ग्राउंड रिपोर्ट और विशेष प्रस्तुतियों के लिए उच्च गुणवत्ता वाली लिखित व दृश्य सामग्री के प्रभारी
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Why CivicCast */}
      {/* <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-12">CivicCast क्यों महत्वपूर्ण है</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-600 pl-6 py-4">
                <h3 className="text-xl mb-2">स्वतंत्र और निष्पक्ष</h3>
                <p className="text-gray-600">
                  हम किसी राजनीतिक या कॉर्पोरेट प्रभाव से मुक्त होकर काम करते हैं और निष्पक्ष रिपोर्टिंग सुनिश्चित करते हैं।
                </p>
              </div>
              <div className="border-l-4 border-green-600 pl-6 py-4">
                <h3 className="text-xl mb-2">नागरिक-केंद्रित दृष्टिकोण</h3>
                <p className="text-gray-600">
                  हर खबर, हर रिपोर्ट और हर सवाल नागरिकों की जरूरतों और चिंताओं के इर्द-गिर्द केंद्रित होता है।
                </p>
              </div>
              <div className="border-l-4 border-orange-600 pl-6 py-4">
                <h3 className="text-xl mb-2">ग्राउंड-लेवल रिपोर्टिंग</h3>
                <p className="text-gray-600">
                  हमारे रिपोर्टर समुदाय के पास जाकर असली कहानियाँ और अनुभव लाते हैं।
                </p>
              </div>
              <div className="border-l-4 border-purple-600 pl-6 py-4">
                <h3 className="text-xl mb-2">डेटा-आधारित जवाबदेही</h3>
                <p className="text-gray-600">
                  हम वादों का ट्रैक रखते हैं, प्रगति की निगरानी करते हैं और तथ्यों व डेटा के आधार पर अधिकारियों को जवाबदेह ठहराते हैं।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Join Us Section */}
      {/* <section className="py-16 md:py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl mb-6">हमारे मिशन से जुड़ें</h2>
            <p className="text-lg text-blue-100 mb-8">
              लोकतंत्र को मजबूत करने वाले आंदोलन का हिस्सा बनें—एक कहानी, एक कदम। साथ मिलकर हम एक अधिक पारदर्शी, जवाबदेह और उत्तरदायी शासन व्यवस्था बना सकते हैं।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <span>जानकारी रखें</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <span>संवाद में भाग लें</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <span>प्राधिकरणों को जवाबदेह रखें</span>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}