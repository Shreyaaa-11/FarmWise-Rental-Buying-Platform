import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'kn';

type TranslationContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string) => string;
  isLoading: boolean;
};

const translations: Record<string, Record<string, string>> = {
  // Common phrases
  'Home': { kn: 'ಮುಖಪುಟ' },
  'Products': { kn: 'ಉತ್ಪನ್ನಗಳು' },
  'About': { kn: 'ನಮ್ಮ ಬಗ್ಗೆ' },
  'Login': { kn: 'ಲಾಗಿನ್' },
  'Logout': { kn: 'ಲಾಗ್ಔಟ್' },
  'Cart': { kn: 'ಕಾರ್ಟ್' },
  'Search': { kn: 'ಹುಡುಕಿ' },
  'Price': { kn: 'ಬೆಲೆ' },
  
  // Home page content
  'Quality Farming Equipment for Sale & Rent': { kn: 'ಮಾರಾಟ ಮತ್ತು ಬಾಡಿಗೆಗೆ ಗುಣಮಟ್ಟದ ಕೃಷಿ ಉಪಕರಣಗಳು' },
  'FarmGear provides high-quality agricultural equipment for farms of all sizes. Buy or rent the tools you need to maximize your productivity.': 
    { kn: 'ಫಾರ್ಮ್‌ಗೇರ್ ಎಲ್ಲಾ ಗಾತ್ರದ ಕೃಷಿ ಕ್ಷೇತ್ರಗಳಿಗೆ ಉನ್ನತ ಗುಣಮಟ್ಟದ ಕೃಷಿ ಉಪಕರಣಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ. ನಿಮ್ಮ ಉತ್ಪಾದಕತೆಯನ್ನು ಹೆಚ್ಚಿಸಲು ನಿಮಗೆ ಅಗತ್ಯವಿರುವ ಉಪಕರಣಗಳನ್ನು ಖರೀದಿಸಿ ಅಥವಾ ಬಾಡಿಗೆಗೆ ಪಡೆಯಿರಿ.' },
  'Browse Products': { kn: 'ಉತ್ಪನ್ನಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ' },
  'Learn More': { kn: 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ' },
  'Featured Equipment': { kn: 'ವಿಶೇಷ ಉಪಕರಣಗಳು' },
  'Explore our top selling agricultural equipment': { kn: 'ನಮ್ಮ ಅತಿ ಹೆಚ್ಚು ಮಾರಾಟವಾಗುವ ಕೃಷಿ ಉಪಕರಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ' },
  'View All Products': { kn: 'ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳನ್ನು ವೀಕ್ಷಿಸಿ' },
  
  // Other content
  'Why Choose FarmGear?': { kn: 'ಫಾರ್ಮ್‌ಗೇರ್ ಅನ್ನು ಏಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು?' },
  'Trusted by farmers across the country': { kn: 'ದೇಶಾದ್ಯಂತ ರೈತರಿಂದ ವಿಶ್ವಾಸಾರ್ಹ' },
  'Quality Equipment': { kn: 'ಗುಣಮಟ್ಟದ ಉಪಕರಣಗಳು' },
  'We offer only the best brands and most reliable equipment for your farming needs.': 
    { kn: 'ನಿಮ್ಮ ಕೃಷಿ ಅವಶ್ಯಕತೆಗಳಿಗಾಗಿ ನಾವು ಅತ್ಯುತ್ತಮ ಬ್ರ್ಯಾಂಡ್‌ಗಳು ಮತ್ತು ಅತ್ಯಂತ ವಿಶ್ವಾಸಾರ್ಹ ಉಪಕರಣಗಳನ್ನು ಮಾತ್ರ ನೀಡುತ್ತೇವೆ.' },
  'Buy or Rent': { kn: 'ಖರೀದಿಸಿ ಅಥವಾ ಬಾಡಿಗೆಗೆ ಪಡೆಯಿರಿ' },
  'Flexibility to purchase outright or rent equipment for your specific seasonal needs.': 
    { kn: 'ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಋತುವಿನ ಅಗತ್ಯಗಳಿಗಾಗಿ ಉಪಕರಣಗಳನ್ನು ನೇರವಾಗಿ ಖರೀದಿಸಲು ಅಥವಾ ಬಾಡಿಗೆಗೆ ಪಡೆಯಲು ನಮ್ಮಲ್ಲಿ ಸೌಲಭ್ಯವಿದೆ.' },
  'Expert Support': { kn: 'ತಜ್ಞರ ಬೆಂಬಲ' },
  'Our team of agricultural experts is always available to help you choose the right equipment.': 
    { kn: 'ಸರಿಯಾದ ಉಪಕರಣಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ನಮ್ಮ ಕೃಷಿ ತಜ್ಞರ ತಂಡವು ಯಾವಾಗಲೂ ಲಭ್ಯವಿದೆ.' },
  
  // Other phrases
  'or rent for': { kn: 'ಅಥವಾ ಬಾಡಿಗೆಗೆ' },
  '/day': { kn: '/ದಿನ' },
  'Loading featured products...': { kn: 'ವಿಶೇಷ ಉತ್ಪನ್ನಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' },

  // Chatbot related
  'FarmGear Assistant': { kn: 'ಫಾರ್ಮ್‌ಗೇರ್ ಸಹಾಯಕ' },
  'Type your message...': { kn: 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...' },
  'Hello! How can I help you with farming equipment today?': { kn: 'ನಮಸ್ಕಾರ! ಇಂದು ಕೃಷಿ ಉಪಕರಣಗಳ ಬಗ್ಗೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' },
  'Thank you for your question about our farming equipment.': { kn: 'ನಮ್ಮ ಕೃಷಿ ಉಪಕರಣಗಳ ಬಗ್ಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಧನ್ಯವಾದಗಳು.' },
  'We have a wide range of tractors and harvesters available for both purchase and rent.': { kn: 'ಖರೀದಿ ಮತ್ತು ಬಾಡಿಗೆಗೆ ವ್ಯಾಪಕ ಶ್ರೇಣಿಯ ಟ್ರ್ಯಾಕ್ಟರ್‌ಗಳು ಮತ್ತು ಹಾರ್ವೆಸ್ಟರ್‌ಗಳನ್ನು ನಾವು ಹೊಂದಿದ್ದೇವೆ.' },
  'Would you like to know more about our special offers on agricultural machinery?': { kn: 'ಕೃಷಿ ಯಂತ್ರಗಳ ಮೇಲೆ ನಮ್ಮ ವಿಶೇಷ ಕೊಡುಗೆಗಳ ಬಗ್ಗೆ ನೀವು ಹೆಚ್ಚಿನ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಬಯಸುವಿರಾ?' },
  'Our experts are available for consultation on the right equipment for your farm size.': { kn: 'ನಿಮ್ಮ ಕೃಷಿಕ್ಷೇತ್ರದ ಗಾತ್ರಕ್ಕೆ ಸರಿಯಾದ ಉಪಕರಣಗಳ ಬಗ್ಗೆ ಸಮಾಲೋಚನೆಗಾಗಿ ನಮ್ಮ ತಜ್ಞರು ಲಭ್ಯವಿದ್ದಾರೆ.' },

  // Footer
  'All rights reserved.': { kn: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.' },

  // Currency
  'Total Amount': { kn: 'ಒಟ್ಟು ಮೊತ್ತ' },
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);

  const translate = (text: string): string => {
    if (language === 'en') return text;
    
    if (translations[text]?.[language]) {
      return translations[text][language];
    }
    
    return text; // Fallback to English if translation not found
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translate, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
