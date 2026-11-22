import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useTaskManager } from '../../context/TaskContext';

export const FocusNotesCarousel = () => {
  const { carouselSlides, activeSlide, nextSlide, prevSlide, goToSlide } = useTaskManager();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const currentSlide = carouselSlides[activeSlide];

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (!currentSlide) return null;

  return (
    <section 
      className="relative bg-gradient-to-r from-[#4F46E5] to-[#4338CA] rounded-2xl shadow-sm p-5 sm:p-6 text-white overflow-hidden transition-all select-none"
      aria-roledescription="carousel"
      aria-label="Focus Notes Carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background radial accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />

      {/* Top Header Row inside Carousel */}
      <div className="relative z-10 flex items-center justify-between mb-3 text-xs">
        <span className="font-bold tracking-wider text-white/90 uppercase text-[11px]">
          {currentSlide.tag}
        </span>
        <span className="font-medium text-white/70 tracking-widest text-[11px]">
          {currentSlide.counter}
        </span>
      </div>

      {/* Main Slide Content & Right floating preview card */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Headline & Subtitle */}
        <div className="flex-1 min-w-0 pr-0 md:pr-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            {currentSlide.headline}
          </h2>
          <p className="text-sm text-indigo-100 mt-1 leading-relaxed">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Right: Floating task preview card matching Figma design */}
        <div className="bg-white rounded-xl p-3 sm:p-3.5 shadow-lg border border-white/20 text-[#111827] w-full sm:w-64 shrink-0 transition-transform duration-300">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
            <span className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase">
              {currentSlide.cardSubtext}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-[#111827] mt-1.5 truncate">
            {currentSlide.cardTitle}
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#4F46E5] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${currentSlide.cardProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-[#6B7280]">
              {currentSlide.cardProgress}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Indicators & Controls */}
      <div className="relative z-10 mt-5 pt-3 border-t border-white/15 flex items-center justify-between gap-4">
        {/* Horizontal indicator bars matching Figma */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Slide indicators">
          {carouselSlides.map((slide, index) => {
            const isActive = index === activeSlide;
            return (
              <button
                key={slide.id}
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${index + 1}: ${slide.headline}`}
                onClick={() => goToSlide(index)}
                className={`h-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white/80 cursor-pointer ${
                  isActive ? 'w-10 sm:w-14 bg-white' : 'w-5 sm:w-8 bg-white/35 hover:bg-white/50'
                }`}
              />
            );
          })}
        </div>

        {/* Previous / Next Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            className="w-8 h-8 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
            aria-label="Previous Focus Note"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="w-8 h-8 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
            aria-label="Next Focus Note"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
