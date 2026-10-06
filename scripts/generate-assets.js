import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src', 'pictures');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Color Palette
// Deep Caribbean Navy: #102B35
// Warm Ivory: #F6F2E9
// Antique Gold: #B79A62
// Muted Ocean Teal: #397D80
// Dark Charcoal: #22252A
// White: #FFFFFF

const images = {
  'dubgan-logo.jpeg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
    <defs>
      <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#102B35"/>
        <stop offset="100%" stop-color="#08181E"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D4B982"/>
        <stop offset="100%" stop-color="#B79A62"/>
      </linearGradient>
      <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#397D80"/>
        <stop offset="100%" stop-color="#4E999C"/>
      </linearGradient>
    </defs>
    <rect width="800" height="800" fill="#102B35"/>
    <rect x="24" y="24" width="752" height="752" fill="none" stroke="url(#goldGrad)" stroke-width="4" rx="20"/>
    <circle cx="400" cy="370" r="270" fill="url(#logoBg)" stroke="#B79A62" stroke-width="6"/>
    
    <circle cx="400" cy="310" r="110" fill="url(#goldGrad)" opacity="0.95"/>
    <path d="M 220 420 Q 400 380 580 420 Q 480 460 320 460 Z" fill="#F6F2E9"/>
    
    <path d="M 330 420 Q 300 330 260 250" stroke="#102B35" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M 260 250 Q 200 240 160 270" stroke="#397D80" stroke-width="6" fill="none"/>
    <path d="M 260 250 Q 230 190 200 180" stroke="#B79A62" stroke-width="6" fill="none"/>
    <path d="M 260 250 Q 300 200 330 220" stroke="#397D80" stroke-width="6" fill="none"/>
    
    <path d="M 460 420 Q 490 320 540 230" stroke="#102B35" stroke-width="14" stroke-linecap="round" fill="none"/>
    <path d="M 540 230 Q 600 220 640 250" stroke="#B79A62" stroke-width="6" fill="none"/>
    <path d="M 540 230 Q 570 170 600 170" stroke="#397D80" stroke-width="6" fill="none"/>

    <path d="M 370 400 Q 400 415 430 400 L 420 412 Q 400 422 380 412 Z" fill="#B79A62"/>
    <line x1="400" y1="402" x2="400" y2="340" stroke="#F6F2E9" stroke-width="3"/>
    <path d="M 400 345 Q 425 370 400 395 Z" fill="#F6F2E9"/>

    <path d="M 150 420 Q 275 460 400 420 T 650 420 C 690 510 690 570 650 610 C 500 650 300 650 150 610 Z" fill="url(#tealGrad)" opacity="0.85"/>

    <text x="400" y="685" font-family="'Cormorant Garamond', serif" font-size="62" font-weight="700" fill="#F6F2E9" text-anchor="middle" letter-spacing="8">DUBGAN</text>
    <text x="400" y="730" font-family="'Manrope', sans-serif" font-size="20" font-weight="600" fill="#B79A62" text-anchor="middle" letter-spacing="10">SAN BLAS TRIPS</text>
    <text x="400" y="755" font-family="'Manrope', sans-serif" font-size="12" font-weight="500" fill="#397D80" text-anchor="middle" letter-spacing="4">GUNA YALA • PANAMA</text>
  </svg>`,

  'hero.jpg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
    <defs>
      <linearGradient id="heroSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0B1D24"/>
        <stop offset="30%" stop-color="#102B35"/>
        <stop offset="65%" stop-color="#397D80"/>
        <stop offset="85%" stop-color="#B79A62"/>
        <stop offset="100%" stop-color="#F6F2E9"/>
      </linearGradient>
      <linearGradient id="heroSea" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#397D80"/>
        <stop offset="35%" stop-color="#216D71"/>
        <stop offset="70%" stop-color="#102B35"/>
        <stop offset="100%" stop-color="#0A1C23"/>
      </linearGradient>
      <radialGradient id="sunGlowHero" cx="70%" cy="30%" r="45%">
        <stop offset="0%" stop-color="#FFF5E0" stop-opacity="0.95"/>
        <stop offset="25%" stop-color="#B79A62" stop-opacity="0.6"/>
        <stop offset="60%" stop-color="#397D80" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#102B35" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="sandHero" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFDF9"/>
        <stop offset="60%" stop-color="#F6F2E9"/>
        <stop offset="100%" stop-color="#E5D9C3"/>
      </linearGradient>
    </defs>

    <rect width="1920" height="550" fill="url(#heroSky)"/>
    <circle cx="1340" cy="300" r="380" fill="url(#sunGlowHero)"/>
    <circle cx="1340" cy="300" r="65" fill="#FFFBF2"/>

    <path d="M 120 540 Q 280 520 450 545 T 750 535 Q 900 520 1050 540 Z" fill="#102B35" opacity="0.75"/>
    <path d="M 1150 545 Q 1300 530 1450 545 T 1750 540 Z" fill="#102B35" opacity="0.65"/>

    <rect y="540" width="1920" height="540" fill="url(#heroSea)"/>

    <ellipse cx="1340" cy="620" rx="320" ry="16" fill="#B79A62" opacity="0.4"/>
    <ellipse cx="1340" cy="660" rx="240" ry="10" fill="#FFF5E0" opacity="0.5"/>

    <path d="M 850 720 C 1050 660, 1500 680, 1720 780 C 1850 850, 1500 1080, 750 1080 Z" fill="url(#sandHero)"/>
    
    <path d="M 700 660 C 950 600, 1550 620, 1800 730 C 1950 820, 1600 1080, 600 1080 Z" fill="#397D80" opacity="0.4"/>

    <path d="M 1250 760 Q 1200 630 1120 500" stroke="#102B35" stroke-width="24" stroke-linecap="round" fill="none"/>
    <path d="M 1120 500 Q 1020 480 960 530" stroke="#397D80" stroke-width="14" stroke-linecap="round" fill="none"/>
    <path d="M 1120 500 Q 1070 400 1000 380" stroke="#B79A62" stroke-width="14" stroke-linecap="round" fill="none"/>
    <path d="M 1120 500 Q 1150 380 1200 360" stroke="#397D80" stroke-width="14" stroke-linecap="round" fill="none"/>

    <path d="M 1380 770 Q 1420 640 1480 480" stroke="#102B35" stroke-width="20" stroke-linecap="round" fill="none"/>
    <path d="M 1480 480 Q 1580 460 1640 510" stroke="#B79A62" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M 1480 480 Q 1530 390 1580 370" stroke="#397D80" stroke-width="12" stroke-linecap="round" fill="none"/>

    <polygon points="1220,740 1280,680 1340,740" fill="#B79A62"/>
    <rect x="1240" y="740" width="80" height="40" fill="#102B35"/>

    <rect width="900" height="1080" fill="url(#heroSky)" opacity="0.6"/>
  </svg>`,

  'culture.jpg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
    <rect width="1200" height="900" fill="#102B35"/>
    <rect x="60" y="60" width="1080" height="780" fill="none" stroke="#B79A62" stroke-width="8" rx="16"/>
    <rect x="90" y="90" width="1020" height="720" fill="none" stroke="#397D80" stroke-width="4" rx="12"/>

    <g transform="translate(600, 450)">
      <path d="M -300 -200 L 300 -200 L 350 0 L 300 200 L -300 200 L -350 0 Z" fill="none" stroke="#C23B22" stroke-width="12"/>
      <path d="M -260 -160 L 260 -160 L 300 0 L 260 160 L -260 160 L -300 0 Z" fill="none" stroke="#D49A3A" stroke-width="8"/>
      <path d="M -220 -120 L 220 -120 L 250 0 L 220 120 L -220 120 L -250 0 Z" fill="none" stroke="#397D80" stroke-width="6"/>

      <circle cx="0" cy="0" r="140" fill="#397D80" stroke="#B79A62" stroke-width="10"/>
      <path d="M -90 0 Q 0 -110 90 0 Q 0 110 -90 0 Z" fill="#D96848"/>
      <circle cx="0" cy="0" r="45" fill="#F6F2E9"/>

      <path d="M -200 -90 L -140 -90 L -140 -40 L -180 -40 L -180 -10" fill="none" stroke="#F6F2E9" stroke-width="6" stroke-linecap="round"/>
      <path d="M 200 -90 L 140 -90 L 140 -40 L 180 -40 L 180 -10" fill="none" stroke="#F6F2E9" stroke-width="6" stroke-linecap="round"/>
      <path d="M -200 90 L -140 90 L -140 40 L -180 40 L -180 10" fill="none" stroke="#F6F2E9" stroke-width="6" stroke-linecap="round"/>
      <path d="M 200 90 L 140 90 L 140 40 L 180 40 L 180 10" fill="none" stroke="#F6F2E9" stroke-width="6" stroke-linecap="round"/>
    </g>

    <text x="600" y="800" font-family="'Cormorant Garamond', serif" font-size="34" font-weight="700" fill="#F6F2E9" text-anchor="middle" letter-spacing="6">GUNA YALA TEXTILE ARTISTRY</text>
  </svg>`,

  'tour1.jpg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <rect width="1200" height="450" fill="#397D80"/>
    <rect y="450" width="1200" height="350" fill="#102B35"/>
    <ellipse cx="600" cy="480" rx="480" ry="120" fill="#F6F2E9"/>
    <ellipse cx="600" cy="480" rx="550" ry="160" fill="#397D80" opacity="0.4"/>
    <path d="M 450 480 Q 420 320 350 220" stroke="#102B35" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M 350 220 Q 250 200 200 250" stroke="#B79A62" stroke-width="10" fill="none"/>
    <path d="M 350 220 Q 380 140 430 160" stroke="#397D80" stroke-width="10" fill="none"/>
    <text x="600" y="720" font-family="'Cormorant Garamond', serif" font-size="36" font-weight="700" fill="#F6F2E9" text-anchor="middle" letter-spacing="4">ISLAND HOPPING TOUR</text>
  </svg>`,

  'tour2.jpg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <rect width="1200" height="800" fill="#102B35"/>
    <polygon points="350,380 600,220 850,380" fill="#B79A62"/>
    <rect x="400" y="380" width="400" height="180" fill="#F6F2E9"/>
    <line x1="400" y1="560" x2="400" y2="680" stroke="#B79A62" stroke-width="12"/>
    <line x1="800" y1="560" x2="800" y2="680" stroke="#B79A62" stroke-width="12"/>
    <rect y="600" width="1200" height="200" fill="#397D80" opacity="0.8"/>
    <text x="600" y="740" font-family="'Cormorant Garamond', serif" font-size="36" font-weight="700" fill="#F6F2E9" text-anchor="middle" letter-spacing="4">PRIVATE ISLAND EXPERIENCE</text>
  </svg>`,

  'tour3.jpg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <rect width="1200" height="420" fill="#102B35"/>
    <rect y="420" width="1200" height="380" fill="#397D80"/>
    <circle cx="600" cy="420" r="280" fill="#F6F2E9" opacity="0.2"/>
    <circle cx="600" cy="420" r="180" fill="#B79A62" opacity="0.4"/>
    <path d="M 400 480 Q 500 420 600 480 T 800 480" stroke="#F6F2E9" stroke-width="8" fill="none"/>
    <text x="600" y="720" font-family="'Cormorant Garamond', serif" font-size="36" font-weight="700" fill="#F6F2E9" text-anchor="middle" letter-spacing="4">SNORKELING ADVENTURE</text>
  </svg>`,

  'story.jpg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 900" width="1920" height="900">
    <defs>
      <linearGradient id="storySunset" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#102B35"/>
        <stop offset="35%" stop-color="#5C3B20"/>
        <stop offset="65%" stop-color="#B79A62"/>
        <stop offset="100%" stop-color="#397D80"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="900" fill="url(#storySunset)"/>
    <circle cx="960" cy="420" r="220" fill="#FFF2D6" opacity="0.9"/>
    
    <rect y="500" width="1920" height="400" fill="#102B35"/>
    <path d="M 600 520 L 1320 520 L 1220 580 L 700 580 Z" fill="#B79A62"/>
    <line x1="960" y1="520" x2="960" y2="300" stroke="#F6F2E9" stroke-width="6"/>
    <path d="M 960 310 Q 1060 410 960 510 Z" fill="#F6F2E9" opacity="0.85"/>

    <text x="960" y="800" font-family="'Cormorant Garamond', serif" font-size="42" font-weight="700" fill="#F6F2E9" text-anchor="middle" letter-spacing="6">A MEANINGFUL EXPERIENCE IN GUNA YALA</text>
  </svg>`,

  'gallery1.jpg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800"><rect width="1200" height="800" fill="#397D80"/><text x="600" y="400" font-family="'Cormorant Garamond', serif" font-size="36" fill="#F6F2E9" text-anchor="middle">SAN BLAS LAGOON</text></svg>`,
  'gallery2.jpg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800"><rect width="1200" height="800" fill="#102B35"/><text x="600" y="400" font-family="'Cormorant Garamond', serif" font-size="36" fill="#F6F2E9" text-anchor="middle">TRADITIONAL ULU</text></svg>`,
  'gallery3.jpg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800"><rect width="1200" height="800" fill="#B79A62"/><text x="600" y="400" font-family="'Cormorant Garamond', serif" font-size="36" fill="#102B35" text-anchor="middle">CARIBBEAN SUNSET</text></svg>`,
  'hero-islands.jpg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800"><rect width="1200" height="800" fill="#102B35"/><text x="600" y="400" font-family="'Cormorant Garamond', serif" font-size="36" fill="#F6F2E9" text-anchor="middle">HERO ISLANDS</text></svg>`,
  'san-blas-day-trip.jpg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800"><rect width="1200" height="800" fill="#102B35"/><text x="600" y="400" font-family="'Cormorant Garamond', serif" font-size="36" fill="#F6F2E9" text-anchor="middle">SAN BLAS DAY TRIP</text></svg>`,
  'island-stay.jpg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800"><rect width="1200" height="800" fill="#102B35"/><text x="600" y="400" font-family="'Cormorant Garamond', serif" font-size="36" fill="#F6F2E9" text-anchor="middle">ISLAND STAY</text></svg>`,
  'private-boat.jpg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800"><rect width="1200" height="800" fill="#102B35"/><text x="600" y="400" font-family="'Cormorant Garamond', serif" font-size="36" fill="#F6F2E9" text-anchor="middle">PRIVATE BOAT EXCURSION</text></svg>`,
  'panama-city.jpg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800"><rect width="1200" height="800" fill="#102B35"/><text x="600" y="400" font-family="'Cormorant Garamond', serif" font-size="36" fill="#F6F2E9" text-anchor="middle">PANAMA CITY TOUR</text></svg>`,
  'island-culture.jpg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800"><rect width="1200" height="800" fill="#102B35"/><text x="600" y="400" font-family="'Cormorant Garamond', serif" font-size="36" fill="#F6F2E9" text-anchor="middle">GUNA YALA CULTURE</text></svg>`
};

for (const [filename, content] of Object.entries(images)) {
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content.trim(), 'utf8');
  console.log(`Created ${filePath}`);
}
