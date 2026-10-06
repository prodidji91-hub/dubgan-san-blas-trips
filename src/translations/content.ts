export type Language = 'en' | 'es';

export interface TourItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Translations {
  nav: {
    home: string;
    tours: string;
    gunaYala: string;
    about: string;
    contact: string;
    whatsappPhone: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    btnExplore: string;
    btnWhatsapp: string;
    locationTitle: string;
    locationSub: string;
  };
  culture: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    body: string;
    btnLearnMore: string;
    guidanceTitle: string;
    guidanceText: string;
  };
  experiences: {
    eyebrow: string;
    title: string;
    intro: string;
    viewDetails: string;
    inquireWhatsapp: string;
    disclaimer: string;
    tours: TourItem[];
  };
  story: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    playVideo: string;
  };
  destination: {
    eyebrow: string;
    title: string;
    description: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
  };
  aboutSection: {
    eyebrow: string;
    title: string;
    description: string;
    boxTitle: string;
    boxText: string;
    ctaWhatsapp: string;
  };
  gallerySection: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: FAQItem[];
  };
  form: {
    eyebrow: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    dateLabel: string;
    datePlaceholder: string;
    travelersLabel: string;
    travelersPlaceholder: string;
    tourLabel: string;
    tourDefault: string;
    messageLabel: string;
    messagePlaceholder: string;
    btnSubmit: string;
    notice: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    directContact: string;
    phoneLabel: string;
    copyright: string;
    legalNote: string;
  };
}

