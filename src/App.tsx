import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MolaBorderDark } from './components/MolaBorderDark';
import { IslandMap } from './components/IslandMap';
import { Culture } from './components/Culture';
import { Experiences } from './components/Experiences';
import { Storytelling } from './components/Storytelling';
import { Destination } from './components/Destination';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { FAQSection } from './components/FAQSection';
import { BookingCTA } from './components/BookingCTA';
import { BookingPage } from './components/BookingPage';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminBookings } from './components/AdminBookings';
import { Language } from './translations/content';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [route, setRoute] = useState<'home' | 'booking' | 'admin'>('home');
  const [selectedTourForBooking, setSelectedTourForBooking] = useState<string>('shared-full-day');

  // Initialize and listen to URL changes (window.location.pathname & query params)
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const tourParam = searchParams.get('tour');

      if (path.startsWith('/admin')) {
        setRoute('admin');
      } else if (path.startsWith('/booking')) {
        setRoute('booking');
        if (tourParam) {
          setSelectedTourForBooking(tourParam);
        }
      } else {
        setRoute('home');
        if (tourParam) {
          setSelectedTourForBooking(tourParam);
        }
      }
    };

    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    document.documentElement.lang = lang;
  };

  // Navigates to dedicated /booking page with chosen tour
  const handleBookTour = (tourId?: string) => {
    const tourToUse = tourId || selectedTourForBooking || 'shared-full-day';
    setSelectedTourForBooking(tourToUse);
    setRoute('booking');
    
    const newUrl = `/booking?tour=${encodeURIComponent(tourToUse)}`;
    window.history.pushState({}, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigates back to homepage
  const handleNavigateHome = () => {
    setRoute('home');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route 1: Admin Dashboard
  if (route === 'admin' || window.location.pathname.startsWith('/admin')) {
    return <AdminBookings />;
  }

  // Route 2: Dedicated /booking Page
  if (route === 'booking') {
    return (
      <BookingPage
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        initialTourId={selectedTourForBooking}
        onNavigateHome={handleNavigateHome}
      />
    );
  }

  // Route 3: Homepage
  return (
    <div className="min-h-screen bg-[#102B35] text-[#F6F2E9] flex flex-col font-sans selection:bg-[#B79A62] selection:text-[#102B35]">
      
      {/* 1. Header & Navigation */}
      <Header currentLang={currentLang} onLanguageChange={handleLanguageChange} />

      {/* Main Page Flow */}
      <main className="flex-grow">
        {/* 2. Hero Section — Cinematic Island Experience */}
        <Hero currentLang={currentLang} />

        {/* BORDER A: Rich Cultural Textile Band */}
        <MolaBorderDark />

        {/* 3. Interactive Guna Yala / San Blas Island Map Section */}
        <IslandMap currentLang={currentLang} />

        {/* 4. Cultural Section */}
        <Culture currentLang={currentLang} />

        {/* BORDER B: Elegant Ivory Textile Band */}
        <MolaBorderDark />

        {/* 5. Experiences Section — Explore Our Tours */}
        <Experiences currentLang={currentLang} onBookTour={handleBookTour} />

        {/* 6. Cinematic Storytelling Section */}
        <Storytelling currentLang={currentLang} />

        {/* 7. Destination Section (About Guna Yala) */}
        <Destination currentLang={currentLang} />

        {/* 8. About Section */}
        <AboutSection currentLang={currentLang} />

        {/* 9. Photo Gallery Section */}
        <GallerySection currentLang={currentLang} />

        {/* 10. FAQ Section */}
        <FAQSection currentLang={currentLang} />

        {/* 11. Elegant Booking CTA Banner (Replaces embedded form) */}
        <BookingCTA
          currentLang={currentLang}
          onOpenBookingPage={handleBookTour}
        />
      </main>

      {/* 12. Footer */}
      <Footer currentLang={currentLang} />

      {/* 13. Floating WhatsApp Quick Contact */}
      <FloatingWhatsApp currentLang={currentLang} />

    </div>
  );
}
