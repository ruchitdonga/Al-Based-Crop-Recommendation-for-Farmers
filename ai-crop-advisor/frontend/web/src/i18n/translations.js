export const LANGS = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "mr", label: "मराठी" },
  { value: "gu", label: "ગુજરાતી" },
];

export const DEFAULT_LANG = "en";

/**
 * Translation keys are flat on purpose for simplicity.
 * Keep values short and UI-friendly.
 */
export const translations = {
  en: {
    "nav.home": "Home",
    "nav.cropAdvisor": "Crop Advisor",
    "nav.voiceChat": "Voice Chat",
    "nav.language": "Language",

    "status.checking": "Checking backend…",
    "status.down": "Backend unavailable. Some features may not work.",
    "status.degraded": "Backend running (degraded). Some features may not work.",

    "home.badge": "AI-powered • Weather-aware • Soil-smart",
    "home.title": "Grow smarter with AI crop recommendations.",
    "home.subtitle":
      "Enter your soil and climate details and get a crop suggestion optimized for yield and sustainability.",
    "home.cta": "Get Recommendation",
    "home.howItWorks": "How it works",
    "home.card1.title": "Soil nutrients",
    "home.card1.text": "N, P, K, pH and rainfall inputs.",
    "home.card2.title": "Climate signals",
    "home.card2.text": "Temperature and humidity trends.",
    "home.card3.title": "Actionable output",
    "home.card3.text": "A clear crop recommendation.",

    "form.title": "Crop Recommendation",
    "form.subtitle": "Fill in your soil and climate values.",
    "form.submit": "Get Recommendation",
    "form.loading": "Requesting…",
    "form.validation.required": "Please fill in all required numeric fields.",
    "form.validation.number": "Please enter a valid number.",
    "form.error.invalid": "Invalid input. Please check your values.",
    "form.error.backend": "Backend unavailable",

    "field.N": "Nitrogen (N)",
    "field.P": "Phosphorus (P)",
    "field.K": "Potassium (K)",
    "field.temperature": "Temperature (°C)",
    "field.humidity": "Humidity (%)",
    "field.rainfall": "Rainfall (mm)",
    "field.ph": "Soil pH",
    "field.last_crop": "Last crop (optional)",

    "placeholder.num": "e.g. 60",
    "placeholder.temp": "e.g. 26",
    "placeholder.humidity": "e.g. 70",
    "placeholder.rainfall": "e.g. 110",
    "placeholder.ph": "e.g. 6.8",
    "placeholder.last_crop": "e.g. Rice",

    "result.recommended": "Recommended Crop",
    "result.source": "Source",

    "input.stepUp": "Increase value",
    "input.stepDown": "Decrease value",

    "voice.greeting": "Hi! Type a message or use the microphone to talk.",
    "voice.title": "Voice Chat",
    "voice.ready": "Ready",
    "voice.listening": "Listening…",
    "voice.speaking": "Speaking…",
    "voice.placeholder": "Type your message…",
    "voice.send": "Send",
    "voice.micStart": "Start listening",
    "voice.micStop": "Stop listening",
    "voice.unsupported": "Speech recognition is not supported in this browser. Use Chrome.",
    "voice.micPermission": "Unable to start microphone. Check permissions and try again.",
    "voice.aiUnavailable": "AI service unavailable. Start Ollama and try again.",
  },

  hi: {
    "nav.home": "होम",
    "nav.cropAdvisor": "फसल सलाहकार",
    "nav.voiceChat": "वॉइस चैट",
    "nav.language": "भाषा",

    "status.checking": "बैकएंड जांच रहे हैं…",
    "status.down": "बैकएंड उपलब्ध नहीं है। कुछ फीचर काम नहीं करेंगे।",
    "status.degraded": "बैकएंड चल रहा है (degraded)। कुछ फीचर काम नहीं करेंगे।",

    "home.badge": "एआई आधारित • मौसम के अनुसार • मिट्टी स्मार्ट",
    "home.title": "एआई से बेहतर फसल सुझाव पाएं।",
    "home.subtitle":
      "अपनी मिट्टी और मौसम की जानकारी भरें और उपज व टिकाऊपन के अनुसार फसल सुझाव प्राप्त करें।",
    "home.cta": "सुझाव प्राप्त करें",
    "home.howItWorks": "यह कैसे काम करता है",
    "home.card1.title": "मिट्टी के पोषक तत्व",
    "home.card1.text": "N, P, K, pH और वर्षा इनपुट।",
    "home.card2.title": "जलवायु संकेत",
    "home.card2.text": "तापमान और आर्द्रता के रुझान।",
    "home.card3.title": "उपयोगी परिणाम",
    "home.card3.text": "स्पष्ट फसल अनुशंसा।",

    "form.title": "फसल अनुशंसा",
    "form.subtitle": "मिट्टी और मौसम के मान भरें।",
    "form.submit": "सुझाव प्राप्त करें",
    "form.loading": "अनुरोध भेज रहे हैं…",
    "form.validation.required": "कृपया सभी आवश्यक संख्यात्मक फ़ील्ड भरें।",
    "form.validation.number": "कृपया मान्य संख्या दर्ज करें।",
    "form.error.invalid": "गलत इनपुट। कृपया अपने मान जांचें।",
    "form.error.backend": "बैकएंड उपलब्ध नहीं है",

    "field.N": "नाइट्रोजन (N)",
    "field.P": "फॉस्फोरस (P)",
    "field.K": "पोटैशियम (K)",
    "field.temperature": "तापमान (°C)",
    "field.humidity": "आर्द्रता (%)",
    "field.rainfall": "वर्षा (mm)",
    "field.ph": "मिट्टी pH",
    "field.last_crop": "पिछली फसल (वैकल्पिक)",

    "placeholder.num": "उदा. 60",
    "placeholder.temp": "उदा. 26",
    "placeholder.humidity": "उदा. 70",
    "placeholder.rainfall": "उदा. 110",
    "placeholder.ph": "उदा. 6.8",
    "placeholder.last_crop": "उदा. धान",

    "result.recommended": "अनुशंसित फसल",
    "result.source": "स्रोत",

    "input.stepUp": "मान बढ़ाएँ",
    "input.stepDown": "मान घटाएँ",

    "voice.greeting": "नमस्ते! संदेश टाइप करें या माइक्रोफ़ोन से बोलें।",
    "voice.title": "वॉइस चैट",
    "voice.ready": "तैयार",
    "voice.listening": "सुन रहे हैं…",
    "voice.speaking": "बोल रहे हैं…",
    "voice.placeholder": "अपना संदेश लिखें…",
    "voice.send": "भेजें",
    "voice.micStart": "सुनना शुरू करें",
    "voice.micStop": "सुनना बंद करें",
    "voice.unsupported": "इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है। Chrome इस्तेमाल करें।",
    "voice.micPermission": "माइक्रोफ़ोन शुरू नहीं हो पाया। परमिशन जांचें और फिर कोशिश करें।",
    "voice.aiUnavailable": "AI सेवा उपलब्ध नहीं है। Ollama शुरू करें और फिर कोशिश करें।",
  },

  mr: {
    "nav.home": "मुख्यपृष्ठ",
    "nav.cropAdvisor": "पीक सल्लागार",
    "nav.voiceChat": "व्हॉइस चॅट",
    "nav.language": "भाषा",

    "status.checking": "बॅकएंड तपासत आहोत…",
    "status.down": "बॅकएंड उपलब्ध नाही. काही फीचर्स काम करणार नाहीत.",
    "status.degraded": "बॅकएंड सुरू आहे (degraded). काही फीचर्स काम करणार नाहीत.",

    "home.badge": "एआय-आधारित • हवामानानुसार • माती-स्मार्ट",
    "home.title": "एआयद्वारे योग्य पिकाची शिफारस मिळवा.",
    "home.subtitle":
      "माती व हवामानाची माहिती भरा आणि उत्पादन व टिकाऊपणानुसार पीक शिफारस मिळवा.",
    "home.cta": "शिफारस मिळवा",
    "home.howItWorks": "हे कसे काम करते",
    "home.card1.title": "मातीतील पोषक घटक",
    "home.card1.text": "N, P, K, pH आणि पाऊस इनपुट.",
    "home.card2.title": "हवामान संकेत",
    "home.card2.text": "तापमान व आर्द्रतेचे ट्रेंड.",
    "home.card3.title": "उपयोगी निकाल",
    "home.card3.text": "स्पष्ट पीक शिफारस.",

    "form.title": "पीक शिफारस",
    "form.subtitle": "माती व हवामानाचे मूल्य भरा.",
    "form.submit": "शिफारस मिळवा",
    "form.loading": "विनंती पाठवत आहोत…",
    "form.validation.required": "कृपया सर्व आवश्यक संख्यात्मक फील्ड भरा.",
    "form.validation.number": "कृपया वैध संख्या टाका.",
    "form.error.invalid": "चुकीचा इनपुट. कृपया मूल्य तपासा.",
    "form.error.backend": "बॅकएंड उपलब्ध नाही",

    "field.N": "नायट्रोजन (N)",
    "field.P": "फॉस्फरस (P)",
    "field.K": "पोटॅशियम (K)",
    "field.temperature": "तापमान (°C)",
    "field.humidity": "आर्द्रता (%)",
    "field.rainfall": "पाऊस (mm)",
    "field.ph": "माती pH",
    "field.last_crop": "मागील पीक (ऐच्छिक)",

    "placeholder.num": "उदा. 60",
    "placeholder.temp": "उदा. 26",
    "placeholder.humidity": "उदा. 70",
    "placeholder.rainfall": "उदा. 110",
    "placeholder.ph": "उदा. 6.8",
    "placeholder.last_crop": "उदा. भात",

    "result.recommended": "शिफारस केलेले पीक",
    "result.source": "स्रोत",

    "input.stepUp": "मूल्य वाढवा",
    "input.stepDown": "मूल्य कमी करा",

    "voice.greeting": "नमस्कार! संदेश टाइप करा किंवा माईक वापरून बोला.",
    "voice.title": "व्हॉइस चॅट",
    "voice.ready": "तयार",
    "voice.listening": "ऐकत आहोत…",
    "voice.speaking": "बोलत आहोत…",
    "voice.placeholder": "संदेश लिहा…",
    "voice.send": "पाठवा",
    "voice.micStart": "ऐकणे सुरू करा",
    "voice.micStop": "ऐकणे थांबवा",
    "voice.unsupported": "या ब्राउझरमध्ये स्पीच रिकग्निशन सपोर्ट नाही. Chrome वापरा.",
    "voice.micPermission": "माईक सुरू होऊ शकला नाही. परवानग्या तपासा आणि पुन्हा प्रयत्न करा.",
    "voice.aiUnavailable": "AI सेवा उपलब्ध नाही. Ollama सुरू करा आणि पुन्हा प्रयत्न करा.",
  },

  gu: {
    "nav.home": "હોમ",
    "nav.cropAdvisor": "પાક સલાહકાર",
    "nav.voiceChat": "વૉઇસ ચેટ",
    "nav.language": "ભાષા",

    "status.checking": "બેકએન્ડ તપાસી રહ્યા છીએ…",
    "status.down": "બેકએન્ડ ઉપલબ્ધ નથી. કેટલીક સુવિધાઓ કામ નહીં કરે.",
    "status.degraded": "બેકએન્ડ ચાલુ છે (degraded). કેટલીક સુવિધાઓ કામ નહીં કરે.",

    "home.badge": "એઆઈ આધારિત • હવામાન-જાગૃત • માટી સ્માર્ટ",
    "home.title": "એઆઈથી વધુ સારી પાક ભલામણ મેળવો.",
    "home.subtitle":
      "તમારી માટી અને હવામાનની માહિતી ભરો અને ઉપજ તથા સ્થિરતાને ધ્યાનમાં રાખી પાક સૂચન મેળવો.",
    "home.cta": "ભલામણ મેળવો",
    "home.howItWorks": "આ કેવી રીતે કામ કરે છે",
    "home.card1.title": "માટીનાં પોષક તત્ત્વો",
    "home.card1.text": "N, P, K, pH અને વરસાદ ઇનપુટ્સ.",
    "home.card2.title": "જલવાયુ સંકેતો",
    "home.card2.text": "તાપમાન અને ભેજના ટ્રેન્ડ્સ.",
    "home.card3.title": "કાર્યકારી પરિણામ",
    "home.card3.text": "સ્પષ્ટ પાક ભલામણ.",

    "form.title": "પાક ભલામણ",
    "form.subtitle": "માટી અને હવામાનના મૂલ્યો ભરો.",
    "form.submit": "ભલામણ મેળવો",
    "form.loading": "વિનંતી મોકલી રહ્યા છીએ…",
    "form.validation.required": "કૃપા કરીને બધા જરૂરી આંકડાકીય ફીલ્ડ્સ ભરો.",
    "form.validation.number": "કૃપા કરીને માન્ય આંકડો દાખલ કરો.",
    "form.error.invalid": "અમાન્ય ઇનપુટ. કૃપા કરીને મૂલ્યો તપાસો.",
    "form.error.backend": "બેકએન્ડ ઉપલબ્ધ નથી",

    "field.N": "નાઇટ્રોજન (N)",
    "field.P": "ફોસ્ફોરસ (P)",
    "field.K": "પોટેશિયમ (K)",
    "field.temperature": "તાપમાન (°C)",
    "field.humidity": "ભેજ (%)",
    "field.rainfall": "વરસાદ (mm)",
    "field.ph": "માટી pH",
    "field.last_crop": "પાછલી પાક (વૈકલ્પિક)",

    "placeholder.num": "ઉદા. 60",
    "placeholder.temp": "ઉદા. 26",
    "placeholder.humidity": "ઉદા. 70",
    "placeholder.rainfall": "ઉદા. 110",
    "placeholder.ph": "ઉદા. 6.8",
    "placeholder.last_crop": "ઉદા. ધાન",

    "result.recommended": "ભલામણ કરેલો પાક",
    "result.source": "સ્ત્રોત",

    "input.stepUp": "મૂલ્ય વધારો",
    "input.stepDown": "મૂલ્ય ઘટાડો",

    "voice.greeting": "નમસ્તે! સંદેશ લખો અથવા માઇક્રોફોન વડે બોલો.",
    "voice.title": "વૉઇસ ચેટ",
    "voice.ready": "તૈયાર",
    "voice.listening": "સાંભળી રહ્યા છીએ…",
    "voice.speaking": "બોલી રહ્યા છીએ…",
    "voice.placeholder": "તમારો સંદેશ લખો…",
    "voice.send": "મોકલો",
    "voice.micStart": "સાંભળવાનું શરૂ કરો",
    "voice.micStop": "સાંભળવું બંધ કરો",
    "voice.unsupported": "આ બ્રાઉઝરમાં સ્પીચ રિકગ્નિશન સપોર્ટ નથી. Chrome વાપરો.",
    "voice.micPermission": "માઇક્રોફોન શરૂ ન થઈ શક્યો. પરવાનગી તપાસો અને ફરી પ્રયાસ કરો.",
    "voice.aiUnavailable": "AI સેવા ઉપલબ્ધ નથી. Ollama શરૂ કરો અને ફરી પ્રયાસ કરો.",
  },
};

export function translate(lang, key) {
  const table = translations[lang] ?? translations[DEFAULT_LANG];
  return table?.[key] ?? translations[DEFAULT_LANG]?.[key] ?? key;
}
