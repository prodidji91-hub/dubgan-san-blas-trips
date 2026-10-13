/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MolaBorderDark } from './components/MolaBorderDark';
import { IslandMap } from './components/IslandMap';
import { Culture } from './components/Culture';
import { MolaBorderLight } from './components/MolaBorderLight';
import { Experiences } from './components/Experiences';
import { Storytelling } from './components/Storytelling';
import { Destination } from './components/Destination';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { FAQSection } from './components/FAQSection';
import { TripForm } from './components/TripForm';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminBookings } from './components/AdminBookings';
import { Language } from './translations/content';

export default function App() {
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <AdminBookings />;
  }

  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [selectedTourForBooking, setSelectedTourForBooking] = useState<string>('shared-full-day');

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    document.documentElement.lang = lang;
  };

  const handleBookTour = (tourId: string) => {
    setSelectedTourForBooking(tourId);
    const target = document.querySelector('#contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#102B35] text-[#F6F2E9] flex flex-col font-sans selection:bg-[#B79A62] selection:text-[#102B35]">
      
      {/* 1. Header & Navigation */}
      <Header currentLang={currentLang} onLanguageChange={handleLanguageChange} />

      {/* Main Page Flow */}
      <main className="flex-grow">
        {/* 2. Hero Section — Cinematic Island Experience */}
        <Hero currentLang={currentLang} />

        {/* BORDER A: Rich Cultural Textile Band (MolaBorderDark) immediately below Hero */}
        <MolaBorderDark />

        {/* 3. Interactive Guna Yala / San Blas Island Map Section */}
        <IslandMap currentLang={currentLang} />

        {/* 4. Cultural Section — The Essence of Guna Yala (Split Screen) */}
        <Culture currentLang={currentLang} />

        {/* BORDER B: Elegant Ivory Textile Band (MolaBorderLight) between Culture & Tours */}
        <MolaBorderLight />

        {/* 5. Experiences Section — Explore Our Tours (3-Column Luxury Cards) */}
        <Experiences currentLang={currentLang} onBookTour={handleBookTour} />

        {/* 6. Cinematic Storytelling Section (A Meaningful Experience) */}
        <Storytelling currentLang={currentLang} />

        {/* 7. Destination Section (About Guna Yala) */}
        <Destination currentLang={currentLang} />

        {/* 8. About Section (Your Adventure Begins with Dubgan) */}
        <AboutSection currentLang={currentLang} />

        {/* 9. Photo Gallery Section with Lightbox */}
        <GallerySection currentLang={currentLang} />

        {/* 10. FAQ Section */}
        <FAQSection currentLang={currentLang} />

        {/* 11. Plan Your Trip Form / Booking Request */}
        <TripForm
          currentLang={currentLang}
          selectedTourId={selectedTourForBooking}
          onTourChange={setSelectedTourForBooking}
        />
      </main>

      {/* 12. Footer */}
      <Footer currentLang={currentLang} />

      {/* 13. Floating WhatsApp Quick Contact */}
      <FloatingWhatsApp currentLang={currentLang} />

    </div>
  );
}
