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
  'Description': { kn: 'ವಿವರಣೆ' },
  'Checkout': { kn: 'ಚೆಕ್‌ಔಟ್' },
  'Contact': { kn: 'ಸಂಪರ್ಕ' },
  'Email': { kn: 'ಇಮೇಲ್' },
  'Password': { kn: 'ಪಾಸ್‌ವರ್ಡ್' },
  'Sign Up': { kn: 'ಸೈನ್ ಅಪ್' },
  'Forgot Password': { kn: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದೆಯೇ?' },
  'Submit': { kn: 'ಸಲ್ಲಿಕೆ' },
  'Cancel': { kn: 'ರದ್ದುಮಾಡಿ' },
  'Save': { kn: 'ಉಳಿಸಿ' },
  'Delete': { kn: 'ಅಳಿಸಿ' },
  'Edit': { kn: 'ಸಂಪಾದಿಸಿ' },
  'Update': { kn: 'ನವೀಕರಿಸಿ' },
  'Loading': { kn: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ' },
  'Error': { kn: 'ದೋಷ' },
  'Success': { kn: 'ಯಶಸ್ವಿ' },
  'Warning': { kn: 'ಎಚ್ಚರಿಕೆ' },
  'Info': { kn: 'ಮಾಹಿತಿ' },
  
  // Home page content
  'Quality Farming Equipment for Sale & Rent': { kn: 'ಮಾರಾಟ ಮತ್ತು ಬಾಡಿಗೆಗೆ ಗುಣಮಟ್ಟದ ಕೃಷಿ ಉಪಕರಣಗಳು' },
  'FarmWise provides high-quality agricultural equipment for farms of all sizes. Buy or rent the tools you need to maximize your productivity.': 
    { kn: 'ಫಾರ್ಮ್‌ವೈಸ್ ಎಲ್ಲಾ ಗಾತ್ರದ ಕೃಷಿ ಕ್ಷೇತ್ರಗಳಿಗೆ ಉನ್ನತ ಗುಣಮಟ್ಟದ ಕೃಷಿ ಉಪಕರಣಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ. ನಿಮ್ಮ ಉತ್ಪಾದಕತೆಯನ್ನು ಹೆಚ್ಚಿಸಲು ನಿಮಗೆ ಅಗತ್ಯವಿರುವ ಉಪಕರಣಗಳನ್ನು ಖರೀದಿಸಿ ಅಥವಾ ಬಾಡಿಗೆಗೆ ಪಡೆಯಿರಿ.' },
  'Browse Products': { kn: 'ಉತ್ಪನ್ನಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ' },
  'Learn More': { kn: 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ' },
  'Featured Equipment': { kn: 'ವಿಶೇಷ ಉಪಕರಣಗಳು' },
  'Explore our top selling agricultural equipment': { kn: 'ನಮ್ಮ ಅತಿ ಹೆಚ್ಚು ಮಾರಾಟವಾಗುವ ಕೃಷಿ ಉಪಕರಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ' },
  'View All Products': { kn: 'ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳನ್ನು ವೀಕ್ಷಿಸಿ' },
  'Loading featured products...': { kn: 'ವಿಶೇಷ ಉತ್ಪನ್ನಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' },
  
  // Product related
  'Product Details': { kn: 'ಉತ್ಪನ್ನ ವಿವರಗಳು' },
  'Available for Sale': { kn: 'ಮಾರಾಟಕ್ಕೆ ಲಭ್ಯ' },
  'Available for Rent': { kn: 'ಬಾಡಿಗೆಗೆ ಲಭ್ಯ' },
  'Rental Price per Day': { kn: 'ದಿನಕ್ಕೆ ಬಾಡಿಗೆ ಬೆಲೆ' },
  'Add to Cart': { kn: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ' },
  'Remove from Cart': { kn: 'ಕಾರ್ಟ್‌ನಿಂದ ತೆಗೆದುಹಾಕಿ' },
  'Quantity': { kn: 'ಪರಿಮಾಣ' },
  'Total': { kn: 'ಒಟ್ಟು' },
  'Subtotal': { kn: 'ಉಪ-ಒಟ್ಟು' },
  'Tax': { kn: 'ತೆರಿಗೆ' },
  'Shipping': { kn: 'ಸಾಗಣೆ' },
  'Order Summary': { kn: 'ಆರ್ಡರ್ ಸಾರಾಂಶ' },
  'Proceed to Checkout': { kn: 'ಚೆಕ್‌ಔಟ್‌ಗೆ ಮುಂದುವರಿಸಿ' },
  'Your Cart is Empty': { kn: 'ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ' },
  'Continue Shopping': { kn: 'ಖರೀದಿಯನ್ನು ಮುಂದುವರಿಸಿ' },
  
  // About page
  'Our Story': { kn: 'ನಮ್ಮ ಕಥೆ' },
  'Our Mission': { kn: 'ನಮ್ಮ ಧ್ಯೇಯ' },
  'Our Vision': { kn: 'ನಮ್ಮ ದೃಷ್ಟಿ' },
  'Our Values': { kn: 'ನಮ್ಮ ಮೌಲ್ಯಗಳು' },
  'Customer Support': { kn: 'ಗ್ರಾಹಕ ಬೆಂಬಲ' },
  'Contact Us': { kn: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ' },
  'Address': { kn: 'ವಿಳಾಸ' },
  'Phone': { kn: 'ಫೋನ್' },
  'Message': { kn: 'ಸಂದೇಶ' },
  'Send Message': { kn: 'ಸಂದೇಶ ಕಳುಹಿಸಿ' },
  
  // Authentication
  'Welcome Back': { kn: 'ಮತ್ತೆ ಸ್ವಾಗತ' },
  'Create Account': { kn: 'ಖಾತೆ ರಚಿಸಿ' },
  'Already have an account?': { kn: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?' },
  'Don\'t have an account?': { kn: 'ಖಾತೆ ಇಲ್ಲವೇ?' },
  'Reset Password': { kn: 'ಪಾಸ್‌ವರ್ಡ್ ರೀಸೆಟ್' },
  'Enter your email to reset your password': { kn: 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ರೀಸೆಟ್ ಮಾಡಲು ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ' },
  
  // Features and Benefits
  'Why Choose FarmWise?': { kn: 'ಫಾರ್ಮ್‌ವೈಸ್ ಅನ್ನು ಏಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು?' },
  'Trusted by farmers across the country': { kn: 'ದೇಶಾದ್ಯಂತ ರೈತರಿಂದ ವಿಶ್ವಾಸಾರ್ಹ' },
  'Quality Equipment': { kn: 'ಗುಣಮಟ್ಟದ ಉಪಕರಣಗಳು' },
  'We offer only the best brands and most reliable equipment for your farming needs.': 
    { kn: 'ನಿಮ್ಮ ಕೃಷಿ ಅವಶ್ಯಕತೆಗಳಿಗಾಗಿ ನಾವು ಅತ್ಯುತ್ತಮ ಬ್ರ್ಯಾಂಡ್‌ಗಳು ಮತ್ತು ಅತ್ಯಂತ ವಿಶ್ವಾಸಾರ್ಹ ಉಪಕರಣಗಳನ್ನು ಮಾತ್ರ ನೀಡುತ್ತೇವೆ.' },
  'Buy or Rent': { kn: 'ಖರೀದಿಸಿ ಅಥವಾ ಬಾಡಿಗೆಗೆ ಪಡೆಯಿರಿ' },
  'Flexibility to purchase outright or rent equipment for your specific seasonal needs.': 
    { kn: 'ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಋತುವಿನ ಅಗತ್ಯಗಳಿಗಾಗಿ ಉಪಕರಣಗಳನ್ನು ನೇರವಾಗಿ ಖರೀದಿಸಲು ಅಥವಾ ಬಾಡಿಗೆಗೆ ಪಡೆಯಲು ನಮ್ಮಲ್ಲಿ ಸೌಲಭ್ಯವಿದ್ದಾರೆ.' },
  'Expert Support': { kn: 'ತಜ್ಞರ ಬೆಂಬಲ' },
  'Our team of agricultural experts is always available to help you choose the right equipment.': 
    { kn: 'ಸರಿಯಾದ ಉಪಕರಣಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ನಮ್ಮ ಕೃಷಿ ತಜ್ಞರ ತಂಡವು ಯಾವಾಗಲೂ ಲಭ್ಯವಿದ್ದಾರೆ.' },
  
  // Footer
  'All rights reserved.': { kn: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.' },
  'Privacy Policy': { kn: 'ಗೌಪ್ಯತೆ ನೀತಿ' },
  'Terms of Service': { kn: 'ಸೇವೆಯ ನಿಯಮಗಳು' },
  'Cookie Policy': { kn: 'ಕುಕೀ ನೀತಿ' },
  'Follow Us': { kn: 'ನಮ್ಮನ್ನು ಅನುಸರಿಸಿ' },
  'Newsletter': { kn: 'ಸುದ್ದಿಪತ್ರ' },
  'Subscribe': { kn: 'ಚಂದಾದಾರರಾಗಿ' },
  
  // Currency and Numbers
  'Total Amount': { kn: 'ಒಟ್ಟು ಮೊತ್ತ' },
  'per day': { kn: 'ದಿನಕ್ಕೆ' },
  'days': { kn: 'ದಿನಗಳು' },
  'day': { kn: 'ದಿನ' },
  'week': { kn: 'ವಾರ' },
  'month': { kn: 'ತಿಂಗಳು' },
  'year': { kn: 'ವರ್ಷ' },
  
  // Status Messages
  'Successfully added to cart': { kn: 'ಯಶಸ್ವಿಯಾಗಿ ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಲಾಗಿದೆ' },
  'Successfully removed from cart': { kn: 'ಯಶಸ್ವಿಯಾಗಿ ಕಾರ್ಟ್‌ನಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ' },
  'Order placed successfully': { kn: 'ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿ ಇರಿಸಲಾಗಿದೆ' },
  'Payment successful': { kn: 'ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ' },
  'Something went wrong': { kn: 'ಏನೋ ತಪ್ಪಾಗಿದೆ' },
  'Please try again': { kn: 'ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' },
  
  // Form Labels
  'Full Name': { kn: 'ಪೂರ್ಣ ಹೆಸರು' },
  'Phone Number': { kn: 'ಫೋನ್ ಸಂಖ್ಯೆ' },
  'Address Line 1': { kn: 'ವಿಳಾಸ ಸಾಲು 1' },
  'Address Line 2': { kn: 'ವಿಳಾಸ ಸಾಲು 2' },
  'City': { kn: 'ನಗರ' },
  'State': { kn: 'ರಾಜ್ಯ' },
  'Postal Code': { kn: 'ಪೋಸ್ಟಲ್ ಕೋಡ್' },
  'Country': { kn: 'ದೇಶ' },
  
  // Product Categories
  'Tractors': { kn: 'ಟ್ರ್ಯಾಕ್ಟರ್‌ಗಳು' },
  'Harvesters': { kn: 'ಹಾರ್ವೆಸ್ಟರ್‌ಗಳು' },
  'Plows': { kn: 'ನೇಗಿಲುಗಳು' },
  'Seeders': { kn: 'ಬೀಜ ಬಿತ್ತುವ ಯಂತ್ರಗಳು' },
  'Irrigation Equipment': { kn: 'ನೀರಾವರಿ ಉಪಕರಣಗಳು' },
  'Sprayers': { kn: 'ಸಿಂಪಡಿಸುವ ಯಂತ್ರಗಳು' },
  'Other Equipment': { kn: 'ಇತರ ಉಪಕರಣಗಳು' },
  
  // Product Features
  'Brand': { kn: 'ಬ್ರ್ಯಾಂಡ್' },
  'Model': { kn: 'ಮಾದರಿ' },
  'Year': { kn: 'ವರ್ಷ' },
  'Condition': { kn: 'ಸ್ಥಿತಿ' },
  'Hours Used': { kn: 'ಬಳಸಿದ ಗಂಟೆಗಳು' },
  'Warranty': { kn: 'ಖಾತರಿ' },
  'Specifications': { kn: 'ವಿಶೇಷಣಗಳು' },
  'Features': { kn: 'ವೈಶಿಷ್ಟ್ಯಗಳು' },
  
  // Search and Filter
  'Search Products': { kn: 'ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ' },
  'Filter By': { kn: 'ಫಿಲ್ಟರ್ ಮಾಡಿ' },
  'Sort By': { kn: 'ವಿಂಗಡಿಸಿ' },
  'Price Range': { kn: 'ಬೆಲೆ ವ್ಯಾಪ್ತಿ' },
  'Availability': { kn: 'ಲಭ್ಯತೆ' },
  'Category': { kn: 'ವರ್ಗ' },
  'Clear Filters': { kn: 'ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ' },
  
  // Reviews and Ratings
  'Reviews': { kn: 'ವಿಮರ್ಶೆಗಳು' },
  'Rating': { kn: 'ರೇಟಿಂಗ್' },
  'Write a Review': { kn: 'ವಿಮರ್ಶೆ ಬರೆಯಿರಿ' },
  'Your Review': { kn: 'ನಿಮ್ಮ ವಿಮರ್ಶೆ' },
  'Submit Review': { kn: 'ವಿಮರ್ಶೆ ಸಲ್ಲಿಕೆ' },
  'No reviews yet': { kn: 'ಇನ್ನೂ ಯಾವುದೇ ವಿಮರ್ಶೆಗಳಿಲ್ಲ' },
  
  // Chatbot related
  'FarmWise Assistant': { kn: 'ಫಾರ್ಮ್‌ವೈಸ್ ಸಹಾಯಕ' },
  'Type your message...': { kn: 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...' },
  'Hello! How can I help you with farming equipment today?': { kn: 'ನಮಸ್ಕಾರ! ಇಂದು ಕೃಷಿ ಉಪಕರಣಗಳ ಬಗ್ಗೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' },
  'Thank you for your question about our farming equipment.': { kn: 'ನಮ್ಮ ಕೃಷಿ ಉಪಕರಣಗಳ ಬಗ್ಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಧನ್ಯವಾದಗಳು.' },
  'We have a wide range of tractors and harvesters available for both purchase and rent.': { kn: 'ಖರೀದಿ ಮತ್ತು ಬಾಡಿಗೆಗೆ ವ್ಯಾಪಕ ಶ್ರೇಣಿಯ ಟ್ರ್ಯಾಕ್ಟರ್‌ಗಳು ಮತ್ತು ಹಾರ್ವೆಸ್ಟರ್‌ಗಳನ್ನು ನಾವು ಹೊಂದಿದ್ದೇವೆ.' },
  'Would you like to know more about our special offers on agricultural machinery?': { kn: 'ಕೃಷಿ ಯಂತ್ರಗಳ ಮೇಲೆ ನಮ್ಮ ವಿಶೇಷ ಕೊಡುಗೆಗಳ ಬಗ್ಗೆ ನೀವು ಹೆಚ್ಚಿನ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಬಯಸುವಿರಾ?' },
  'Our experts are available for consultation on the right equipment for your farm size.': { kn: 'ನಿಮ್ಮ ಕೃಷಿಕ್ಷೇತ್ರದ ಗಾತ್ರಕ್ಕೆ ಸರಿಯಾದ ಉಪಕರಣಗಳ ಬಗ್ಗೆ ಸಮಾಲೋಚನೆಗಾಗಿ ನಮ್ಮ ತಜ್ಞರು ಲಭ್ಯವಿದ್ದಾರೆ.' },
  
  // Products page specific
  'All Categories': { kn: 'ಎಲ್ಲಾ ವರ್ಗಗಳು' },
  'Search products...': { kn: 'ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ...' },
  'products found': { kn: 'ಉತ್ಪನ್ನಗಳು ಕಂಡುಬಂದಿವೆ' },
  'Loading products...': { kn: 'ಉತ್ಪನ್ನಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' },
  'Rent': { kn: 'ಬಾಡಿಗೆ' },
  'In Stock': { kn: 'ದಾಸ್ತಾನಿನಲ್ಲಿದೆ' },
  'Out of Stock': { kn: 'ದಾಸ್ತಾನಿನಲ್ಲಿ ಇಲ್ಲ' },
  'View Details': { kn: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ' },
  'No products found matching your criteria.': { kn: 'ನಿಮ್ಮ ಮಾನದಂಡಗಳಿಗೆ ಹೊಂದುವ ಯಾವುದೇ ಉತ್ಪನ್ನಗಳು ಕಂಡುಬಂದಿಲ್ಲ.' },
  
  // Product Details page specific
  'Loading product details...': { kn: 'ಉತ್ಪನ್ನದ ವಿವರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' },
  'Product Not Found': { kn: 'ಉತ್ಪನ್ನ ಕಂಡುಬಂದಿಲ್ಲ' },
  'The product you are looking for does not exist.': { kn: 'ನೀವು ಹುಡುಕುತ್ತಿರುವ ಉತ್ಪನ್ನವು ಅಸ್ತಿತ್ವದಲ್ಲಿಲ್ಲ.' },
  'available': { kn: 'ಲಭ್ಯವಿದೆ' },
  'Purchase Options': { kn: 'ಖರೀದಿ ಆಯ್ಕೆಗಳು' },
  'Buy': { kn: 'ಖರೀದಿಸಿ' },
  'Own this equipment for your farm permanently.': { kn: 'ಈ ಉಪಕರಣವನ್ನು ನಿಮ್ಮ ಕೃಷಿಗಾಗಿ ಶಾಶ್ವತವಾಗಿ ಹೊಂದಿರಿ.' },
  'Rent this equipment for your seasonal needs.': { kn: 'ನಿಮ್ಮ ಋತುವಿನ ಅಗತ್ಯಗಳಿಗಾಗಿ ಈ ಉಪಕರಣವನ್ನು ಬಾಡಿಗೆಗೆ ಪಡೆಯಿರಿ.' },
  'Added to cart: ': { kn: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಲಾಗಿದೆ: ' },
  'Looks like you havent added any items to your cart yet.': { kn: 'ನೀವು ಇನ್ನೂ ನಿಮ್ಮ ಕಾರ್ಟ್‌ಗೆ ಯಾವುದೇ ವಸ್ತುಗಳನ್ನು ಸೇರಿಸಿಲ್ಲ ಎಂದು ತೋರುತ್ತದೆ.' },
  
  'Shopping Cart': { kn: 'ಶಾಪಿಂಗ್ ಕಾರ್ಟ್' },
  'Rental': { kn: 'ಬಾಡಿಗೆ' },
  'Purchase': { kn: 'ಖರೀದಿ' },
  'Remove': { kn: 'ತೆಗೆದುಹಾಕಿ' },
  'Calculated at checkout': { kn: 'ಚೆಕ್‌ಔಟ್‌ನಲ್ಲಿ ಲೆಕ್ಕ ಮಾಡಲಾಗುತ್ತದೆ' },
  ' Total': { kn: 'ಒಟ್ಟು' },
  ' Proceed to Checkout': { kn: 'ಚೆಕ್‌ಔಟ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ' },
  ' Continue Shopping': { kn: 'ಶಾಪಿಂಗ್ ಮುಂದುವರಿಸಿ' },
  'FarmWise. All rights reserved.': { kn: 'ಫಾರ್ಮ್‌ವೈಸ್. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.' },
  'Payment Details': { kn: 'ಪಾವತಿ ವಿವರಗಳು' },
  'Please enter your payment information to complete your purchase.': { kn: 'ನಿಮ್ಮ ಖರೀದಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ನಿಮ್ಮ ಪಾವತಿ ಮಾಹಿತಿಯನ್ನು ನಮೂದಿಸಿ.' },
  'Name on Card': { kn: 'ಕಾರ್ಡ್‌ನಲ್ಲಿರುವ ಹೆಸರು' },
  'John Doe': { kn: 'ಜಾನ್ ಡೋ' },
  'Card Number': { kn: 'ಕಾರ್ಡ್ ಸಂಖ್ಯೆ' },
  'Expiry Date': { kn: 'ಅವಧಿ ಮುಗಿಯುವ ದಿನಾಂಕ' },
  'MM/YY': { kn: 'ತಿಂಗಳು/ವರ್ಷ' },
  'CVC': { kn: 'ಸಿವಿಸಿ' },
  'Pay Now (Coming Soon)': { kn: 'ಈಗ ಪಾವತಿಸಿ (ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ)' },
  'Stripe integration will be added soon.': { kn: 'ಸ್ಟ್ರೈಪ್ ಏಕೀಕರಣವನ್ನು ಶೀಘ್ರದಲ್ಲೇ ಸೇರಿಸಲಾಗುವುದು.' },
  "404 Error: User attempted to access non-existent route:": {
    kn: "404 ದೋಷ: ಬಳಕೆದಾರರು ಅಸ್ತಿತ್ವದಲ್ಲಿಲ್ಲದ ಮಾರ್ಗವನ್ನು ಪ್ರವೇಶಿಸಲು ಪ್ರಯತ್ನಿಸಿದರು:"
  },
  "Oops! Page not found": {
    kn: "ಅಯ್ಯೋ! ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ"
  },
  "Return to Home": {
    kn: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ"
  },
  "Login or create an account to continue": {
    kn: "ಮುಂದುವರಿಯಲು ಲಾಗಿನ್ ಮಾಡಿ ಅಥವಾ ಖಾತೆಯನ್ನು ರಚಿಸಿ"
  },
  " Login": {
    kn: "ಲಾಗಿನ್"
  },
  "Register": {
    kn: "ನೋಂದಣಿ"
  },
  "Enter your email": {
    kn: "ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ"
  },
  "Enter your password": {
    kn: "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ"
  },
  "Logging in...": {
    kn: "ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ..."
  },
  "Confirm Password": {
    kn: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ"
  },
  "Confirm your password": {
    kn: "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ"
  },
  "Creating Account...": {
    kn: "ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ..."
  },
  " Create Account": {
    kn: "ಖಾತೆ ರಚಿಸಿ"
  },
  "By continuing, you agree to our Terms of Service and Privacy Policy": {
    kn: "ಮುಂದುವರಿಯುವ ಮೂಲಕ, ನಮ್ಮ ಸೇವಾ ನಿಯಮಗಳು ಮತ್ತು ಗೌಪ್ಯತಾ ನೀತಿಗೆ ನೀವು ಒಪ್ಪುತ್ತೀರಿ"
  },
  "Invalid email address": {
    kn: "ಅಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸ"
  },
  "Password must be at least 6 characters": {
    kn: "ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು"
  },
  "Passwords do not match": {
    kn: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ"
  },
  "About FarmWise": {
    kn: "ಫಾರ್ಮ್‌ವೈಸ್ ಬಗ್ಗೆ"
  },
  "Supporting farmers with quality equipment since 1985": {
    kn: "1985 ರಿಂದ ಗುಣಮಟ್ಟದ ಉಪಕರಣಗಳೊಂದಿಗೆ ರೈತರಿಗೆ ಬೆಂಬಲ"
  },
  "FarmWise was founded in 1985 by John and Mary Smith, two farmers who saw a need for high-quality, affordable agricultural equipment in their community.": {
    kn: "ಫಾರ್ಮ್‌ವೈಸ್ ಅನ್ನು 1985 ರಲ್ಲಿ ಜಾನ್ ಮತ್ತು ಮೇರಿ ಸ್ಮಿತ್ ಅವರು ಸ್ಥಾಪಿಸಿದರು, ಅವರು ತಮ್ಮ ಸಮುದಾಯದಲ್ಲಿ ಹೆಚ್ಚಿನ ಗುಣಮಟ್ಟದ, ಕೈಗೆಟುಕುವ ಕೃಷಿ ಉಪಕರಣಗಳ ಅಗತ್ಯವನ್ನು ಕಂಡರು."
  },
  "What started as a small shop selling basic farm tools has grown into a comprehensive agricultural equipment supplier, serving farmers across the country with both sales and rental options.": {
    kn: "ಮೂಲ ಕೃಷಿ ಉಪಕರಣಗಳನ್ನು ಮಾರಾಟ ಮಾಡುವ ಸಣ್ಣ ಅಂಗಡಿಯಾಗಿ ಪ್ರಾರಂಭವಾದುದು ಈಗ ದೇಶದಾದ್ಯಂತ ರೈತರಿಗೆ ಮಾರಾಟ ಮತ್ತು ಬಾಡಿಗೆ ಆಯ್ಕೆಗಳೊಂದಿಗೆ ಸೇವೆ ಸಲ್ಲಿಸುವ ಸಮಗ್ರ ಕೃಷಿ ಉಪಕರಣ ಪೂರೈಕೆದಾರರಾಗಿ ಬೆಳೆದಿದೆ."
  },
  "Our mission is to provide farmers with access to the tools they need to succeed, regardless of the size of their operation or their budget constraints.": {
    kn: "ಅವರ ಕಾರ್ಯಾಚರಣೆಯ ಗಾತ್ರ ಅಥವಾ ಬಜೆಟ್ ನಿರ್ಬಂಧಗಳನ್ನು ಲೆಕ್ಕಿಸದೆ, ರೈತರಿಗೆ ಯಶಸ್ವಿಯಾಗಲು ಅಗತ್ಯವಿರುವ ಉಪಕರಣಗಳಿಗೆ ಪ್ರವೇಶವನ್ನು ಒದಗಿಸುವುದು ನಮ್ಮ ಧ್ಯೇಯವಾಗಿದೆ."
  },
  "Farmers with equipment": {
    kn: "ಉಪಕರಣಗಳೊಂದಿಗೆ ರೈತರು"
  },
  "Quality": {
    kn: "ಗುಣಮಟ್ಟ"
  },
  "We only stock equipment from trusted manufacturers known for durability and performance.": {
    kn: "ನಾವು ಕೇವಲ ಬಾಳಿಕೆ ಮತ್ತು ಕಾರ್ಯಕ್ಷಮತೆಗಾಗಿ ಹೆಸರುವಾಸಿಯಾದ ವಿಶ್ವಾಸಾರ್ಹ ತಯಾರಕರಿಂದ ಉಪಕರಣಗಳನ್ನು ಸಂಗ್ರಹಿಸುತ್ತೇವೆ."
  },
  "Accessibility": {
    kn: "ಪ್ರವೇಶ್ಯತೆ"
  },
  "Our buy and rent options make quality equipment accessible to farms of all sizes.": {
    kn: "ನಮ್ಮ ಖರೀದಿ ಮತ್ತು ಬಾಡಿಗೆ ಆಯ್ಕೆಗಳು ಎಲ್ಲ ಗಾತ್ರದ ಕೃಷಿ ಜಮೀನುಗಳಿಗೆ ಗುಣಮಟ್ಟದ ಉಪಕರಣಗಳನ್ನು ಪ್ರವೇಶಿಸಬಹುದಾಗಿಸುತ್ತವೆ."
  },
  "Service": {
    kn: "ಸೇವೆ"
  },
  "Our knowledgeable staff provides expert advice and support for all your farming needs.": {
    kn: "ನಮ್ಮ ತಜ್ಞ ಸಿಬ್ಬಂದಿ ನಿಮ್ಮ ಎಲ್ಲಾ ಕೃಷಿ ಅಗತ್ಯಗಳಿಗಾಗಿ ತಜ್ಞರ ಸಲಹೆ ಮತ್ತು ಬೆಂಬಲವನ್ನು ಒದಗಿಸುತ್ತಾರೆ."
  },
  "Our Team": {
    kn: "ನಮ್ಮ ತಂಡ"
  },
  "Founder": {
    kn: "ಸ್ಥಾಪಕ"
  },
  "Co-Founder": {
    kn: "ಸಹ-ಸ್ಥಾಪಕ"
  },
  "Sales Manager": {
    kn: "ಮಾರಾಟ ವ್ಯವಸ್ಥಾಪಕ"
  },
  " Customer Support": {
    kn: "ಗ್ರಾಹಕ ಬೆಂಬಲ"
  },
  " Contact Us": {
    kn: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ"
  },
  "Have questions about our products or services? Our team is here to help!": {
    kn: "ನಮ್ಮ ಉತ್ಪನ್ನಗಳು ಅಥವಾ ಸೇವೆಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳಿದ್ದೀರಾ? ನಮ್ಮ ತಂಡ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದೆ!"
  },
  " Phone": {
    kn: "ಫೋನ್"
  },
  "Location": {
    kn: "ಸ್ಥಳ"
  },
  "1234 Farm Road, Rural County, USA": {
    kn: "1234 ಫಾರ್ಮ್ ರೋಡ್, ಗ್ರಾಮೀಣ ಕೌಂಟಿ, ಯುಎಸ್ಎ"
  },
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