export const content: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      tours: 'Tours',
      gunaYala: 'Guna Yala',
      about: 'About',
      contact: 'Contact',
      whatsappPhone: '+507 6143-6120',
    },
    hero: {
      eyebrow: 'DISCOVER',
      title: 'GUNA YALA',
      subtitle: 'BEYOND THE ORDINARY',
      description: 'Crystal-clear waters, pristine islands, and authentic cultural experiences in one of the world\'s most unique destinations.',
      btnExplore: 'EXPLORE OUR EXPERIENCES',
      btnWhatsapp: 'WHATSAPP US',
      locationTitle: 'SAN BLAS ISLANDS',
      locationSub: 'PANAMA, PANAMA',
    },
    culture: {
      eyebrow: 'CULTURE AND ISLANDS',
      titleLine1: 'THE ESSENCE',
      titleLine2: 'OF GUNA YALA',
      body: 'Explore breathtaking islands and discover a living culture known for its traditions, craftsmanship, and deep connection to the sea. Our experiences invite you to appreciate the natural beauty and cultural richness of Guna Yala in a respectful and authentic way.',
      btnLearnMore: 'LEARN MORE',
      guidanceTitle: 'Respectful Visitor Guidance',
      guidanceText: 'Always follow local community guidance and respectfully ask permission before taking photographs of community members.',
    },
    experiences: {
      eyebrow: 'OUR EXPERIENCES',
      title: 'EXPLORE OUR TOURS',
      intro: 'Discover hand-crafted itineraries designed for unforgettable island journeys and genuine cultural encounters across the Guna Yala archipelago.',
      viewDetails: 'View Details',
      inquireWhatsapp: 'Inquire on WhatsApp',
      disclaimer: 'Proposed tour categories subject to direct confirmation with the owner.',
      tours: [
        {
          id: 'tour1',
          title: 'ISLAND HOPPING TOUR',
          subtitle: 'Day Excursion',
          description: 'Explore multiple pristine islands, natural ocean pools, and turquoise coral lagoons in a single day.',
          highlights: ['Visit scenic cays and natural pools', 'Crystal-clear swimming and snorkeling', 'Comfortable round-trip island transport'],
        },
        {
          id: 'tour2',
          title: 'PRIVATE ISLAND EXPERIENCE',
          subtitle: 'Overnight Stay',
          description: 'Immerse yourself in tranquil island living with overnight cabana stays and starlit Caribbean evenings.',
          highlights: ['Overnight beachfront cabana lodging', 'Breathtaking sunrises & sunsets', 'Peaceful natural atmosphere'],
        },
        {
          id: 'tour3',
          title: 'SNORKELING ADVENTURE',
          subtitle: 'Reef & Boat Tour',
          description: 'Glide through crystal-clear waters to discover vibrant marine life, sunken reefs, and natural sandbars.',
          highlights: ['Vibrant reef snorkeling stops', 'Guided boat navigation', 'Exploration of natural ocean shallow pools'],
        },
      ],
    },
    story: {
      eyebrow: 'MORE THAN A DESTINATION',
      titleLine1: 'A MEANINGFUL',
      titleLine2: 'EXPERIENCE',
      description: 'Experience the natural beauty, cultural richness, and warm hospitality that make Guna Yala a truly special place.',
      playVideo: 'Watch Island Story',
    },
    destination: {
      eyebrow: 'THE ARCHIPELAGO',
      title: 'ABOUT GUNA YALA',
      description: 'Guna Yala (San Blas) encompasses over 360 Caribbean islands governed by the indigenous Guna people, preserving an extraordinary environment of coral reefs and palm-fringed sandbars.',
      card1Title: '365 Tropical Islands',
      card1Desc: 'An unspoiled paradise of tiny coconut palm islets surrounded by shallow turquoise waters.',
      card2Title: 'Living Culture',
      card2Desc: 'Heritage characterized by intricate Mola textiles, maritime traditions, and self-governing wisdom.',
      card3Title: 'Untouched Marine Life',
      card3Desc: 'Vibrant coral reefs, starfish sandbars, and serene natural pools filled with clear Caribbean waters.',
    },
    aboutSection: {
      eyebrow: 'START A CONVERSATION',
      title: 'YOUR ADVENTURE BEGINS WITH DUBGAN',
      description: 'Dubgan San Blas Trips is your direct contact for coordinating personalized island tours and getaways across Guna Yala.',
      boxTitle: 'How we coordinate your inquiry',
      boxText: 'Share your preferred travel dates, party size, and travel style. We will respond directly on WhatsApp with availability and guidance.',
      ctaWhatsapp: 'Chat on WhatsApp (+507 6143-6120)',
    },
    gallerySection: {
      eyebrow: 'VISUAL INSPIRATION',
      title: 'THE SAN BLAS GALLERY',
      subtitle: 'Capturing the serenity, turquoise waters, and timeless landscapes of the Guna Yala archipelago.',
    },
    faq: {
      eyebrow: 'TRAVEL ESSENTIALS',
      title: 'FREQUENTLY ASKED QUESTIONS',
      items: [
        {
          question: 'How do travelers reach the islands from Panama City?',
          answer: 'Trips typically depart early in the morning from Panama City in 4x4 vehicles traversing the Guna Yala hills to the port, followed by a scenic boat ride to the islands.',
        },
        {
          question: 'What should visitors pack for an island excursion?',
          answer: 'We recommend light beachwear, passport (mandatory for port entry), cash in US Dollars (small denominations), eco-friendly sunscreen, towel, and waterproof bags for electronics.',
        },
        {
          question: 'What is the best season to visit San Blas?',
          answer: 'Guna Yala is beautiful year-round. The dry season (December through April) brings tropical breezes, while the green season (May through November) brings calmer seas and glassy waters.',
        },
        {
          question: 'Are cultural photography guidelines strictly observed?',
          answer: 'Yes. Out of deep respect for the Guna people, visitors should always politely ask permission before taking photographs of community members or families.',
        },
      ],
    },
    form: {
      eyebrow: 'INQUIRE TODAY',
      title: 'PLAN YOUR GUNA YALA TRIP',
      subtitle: 'Fill in your trip details to generate a formatted WhatsApp message directly to Dubgan San Blas Trips.',
      nameLabel: 'Full Name',
      namePlaceholder: 'e.g. Eleanor Vance',
      dateLabel: 'Preferred Travel Date',
      datePlaceholder: 'e.g. November 12th',
      travelersLabel: 'Number of Travelers',
      travelersPlaceholder: 'e.g. 2 guests',
      tourLabel: 'Experience of Interest',
      tourDefault: 'Select an experience',
      messageLabel: 'Additional Message or Questions',
      messagePlaceholder: 'Share any preferences, dates, or questions...',
      btnSubmit: 'SEND INQUIRY VIA WHATSAPP',
      notice: 'This inquiry does not confirm a booking. Details and availability will be confirmed directly with you.',
    },
    footer: {
      tagline: 'Authentic cultural discovery combined with premium island travel in San Blas, Panama.',
      quickLinks: 'Navigation',
      directContact: 'Direct Contact',
      phoneLabel: 'Phone / WhatsApp:',
      copyright: 'Dubgan San Blas Trips. All rights reserved.',
      legalNote: 'Boutique travel sample for owner presentation.',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      tours: 'Tours',
      gunaYala: 'Guna Yala',
      about: 'Nosotros',
      contact: 'Contacto',
      whatsappPhone: '+507 6143-6120',
    },
    hero: {
      eyebrow: 'DESCUBRE',
      title: 'GUNA YALA',
      subtitle: 'MÁS ALLÁ DE LO ORDINARIO',
      description: 'Aguas cristalinas, islas prístinas y experiencias culturales auténticas en uno de los destinos más únicos del mundo.',
      btnExplore: 'EXPLORAR NUESTRAS EXPERIENCIAS',
      btnWhatsapp: 'CONTÁCTANOS POR WHATSAPP',
      locationTitle: 'ISLAS DE SAN BLAS',
      locationSub: 'PANAMÁ, PANAMÁ',
    },
    culture: {
      eyebrow: 'CULTURA E ISLAS',
      titleLine1: 'LA ESENCIA',
      titleLine2: 'DE GUNA YALA',
      body: 'Explora islas impresionantes y descubre una cultura viva conocida por sus tradiciones, artesanía y profunda conexión con el mar. Nuestras experiencias te invitan a apreciar la belleza natural y la riqueza cultural de Guna Yala de forma respetuosa y auténtica.',
      btnLearnMore: 'CONOCER MÁS',
      guidanceTitle: 'Guía de Respeto al Visitante',
      guidanceText: 'Sigue siempre la orientación de las comunidades locales y solicita permiso respetuosamente antes de tomar fotografías a sus habitantes.',
    },
    experiences: {
      eyebrow: 'NUESTRAS EXPERIENCIAS',
      title: 'EXPLORA NUESTROS TOURS',
      intro: 'Descubre itinerarios diseñados para viajes insulares inolvidables y genuinos encuentros culturales a través del archipiélago de Guna Yala.',
      viewDetails: 'Ver detalles',
      inquireWhatsapp: 'Consultar por WhatsApp',
      disclaimer: 'Categorías de tour sujetas a confirmación directa con el propietario.',
      tours: [
        {
          id: 'tour1',
          title: 'ISLAND HOPPING TOUR',
          subtitle: 'Excursión de un Día',
          description: 'Explora múltiples islas prístinas, piscinas naturales en el océano y lagunas turquesa de coral en un solo día.',
          highlights: ['Visita a cayos escénicos y piscinas naturales', 'Baño y snorkel en aguas cristalinas', 'Transporte insular cómodo de ida y vuelta'],
        },
        {
          id: 'tour2',
          title: 'EXPERIENCIA EN ISLA PRIVADA',
          subtitle: 'Estancia Nocturna',
          description: 'Sumérgete en la tranquila vida insular con estancias en cabañas y noches caribeñas bajo las estrellas.',
          highlights: ['Hospedaje en cabaña insular frente al mar', 'Amaneceres y atardeceres caribeños', 'Ambiente de paz y naturaleza'],
        },
        {
          id: 'tour3',
          title: 'AVENTURA DE SNORKEL',
          subtitle: 'Tour de Arrecifes',
          description: 'Navega por aguas cristalinas para descubrir vibrante vida marina, arrecifes sumergidos y bancos de arena.',
          highlights: ['Paradas de snorkel en arrecifes vibrantes', 'Navegación guiada en barco', 'Exploración de piscinas marinas poco profundas'],
        },
      ],
    },
    story: {
      eyebrow: 'MÁS QUE UN DESTINO',
      titleLine1: 'UNA EXPERIENCIA',
      titleLine2: 'CON SIGNIFICADO',
      description: 'Experimenta la belleza natural, la riqueza cultural y la cálida hospitalidad que hacen de Guna Yala un lugar verdaderamente especial.',
      playVideo: 'Ver Historia Insular',
    },
    destination: {
      eyebrow: 'EL ARCHIPIÉLAGO',
      title: 'SOBRE GUNA YALA',
      description: 'Guna Yala (San Blas) abarca más de 360 islas caribeñas bajo la autonomía del pueblo Guna, preservando un entorno marino extraordinario.',
      card1Title: '365 Islas Tropicales',
      card1Desc: 'Un paraíso virgen de pequeños cayos con palmeras rodeados de tranquilas aguas turquesa.',
      card2Title: 'Cultura Viva',
      card2Desc: 'Patrimonio caracterizado por las elaboradas molas textiles, tradiciones marineras y autogobierno ancestral.',
      card3Title: 'Vida Marina Inexplorada',
      card3Desc: 'Vibrantes arrecifes de coral, piscinas naturales con estrellas de mar y aguas caribeñas de absoluta claridad.',
    },
    aboutSection: {
      eyebrow: 'EMPIEZA UNA CONVERSACIÓN',
      title: 'TU AVENTURA COMIENZA CON DUBGAN',
      description: 'Dubgan San Blas Trips es tu contacto directo para coordinar tours insulares personalizados y escapadas a San Blas.',
      boxTitle: 'Cómo coordinamos tu consulta',
      boxText: 'Compártenos tus fechas preferidas, cantidad de viajeros y estilo de viaje. Te responderemos directamente por WhatsApp.',
      ctaWhatsapp: 'Conversar por WhatsApp (+507 6143-6120)',
    },
    gallerySection: {
      eyebrow: 'INSPIRACIÓN VISUAL',
      title: 'LA GALERÍA SAN BLAS',
      subtitle: 'Capturando la serenidad, las aguas turquesa y los paisajes atemporales del archipiélago de Guna Yala.',
    },
    faq: {
      eyebrow: 'INFORMACIÓN DE VIAJE',
      title: 'PREGUNTAS FRECUENTES',
      items: [
        {
          question: '¿Cómo se llega a las islas desde Ciudad de Panamá?',
          answer: 'Los viajes suelen salir temprano por la mañana desde Ciudad de Panamá en vehículos 4x4 cruzando la cordillera de Guna Yala hacia el puerto, seguido de un trayecto en bote hacia las islas.',
        },
        {
          question: '¿Qué se recomienda empacar para una excursión insular?',
          answer: 'Recomendamos ropa de playa liviana, pasaporte original (obligatorio para el ingreso a la comarca), efectivo en USD (denominaciones pequeñas), protector solar amigable con arrecifes y toalla.',
        },
        {
          question: '¿Cuál es la mejor época para visitar San Blas?',
          answer: 'Guna Yala es hermosa todo el año. La temporada seca (diciembre a abril) trae brisas tropicales, mientras que la temporada verde (mayo a noviembre) ofrece mar calmo como un espejo.',
        },
        {
          question: '¿Se observan normas de respeto fotográfico cultural?',
          answer: 'Sí. Por profundo respeto a la comunidad Guna, los visitantes siempre deben solicitar permiso amablemente antes de fotografiar a sus habitantes.',
        },
      ],
    },
    form: {
      eyebrow: 'CONSULTA HOY',
      title: 'PLANIFICA TU VIAJE A GUNA YALA',
      subtitle: 'Llena tus datos para generar un mensaje de WhatsApp con formato directo para Dubgan San Blas Trips.',
      nameLabel: 'Nombre y Apellido',
      namePlaceholder: 'Ej. Elena Vance',
      dateLabel: 'Fecha Preferida de Viaje',
      datePlaceholder: 'Ej. 12 de Noviembre',
      travelersLabel: 'Número de Viajeros',
      travelersPlaceholder: 'Ej. 2 personas',
      tourLabel: 'Experiencia de Interés',
      tourDefault: 'Selecciona una experiencia',
      messageLabel: 'Mensaje o Preguntas Adicionales',
      messagePlaceholder: 'Escribe aquí tus fechas o dudas...',
      btnSubmit: 'ENVIAR CONSULTA POR WHATSAPP',
      notice: 'Esta consulta no confirma una reserva. Los detalles y la disponibilidad se confirmarán directamente contigo.',
    },
    footer: {
      tagline: 'Descubrimiento cultural auténtico combinado con viajes insulares de primera en San Blas, Panamá.',
      quickLinks: 'Navegación',
      directContact: 'Contacto Directo',
      phoneLabel: 'Teléfono / WhatsApp:',
      copyright: 'Dubgan San Blas Trips. Todos los derechos reservados.',
      legalNote: 'Muestra comercial para presentación.',
    },
  },
};
