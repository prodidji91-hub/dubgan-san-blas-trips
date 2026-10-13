import React, { useState } from 'react';
import { MapPin, X, ArrowRight, Sparkles, Navigation, Info } from 'lucide-react';
import { islandData, SAN_BLAS_PORT, IslandStatus } from '../data/islandData';
import { Language, content } from '../translations/content';
import { MolaAccent } from './MolaAccent';
import { MolaBorderLight } from './MolaBorderLight';
import { images } from '../pictures/images';

interface IslandMapProps {
  currentLang: Language;
}

export const IslandMap: React.FC<IslandMapProps> = ({ currentLang }) => {
  const [selectedIslandId, setSelectedIslandId] = useState<string | null>('island-dog');
  const [hoveredIslandId, setHoveredIslandId] = useState<string | null>(null);

  const selectedIsland = selectedIslandId ? islandData[selectedIslandId] : null;
  const hoveredIsland = hoveredIslandId ? islandData[hoveredIslandId] : null;

  const islandOffsets: Record<string, { dx: number; dy: number }> = {
    'island-diablo': { dx: 35, dy: -35 },
    'island-porvenir': { dx: -35, dy: 15 },
    'island-dog': { dx: -25, dy: 35 },
    'island-chichime': { dx: 10, dy: -35 },
    'natural-pool': { dx: 0, dy: -35 },
    'island-nalunega': { dx: 30, dy: -30 },
    'island-aguja': { dx: -20, dy: -35 },
    'island-pelican': { dx: -25, dy: -35 },
    'island-coco': { dx: 15, dy: -35 },
  };

  const getIslandImageObj = (key?: string) => {
    if (!key) return null;
    if (key === 'elporvenir') {
      return images.elporvenir;
    }
    if (key === 'nalunega') {
      return images.nalunega;
    }
    if (key === 'aguja') {
      return images.aguja;
    }
    if (key === 'pelicano') {
      return images.pelicano;
    }
    if (key === 'perrochico') {
      return images.perrochico;
    }
    if (key === 'diablo') {
      return images.diablo;
    }
    if (key === 'coco') {
      return images.coco;
    }
    if (key === 'chichime') {
      return images.chichime;
    }
    if (key === 'naturalpool') {
      return images.naturalpool;
    }
    if (key === 'holandeses') {
      return images.holandeses;
    }
    if (key === 'gallery1') {
      return images.gallery[0];
    }
    if (key === 'tour1') {
      return images.tours.tour1;
    }
    if (key === 'tour2') {
      return images.tours.tour2;
    }
    if (key === 'tour3') {
      return images.tours.tour3;
    }
    const dynamicImages = images as Record<string, any>;
    if (dynamicImages[key]) {
      return dynamicImages[key];
    }
    return null;
  };

  const getStatusColor = (status: IslandStatus) => {
    switch (status) {
      case 'featured':
        return {
          fill: '#B79A62',
          stroke: '#F6F2E9',
          glow: '#B79A62',
          textClass: 'text-[#B79A62]',
          badgeBg: 'bg-[#B79A62]/20 border-[#B79A62] text-[#B79A62]',
        };
      case 'other':
        return {
          fill: '#397D80',
          stroke: '#B79A62',
          glow: '#397D80',
          textClass: 'text-[#397D80]',
          badgeBg: 'bg-[#397D80]/20 border-[#397D80] text-[#397D80]',
        };
      case 'inactive':
      default:
        return {
          fill: '#8299A1',
          stroke: '#A4B5BC',
          glow: 'transparent',
          textClass: 'text-[#173642]/60',
          badgeBg: 'bg-[#EDE5D7] border-[#A4B5BC] text-[#173642]/60',
        };
    }
  };

  const getWhatsAppLink = (islandName: string) => {
    const message =
      currentLang === 'es'
        ? `Hola Dubgan San Blas Trips, me gustaría consultar información y visitas a: ${islandName}.`
        : `Hello Dubgan San Blas Trips, I would like to inquire about visiting: ${islandName}.`;
    return `https://wa.me/50764217424?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="map" className="py-24 bg-[#F6F2E9] text-[#173642] relative overflow-hidden">
      
      {/* Top Section Frame */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Geographic Title & Subtitle Centered Directly Above the Map */}
        <div className="text-center space-y-2 max-w-4xl mx-auto">
          <p className="eyebrow-gold tracking-[0.25em] text-xs sm:text-sm">
            {currentLang === 'es' ? 'MAPA GEOGRÁFICO DE NAVEGACIÓN' : 'GEOGRAPHIC NAVIGATION MAP'}
          </p>

          <h2 className="font-brand-marcellus text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#173642] uppercase whitespace-nowrap overflow-hidden text-ellipsis">
            CAYOS DE LIMONES
          </h2>

          <p className="font-serif-editorial italic text-base sm:text-xl text-[#B79A62] tracking-wider font-semibold">
            Guna Yala · San Blas, Panamá
          </p>

          {/* Subtle Guna-inspired Ornamental Accent */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-10 sm:w-16 h-[1px] bg-[#B79A62]/50" />
            <MolaAccent size="sm" />
            <div className="w-10 sm:w-16 h-[1px] bg-[#B79A62]/50" />
          </div>

          <p className="text-xs sm:text-sm text-[#173642]/80 font-normal max-w-2xl mx-auto pt-1">
            {currentLang === 'es'
              ? 'Navega de forma interactiva por los principales cayos, islas y la piscina natural en Cayos de Limones.'
              : 'Interactively explore the primary cays, islands, and natural shallow pool in Cayos de Limones.'}
          </p>
        </div>

        {/* Custom Luxury Cartography Container on Soft Sand Frame */}
        <div className="relative bg-[#EDE5D7] border border-[#B79A62]/50 shadow-xl p-3 sm:p-5 md:p-6 overflow-hidden">
          
          {/* Mola Corner Brackets */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#B79A62] pointer-events-none" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#B79A62] pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#B79A62] pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#B79A62] pointer-events-none" />

          {/* Interactive SVG Cartographic Canvas */}
          <div className="relative aspect-[16/9] min-h-[380px] sm:min-h-[460px] md:min-h-[540px] w-full bg-[#0E2833] overflow-hidden select-none shadow-inner border border-[#B79A62]/30">
            
            <svg
              viewBox="0 0 1000 560"
              className="w-full h-full object-cover"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Ocean Bathymetry Gradient */}
                <radialGradient id="oceanBathymetry" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#144252" />
                  <stop offset="60%" stopColor="#0F3342" />
                  <stop offset="100%" stopColor="#091F2B" />
                </radialGradient>

                {/* Island Glow Filters */}
                <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="tealGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Ocean Sea Background */}
              <rect width="1000" height="560" fill="url(#oceanBathymetry)" />

              {/* Bathymetric Depth Lines */}
              <path
                d="M 0,220 Q 300,180 600,240 T 1000,200"
                fill="none"
                stroke="#1E5263"
                strokeWidth="1"
                strokeDasharray="4,6"
                opacity="0.6"
              />
              <path
                d="M 0,320 Q 400,280 800,340 T 1000,300"
                fill="none"
                stroke="#1E5263"
                strokeWidth="1"
                strokeDasharray="6,8"
                opacity="0.5"
              />

              {/* Grid Lines for Nautical Aesthetics */}
              <g stroke="#B79A62" strokeWidth="0.5" opacity="0.15">
                <line x1="200" y1="0" x2="200" y2="560" strokeDasharray="3,6" />
                <line x1="400" y1="0" x2="400" y2="560" strokeDasharray="3,6" />
                <line x1="600" y1="0" x2="600" y2="560" strokeDasharray="3,6" />
                <line x1="800" y1="0" x2="800" y2="560" strokeDasharray="3,6" />
                <line x1="0" y1="140" x2="1000" y2="140" strokeDasharray="3,6" />
                <line x1="0" y1="280" x2="1000" y2="280" strokeDasharray="3,6" />
                <line x1="0" y1="420" x2="1000" y2="420" strokeDasharray="3,6" />
              </g>

              {/* Mainland Panama Coastline (Guna Yala Mainland & Cordillera) */}
              <path
                d="M 0,560 L 0,420 Q 120,440 240,430 T 480,450 Q 650,470 820,490 T 1000,520 L 1000,560 Z"
                fill="#1A404F"
                stroke="#B79A62"
                strokeWidth="1"
                opacity="0.9"
              />
              <path
                d="M 0,560 L 0,440 Q 140,455 280,445 T 520,465 Q 700,485 880,505 T 1000,540 L 1000,560 Z"
                fill="#12323E"
                opacity="0.95"
              />
              <text
                x="80"
                y="510"
                fontFamily="'Cormorant Garamond', serif"
                fontSize="14"
                fontWeight="700"
                fill="#B79A62"
                letterSpacing="3"
                opacity="0.8"
              >
                CORDILLERA DE GUNA YALA (PANAMA MAINLAND)
              </text>

              {/* Cartographic Compass Rose */}
              <g transform="translate(900, 80)">
                <circle cx="0" cy="0" r="32" fill="none" stroke="#B79A62" strokeWidth="1" opacity="0.4" />
                <circle cx="0" cy="0" r="28" fill="none" stroke="#B79A62" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.6" />
                <polygon points="0,-24 5,-6 0,0 -5,-6" fill="#B79A62" />
                <polygon points="0,24 5,6 0,0 -5,6" fill="#173642" stroke="#B79A62" strokeWidth="0.5" />
                <polygon points="24,0 6,5 0,0 6,-5" fill="#397D80" />
                <polygon points="-24,0 -6,5 0,0 -6,-5" fill="#397D80" />
                <text x="0" y="-28" textAnchor="middle" fontSize="10" fontFamily="'Manrope', sans-serif" fontWeight="800" fill="#B79A62">N</text>
              </g>

              {/* Departure Port Marker: Cartí Port (Puerto Cartí) */}
              <g
                transform={`translate(${SAN_BLAS_PORT.cx}, ${SAN_BLAS_PORT.cy})`}
                className="cursor-pointer group"
                onClick={() => setSelectedIslandId(null)}
              >
                <circle cx="0" cy="0" r="14" fill="#B79A62" opacity="0.3" className="animate-ping" />
                <circle cx="0" cy="0" r="10" fill="#173642" stroke="#B79A62" strokeWidth="2" />
                <circle cx="0" cy="0" r="4" fill="#B79A62" />
                
                <rect
                  x="-60"
                  y="16"
                  width="120"
                  height="22"
                  fill="#173642"
                  stroke="#B79A62"
                  strokeWidth="1"
                  rx="4"
                  opacity="0.95"
                />
                <text
                  x="0"
                  y="31"
                  textAnchor="middle"
                  fontFamily="'Manrope', sans-serif"
                  fontSize="9"
                  fontWeight="800"
                  fill="#F6F2E9"
                  letterSpacing="1"
                >
                  📍 SAN BLAS PORT
                </text>
              </g>

              {/* Render Island Objects */}
              {Object.values(islandData).map((island) => {
                const style = getStatusColor(island.status);
                const isSelected = selectedIslandId === island.id;
                const isHovered = hoveredIslandId === island.id;
                const imgObj = island.imageKey ? getIslandImageObj(island.imageKey) : null;

                const radius = island.status === 'featured' ? 14 : island.status === 'other' ? 10 : 7;
                const offset = islandOffsets[island.id] || { dx: 0, dy: 0 };

                // If island has an assigned photograph, render a beautiful photo thumbnail marker
                if (imgObj) {
                  return (
                    <g
                      key={island.id}
                      id={island.id}
                      transform={`translate(${island.cx}, ${island.cy})`}
                      className="transition-all duration-300"
                    >
                      {/* Anchor Dot at Geographic Coordinates */}
                      <circle
                        cx="0"
                        cy="0"
                        r="4"
                        fill="#B79A62"
                        stroke="#F6F2E9"
                        strokeWidth="1.5"
                        className="pointer-events-none shadow-sm"
                      />

                      {/* Optional Connector Line to Offset Thumbnail */}
                      {(offset.dx !== 0 || offset.dy !== 0) && (
                        <line
                          x1="0"
                          y1="0"
                          x2={offset.dx}
                          y2={offset.dy}
                          stroke="#B79A62"
                          strokeWidth="1.5"
                          strokeDasharray="3,3"
                          opacity="0.8"
                          className="pointer-events-none"
                        />
                      )}

                      {/* Visible Rounded Photo Thumbnail via ForeignObject */}
                      <foreignObject
                        x={offset.dx - 60}
                        y={offset.dy - 45}
                        width="120"
                        height="90"
                        className="overflow-visible"
                      >
                        <div
                          className="flex flex-col items-center justify-center text-center cursor-pointer select-none group focus:outline-none"
                          onMouseEnter={() => setHoveredIslandId(island.id)}
                          onMouseLeave={() => setHoveredIslandId(null)}
                          onClick={() => setSelectedIslandId(island.id)}
                          tabIndex={0}
                          role="button"
                          aria-label={currentLang === 'es' ? `Isla ${island.nameEs}` : `${island.nameEn} Island`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setSelectedIslandId(island.id);
                            }
                          }}
                        >
                          {/* 48-56px Desktop, 36-44px Mobile Photo Marker with Border and Shadow */}
                          <div
                            className={`w-9 h-9 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 shadow-md transition-all duration-300 transform group-hover:scale-110 active:scale-95 ${
                              isSelected ? 'border-[#B79A62] ring-2 ring-[#B79A62]/40 shadow-lg' : 'border-[#F6F2E9]'
                            }`}
                          >
                            <img
                              src={imgObj.src}
                              alt={currentLang === 'es' ? imgObj.altEs : imgObj.altEn}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Island Name Directly Underneath */}
                          <span className="text-[9px] sm:text-[10.5px] font-bold font-brand-marcellus text-[#F6F2E9] bg-[#173642]/90 border border-[#B79A62]/20 px-1.5 py-0.5 rounded shadow-sm mt-1 whitespace-nowrap z-10 max-w-[110px] truncate group-hover:border-[#B79A62]/60">
                            {currentLang === 'es' ? island.nameEs.replace(/\s*\(.*\)/, '') : island.nameEn.replace(/\s*Island\s*/i, '')}
                          </span>
                        </div>
                      </foreignObject>
                    </g>
                  );
                }

                // Fallback: render the original beautiful circle dot and text if no photograph exists
                return (
                  <g
                    key={island.id}
                    id={island.id}
                    transform={`translate(${island.cx}, ${island.cy})`}
                    className="cursor-pointer group transition-all duration-300"
                    onMouseEnter={() => setHoveredIslandId(island.id)}
                    onMouseLeave={() => setHoveredIslandId(null)}
                    onClick={() => setSelectedIslandId(island.id)}
                  >
                    {/* Outer Glow Circle for Featured */}
                    {island.status === 'featured' && (
                      <circle
                        cx="0"
                        cy="0"
                        r={radius + 8}
                        fill={style.fill}
                        opacity={isHovered || isSelected ? "0.45" : "0.25"}
                        filter="url(#goldGlow)"
                        className="transition-opacity duration-300"
                      />
                    )}

                    {/* Island Core Shape */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isHovered || isSelected ? radius + 3 : radius}
                      fill={style.fill}
                      stroke={style.stroke}
                      strokeWidth={isHovered || isSelected ? "2.5" : "1.5"}
                      className="transition-all duration-300 transform group-hover:scale-110"
                    />

                    {/* Star Marker for Featured */}
                    {island.status === 'featured' && (
                      <polygon
                        points="0,-4 3,-1 7,-1 4,2 5,6 0,3 -5,6 -4,2 -7,-1 -3,-1"
                        fill="#F6F2E9"
                      />
                    )}

                    {/* Island Name Label */}
                    <text
                      x="0"
                      y={radius + 16}
                      textAnchor="middle"
                      fontFamily="'Cormorant Garamond', serif"
                      fontSize={island.status === 'featured' ? "13" : "11"}
                      fontWeight={island.status === 'featured' ? "700" : "600"}
                      fill={isHovered || isSelected ? "#F6F2E9" : island.status === 'inactive' ? "#A4B5BC" : "#B79A62"}
                      className="pointer-events-none transition-colors duration-200 drop-shadow-sm"
                    >
                      {currentLang === 'es' ? island.nameEs : island.nameEn}
                    </text>
                  </g>
                );
              })}

            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredIsland && (
              <div
                className="absolute z-30 pointer-events-none bg-[#F6F2E9] border border-[#B79A62] p-3 shadow-2xl text-xs space-y-1.5 transform -translate-x-1/2 -translate-y-full mb-4 animate-in fade-in duration-150 text-[#173642] w-48"
                style={{
                  left: `${(hoveredIsland.cx / 1000) * 100}%`,
                  top: `${(hoveredIsland.cy / 560) * 100}%`,
                }}
              >
                {hoveredIsland.imageKey && (() => {
                  const imgObj = getIslandImageObj(hoveredIsland.imageKey);
                  if (!imgObj) return null;
                  return (
                    <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#B79A62]/20 bg-[#EDE5D7] mb-1">
                      <img
                        src={imgObj.src}
                        alt={currentLang === 'es' ? imgObj.altEs : imgObj.altEn}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  );
                })()}
                <div className="flex items-center gap-1.5 font-bold text-[#173642]">
                  <Sparkles className="w-3.5 h-3.5 text-[#B79A62]" />
                  <span>{currentLang === 'es' ? hoveredIsland.nameEs : hoveredIsland.nameEn}</span>
                </div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#B79A62]">
                  {currentLang === 'es' ? hoveredIsland.groupEs : hoveredIsland.groupEn}
                </p>
                <div className="text-[10px] text-[#397D80] font-semibold">
                  {currentLang === 'es' ? 'Haz clic para detalles →' : 'Click for details →'}
                </div>
              </div>
            )}

          </div>

          {/* Cartographic Legend */}
          <div className="mt-5 pt-4 border-t border-[#B79A62]/30 flex flex-wrap items-center justify-between gap-4 text-xs text-[#173642]">
            
            <div className="flex flex-wrap items-center gap-6">
              
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#B79A62] border border-[#173642] shadow-sm" />
                <span className="font-bold text-[#173642] uppercase tracking-wider text-[11px]">
                  {currentLang === 'es' ? 'Destinos Destacados Dubgan' : 'Featured Dubgan Islands'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#397D80] border border-[#B79A62]" />
                <span className="font-medium text-[#173642]/80 uppercase tracking-wider text-[11px]">
                  {currentLang === 'es' ? 'Otros Cayos de San Blas' : 'Other Archipelago Cays'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#8299A1] border border-[#A4B5BC]" />
                <span className="font-medium text-[#173642]/60 uppercase tracking-wider text-[11px]">
                  {currentLang === 'es' ? 'Puntos de la Comarca' : 'Regional Points'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B79A62]" />
                <span className="font-bold text-[#B79A62] uppercase tracking-wider text-[11px]">
                  {currentLang === 'es' ? 'Puerto San Blas (Salida)' : 'San Blas Departure Port'}
                </span>
              </div>

            </div>

            <div className="text-[11px] font-mono text-[#B79A62] font-semibold">
              Guna Yala Regional Cartography • Panama
            </div>

          </div>

        </div>

        {/* Island Details Section with Mobile Dropdown & Desktop 2-Column Layout */}
        <div className="pt-4 space-y-4">
          
          {/* MOBILE VIEW (< md): Compact Dropdown Directly Above Photograph */}
          <div className="md:hidden bg-[#EDE5D7] p-4 border border-[#B79A62]/40 shadow-sm space-y-2">
            <label htmlFor="mobile-island-select" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B79A62]">
              <Navigation className="w-3.5 h-3.5" />
              <span>{currentLang === 'es' ? 'Seleccionar Isla para Ver Detalle:' : 'Select Island to View Details:'}</span>
            </label>
            
            <div className="relative">
              <select
                id="mobile-island-select"
                value={selectedIslandId || ''}
                onChange={(e) => setSelectedIslandId(e.target.value || null)}
                className="w-full bg-white text-[#173642] font-bold text-sm border-2 border-[#B79A62] py-3 px-4 pr-8 rounded-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B79A62] cursor-pointer"
              >
                {Object.values(islandData).map((island) => (
                  <option key={island.id} value={island.id}>
                    {island.status === 'featured' ? '✨ ' : ''}
                    {currentLang === 'es' ? island.nameEs : island.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DESKTOP & TABLET TWO-COLUMN LAYOUT (md+): Left Column Selector, Right Column Details */}
          <div className="grid grid-cols-12 gap-6 md:gap-8 items-start">
            
            {/* LEFT COLUMN: Vertical Island Selector List */}
            <div className="hidden md:block col-span-12 md:col-span-4 lg:col-span-3 space-y-3 bg-[#EDE5D7] p-4 border border-[#B79A62]/40 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B79A62] pb-2 border-b border-[#B79A62]/30">
                <Navigation className="w-3.5 h-3.5 text-[#B79A62]" />
                <span>{currentLang === 'es' ? 'Seleccionar Isla:' : 'Select Island:'}</span>
              </div>

              <div className="flex flex-col space-y-1.5 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin">
                {Object.values(islandData).map((island) => {
                  const isSelected = selectedIslandId === island.id;
                  return (
                    <button
                      key={island.id}
                      type="button"
                      onClick={() => setSelectedIslandId(island.id)}
                      className={`w-full text-left px-3.5 py-2.5 text-xs transition-all duration-200 border flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-[#B79A62] text-[#173642] border-[#B79A62] font-bold shadow-md transform translate-x-0.5'
                          : 'bg-white text-[#173642]/85 border-[#B79A62]/20 hover:border-[#B79A62] hover:bg-[#F6F2E9]'
                      }`}
                    >
                      <span className="truncate">
                        {island.status === 'featured' ? '✨ ' : ''}
                        {currentLang === 'es' ? island.nameEs : island.nameEn}
                      </span>
                      {isSelected && <span className="text-xs font-extrabold text-[#173642]">›</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: Selected Island Details Panel */}
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              {selectedIsland ? (
                <div className="bg-[#F6F2E9] border-2 border-[#B79A62] p-6 sm:p-8 shadow-xl relative space-y-6 text-[#173642]">
                  
                  <button
                    type="button"
                    onClick={() => setSelectedIslandId(null)}
                    className="absolute top-4 right-4 p-2 text-[#173642] hover:text-[#B79A62] transition-colors"
                    aria-label="Close island details"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B79A62]/30 pb-4">
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="eyebrow-gold">
                          {currentLang === 'es' ? selectedIsland.groupEs : selectedIsland.groupEn}
                        </span>
                        <MolaAccent size="sm" />
                      </div>

                      <h3 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#173642]">
                        {currentLang === 'es' ? selectedIsland.nameEs : selectedIsland.nameEn}
                      </h3>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <span
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-widest border ${
                          getStatusColor(selectedIsland.status).badgeBg
                        }`}
                      >
                        {selectedIsland.status === 'featured'
                          ? currentLang === 'es'
                            ? 'Destino Destacado Dubgan'
                            : 'Featured Dubgan Island'
                          : selectedIsland.status === 'other'
                          ? currentLang === 'es'
                            ? 'Cayo Importante'
                            : 'Important Cay'
                          : currentLang === 'es'
                          ? 'Punto Regional'
                          : 'Regional Point'}
                      </span>
                    </div>

                  </div>

                  {/* Island Image with Consistent Moderate Height to Avoid Layout Jumps */}
                  {selectedIsland.imageKey && (() => {
                    const imgObj = getIslandImageObj(selectedIsland.imageKey);
                    if (!imgObj) return null;
                    return (
                      <div className="relative aspect-[16/9] max-h-[380px] w-full overflow-hidden border border-[#B79A62]/30 shadow-md bg-[#EDE5D7]">
                        <img
                          src={imgObj.src}
                          alt={currentLang === 'es' ? imgObj.altEs : imgObj.altEn}
                          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                        />
                      </div>
                    );
                  })()}

                  {/* Description Body */}
                  <p className="text-sm sm:text-base text-[#173642]/90 font-normal leading-relaxed">
                    {currentLang === 'es' ? selectedIsland.descriptionEs : selectedIsland.descriptionEn}
                  </p>

                  {/* Activities List */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#B79A62]">
                      {currentLang === 'es' ? 'Actividades y Atractivos:' : 'Activities & Highlights:'}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(currentLang === 'es' ? selectedIsland.activitiesEs : selectedIsland.activitiesEn).map(
                        (act, idx) => (
                          <span
                            key={idx}
                            className="bg-white text-[#173642] border border-[#B79A62]/30 px-3 py-1 text-xs font-semibold shadow-xs"
                          >
                            ✓ {act}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-4">
                    <a
                      href={getWhatsAppLink(currentLang === 'es' ? selectedIsland.nameEs : selectedIsland.nameEn)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md"
                    >
                      <span>{currentLang === 'es' ? 'CONSULTAR TOUR A ESTA ISLA →' : 'VIEW TOUR / INQUIRE →'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>

                    <a
                      href="#tours"
                      className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#173642]/5 text-[#173642] border border-[#173642]/40 px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300"
                    >
                      <Info className="w-4 h-4 text-[#B79A62]" />
                      <span>{currentLang === 'es' ? 'VER TODOS LOS TOURS' : 'VIEW ALL TOURS'}</span>
                    </a>
                  </div>

                </div>
              ) : (
                <div className="bg-[#EDE5D7] p-8 text-center text-[#173642]/70 font-medium border border-[#B79A62]/30">
                  {currentLang === 'es' ? 'Selecciona una isla de la lista para ver su información.' : 'Select an island from the list to view details.'}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Subtle Frame Divider */}
      <div className="mt-16">
        <MolaBorderLight />
      </div>

    </section>
  );
};
