export interface TourDetail {
  id: string;
  badgeEs: string;
  badgeEn: string;
  isPrivate: boolean;
  titleEs: string;
  titleEn: string;
  subtitleEs: string;
  subtitleEn: string;
  priceDisplayEs: string;
  priceDisplayEn: string;
  shortDescriptionEs: string;
  shortDescriptionEn: string;
  fullDescriptionEs: string;
  fullDescriptionEn: string;
  imageKey: string;
  inclusionsEs: string[];
  inclusionsEn: string[];
  lunchOptionsEs?: string[];
  lunchOptionsEn?: string[];
  exclusionsEs: string[];
  exclusionsEn: string[];
  recommendationsEs?: string[];
  recommendationsEn?: string[];
  importantInfoEs?: string[];
  importantInfoEn?: string[];
  marketingClosingEs?: string;
  marketingClosingEn?: string;
  whatsappMessageEs: string;
  whatsappMessageEn: string;
  itineraryTimeline?: {
    time: string;
    titleEs: string;
    titleEn: string;
    descriptionEs: string;
    descriptionEn: string;
    activitiesEs?: string[];
    activitiesEn?: string[];
  }[];
}

export const toursData: TourDetail[] = [
  {
    id: 'private-full-day',
    badgeEs: 'PRIVADO',
    badgeEn: 'PRIVATE',
    isPrivate: true,
    titleEs: 'SAN BLAS (GUNA YALA) PRIVATE FULL DAY',
    titleEn: 'SAN BLAS (GUNA YALA) FULL-DAY PRIVATE EXPERIENCE',
    subtitleEs: 'Experiencia de un día completo',
    subtitleEn: 'FULL-DAY PRIVATE EXPERIENCE',
    priceDisplayEs: 'TOUR PRIVADO • HASTA 3 PERSONAS • $850',
    priceDisplayEn: 'PRIVATE TOUR • UP TO 3 PEOPLE • $850',
    shortDescriptionEs: 'Excursión exclusiva y privada con transporte 4x4 privado, lancha privada, almuerzo buffet gourmet con mariscos y visitas personalizadas a 2 islas y la piscina natural.',
    shortDescriptionEn: 'Exclusive private full-day excursion featuring private 4x4 land transport, private boat, gourmet buffet lunch with seafood, and personalized visits to 2 islands and the natural pool.',
    fullDescriptionEs: 'Diseñado para viajeros que buscan máxima privacidad y flexibilidad. Disfruta de un transporte exclusivo ida y vuelta desde tu hotel en Ciudad de Panamá, lancha privada durante todo el día, guía local 100% indígena Guna y un almuerzo buffet gourmet frente al mar.',
    fullDescriptionEn: 'Designed for discerning travelers seeking complete privacy and flexibility. Enjoy exclusive door-to-door private transportation from your Panama City hotel, a private boat all day, a 100% Indigenous Guna guide, and a gourmet oceanfront buffet lunch.',
    imageKey: 'tour2', // Private boat / pristine island photo
    inclusionsEs: [
      'Transporte terrestre privado desde tu hotel en Ciudad de Panamá y retorno.',
      'Lancha / bote privado para todo el día.',
      'Guía local — 100% Indígena Guna.',
      'Almuerzo estilo buffet con bebida y frutas frescas.',
      'Recorrido por 3 destinos principales: 2 islas + 1 piscina natural.',
      'Chalecos salvavidas a bordo.',
      'Equipo de primeros auxilios.',
      'Equipo completo de snorkel.'
    ],
    inclusionsEn: [
      'Private ground transportation from your Panama City hotel and return.',
      'Private boat for the entire day.',
      'Local guide — 100% Indigenous Guna.',
      'Buffet-style lunch with beverage and fresh fruits.',
      'Tours to 3 prime locations: 2 islands + 1 natural pool.',
      'Life jackets on board.',
      'First-aid safety equipment.',
      'Snorkeling equipment included.'
    ],
    lunchOptionsEs: ['Langosta', 'Pescado fresco', 'Pollo', 'Mariscos variados'],
    lunchOptionsEn: ['Lobster', 'Fresh Fish', 'Chicken', 'Seafood selection'],
    exclusionsEs: [
      'Impuesto de entrada a la Comarca Guna Yala (en efectivo): $22.00 extranjeros / $10.00 panameños y residentes.',
      'Propinas opcionales para el equipo.'
    ],
    exclusionsEn: [
      'Comarca Guna Yala entry tax (Cash only): $22.00 foreign visitors / $10.00 Panamanians or residents.',
      'Optional staff gratuities.'
    ],
    recommendationsEs: [
      'Efectivo suficiente para el impuesto de entrada a la comarca y compras artesanales.',
      'Pasaporte original o cédula panameña vigente.',
      'Protector solar biodegradable.',
      'Sandalias de playa.',
      'Muda de ropa seca de cambio para el regreso.',
      'Toalla de playa.',
      'Una sonrisa y entusiasmo para disfrutar la experiencia.'
    ],
    recommendationsEn: [
      'Cash for comarca entry taxes and local handcrafted souvenirs.',
      'Original valid passport or Panamanian ID (cédula).',
      'Sunscreen.',
      'Beach sandals.',
      'Change of dry clothes for after getting wet.',
      'Beach towel.',
      'A smile and enthusiasm to enjoy the experience.'
    ],
    marketingClosingEs: 'Vive, conoce y disfruta con una sonrisa una de las mejores playas del Caribe Panameño.',
    marketingClosingEn: 'Experience, discover, and enjoy with a smile one of the finest beaches in the Panamanian Caribbean.',
    whatsappMessageEs: 'Hola, quisiera información sobre el tour privado Full Day en San Blas.',
    whatsappMessageEn: 'Hello, I would like information about the San Blas Private Full Day tour.'
  },
  {
    id: 'shared-full-day',
    badgeEs: 'COMPARTIDO',
    badgeEn: 'SHARED',
    isPrivate: false,
    titleEs: 'FULL DAY EN SAN BLAS (GUNA YALA)',
    titleEn: 'FULL DAY IN SAN BLAS (GUNA YALA)',
    subtitleEs: 'Pasadía Compartido',
    subtitleEn: 'Shared Day Trip',
    priceDisplayEs: 'CONSULTAR PRECIO',
    priceDisplayEn: 'CONTACT FOR PRICING',
    shortDescriptionEs: 'Un día completo explorando las icónicas aguas de San Blas. Incluye transporte 4x4 compartido con A/C, traslado en lancha, almuerzo con bebida e itinerario guiado a Isla Chichime Chico, Piscina Natural e Isla Diablo.',
    shortDescriptionEn: 'A full-day excursion exploring iconic San Blas. Includes shared air-conditioned 4x4 transport, speedboat transfer, lunch with beverage, and a guided itinerary to Isla Chichime Chico, Natural Pool, and Isla Diablo.',
    fullDescriptionEs: 'Viaja junto a otros aventureros hacia el archipiélago de Guna Yala. Nuestro pasadía compartido ofrece traslados ida y vuelta en vehículo 4x4 con aire acondicionado, lancha rápida, guía local indígena y un itinerario planificado a tres de las joyas más hermosas del Caribe.',
    fullDescriptionEn: 'Travel alongside fellow adventurers to the Guna Yala archipelago. Our shared full-day tour includes round-trip air-conditioned 4x4 transport, speedboat transfers, local Indigenous guide, and a curated itinerary visiting three Caribbean gems.',
    imageKey: 'tour1', // Chichime & Diablo photo
    inclusionsEs: [
      'Transporte terrestre ida y vuelta en vehículo 4x4 compartido con aire acondicionado (hasta 6 pasajeros).',
      'Transporte marítimo en lancha rápida compartida (hasta 15 pasajeros).',
      'Guía local — 100% Indígena Guna.',
      'Almuerzo incluido con bebida (agua o soda).',
      'Recorrido guiado por 2 islas + 1 piscina natural.',
      'Chalecos salvavidas a bordo.',
      'Equipo de primeros auxilios.'
    ],
    inclusionsEn: [
      'Round-trip transportation in shared air-conditioned 4x4 vehicle (up to 6 passengers).',
      'Maritime transport in shared speedboat (up to 15 passengers).',
      'Local guide — 100% Indigenous Guna.',
      'Included lunch with beverage (water or soda).',
      'Guided visits to 2 islands + 1 natural pool.',
      'Life jackets on board.',
      'First-aid safety kit.'
    ],
    exclusionsEs: [
      'Impuesto de entrada a la Comarca Guna Yala (Monto por confirmar).',
      'Bebidas alcohólicas y cervezas no están incluidas (disponibles para compra local).'
    ],
    exclusionsEn: [
      'Comarca Guna Yala entry tax (Price to be confirmed).',
      'Alcoholic beverages and beer are NOT included (available for purchase locally).'
    ],
    importantInfoEs: [
      'Capacidad del vehículo 4x4: Hasta 6 pasajeros por auto.',
      'Capacidad de la lancha: Hasta 15 pasajeros por bote.',
      'Bebidas con el almuerzo: Incluye agua o soda.',
      'Seguridad: Chalecos salvavidas y botiquín disponible a bordo.'
    ],
    importantInfoEn: [
      'Ground 4x4 Vehicle Capacity: Up to 6 passengers per vehicle.',
      'Speedboat Capacity: Up to 15 passengers per boat.',
      'Lunch Beverages: Water or soda included with meal.',
      'Safety: Life jackets and first-aid equipment available on board.'
    ],
    whatsappMessageEs: 'Hola, quisiera información sobre el tour compartido Full Day en San Blas.',
    whatsappMessageEn: 'Hello, I would like information about the San Blas Shared Full Day tour.',
    itineraryTimeline: [
      {
        time: '05:00 AM – 05:45 AM',
        titleEs: 'Recogida en Hotel / Salida desde Ciudad de Panamá',
        titleEn: 'Hotel Pickup / Departure from Panama City',
        descriptionEs: 'Recogida directamente en tu hotel en Ciudad de Panamá en vehículo 4x4 compartido con aire acondicionado. Inicio del viaje hacia la comarca Guna Yala (apróx. 2 horas de recorrido por carretera).',
        descriptionEn: 'Pickup directly at your Panama City hotel in a shared air-conditioned 4x4 vehicle. Begin the road journey toward Guna Yala (approx. 2 hours travel).'
      },
      {
        time: '08:40 AM – 09:15 AM',
        titleEs: 'Llegada al Puerto / Abordaje',
        titleEn: 'Arrival at Port / Boarding',
        descriptionEs: 'Recepción por parte del guía local 100% indígena Guna en el puerto de embarque. Organización de grupos y preparación para la salida marítima.',
        descriptionEn: 'Greeted by your 100% Indigenous Guna local guide at the port. Group orientation and preparation for boat departure.'
      },
      {
        time: '09:15 AM – 09:40 AM',
        titleEs: 'Zarpe hacia la Primera Isla',
        titleEn: 'Boat Departure to First Island',
        descriptionEs: 'Navegación en lancha rápida compartida con destino a Isla Chichime Chico (apróx. 25 minutos de trayecto sobre mar turquesa).',
        descriptionEn: 'Boat navigation across turquoise Caribbean waters toward Isla Chichime Chico (approx. 25-minute trip).'
      },
      {
        time: '10:00 AM – 12:30 PM',
        titleEs: 'PRIMERA PARADA — ISLA CHICHIME CHICO',
        titleEn: 'FIRST STOP — ISLA CHICHIME CHICO',
        descriptionEs: 'Llegada a las 10:00 AM. Tiempo libre para nadar, relajarse y disfrutar del entorno paradisíaco. A las 11:30 AM se sirve el almuerzo incluido con bebida refrescante. A las 12:30 PM salida hacia la siguiente parada.',
        descriptionEn: '10:00 AM Arrival. Free time to swim, relax, and soak in the island setting. At 11:30 AM, enjoy included lunch with a refreshing beverage. Departure at 12:30 PM.',
        activitiesEs: ['Nadar y relajarse en la playa', 'Almuerzo insular incluido (11:30 AM)', 'Fotografía escénica'],
        activitiesEn: ['Swimming & beach relaxation', 'Included island lunch (11:30 AM)', 'Scenic photography']
      },
      {
        time: '12:35 PM – 01:00 PM',
        titleEs: 'SEGUNDA PARADA — PISCINA NATURAL',
        titleEn: 'SECOND STOP — NATURAL POOL',
        descriptionEs: 'Ubicada a solo 5 minutos de Chichime Chico. Un impresionante banco de arena de agua poco profunda a la cintura en medio del océano.',
        descriptionEn: 'Located just 5 minutes from Chichime Chico. A stunning waist-deep shallow sandbank surrounded by open turquoise sea.',
        activitiesEs: ['Baño en mar abierto poco profundo', 'Fotografía en el banco de arena', 'Observación de entorno marino'],
        activitiesEn: ['Shallow open-sea swimming', 'Sandbank photography', 'Marine environment observation']
      },
      {
        time: '01:00 PM – 03:00 PM',
        titleEs: 'TERCERA PARADA — ISLA DIABLO',
        titleEn: 'THIRD STOP — ISLA DIABLO',
        descriptionEs: 'A solo 3 minutos de la piscina natural. Llegada a la 01:05 PM a Isla Diablo. Tiempo libre para disfrutar de la playa, descansar y explorar. A las 03:00 PM el guía reúne al grupo.',
        descriptionEn: 'Just 3 minutes from the natural pool. 01:05 PM arrival at Isla Diablo. Free time to enjoy the beach, rest, and explore. At 03:00 PM, guide gathers the group for departure.',
        activitiesEs: ['Tiempo libre de playa y descanso', 'Caminata alrededor de la isla', 'Preparación para el regreso (03:00 PM)'],
        activitiesEn: ['Free beach & rest time', 'Island walk around the perimeter', 'Departure gathering (03:00 PM)']
      },
      {
        time: '03:15 PM – 03:45 PM',
        titleEs: 'Regreso al Puerto',
        titleEn: 'Return Boat Trip to Port',
        descriptionEs: 'Navegación de retorno en lancha hacia el puerto continental (apróx. 25 minutos).',
        descriptionEn: 'Return boat trip back to the mainland port (approx. 25 minutes).'
      },
      {
        time: '04:00 PM',
        titleEs: 'Retorno a Ciudad de Panamá',
        titleEn: 'Return Transport to Panama City',
        descriptionEs: 'Llegada al puerto donde el conductor del vehículo 4x4 estará esperando para iniciar el viaje de regreso hasta tu hotel.',
        descriptionEn: 'Arrival at port where your 4x4 driver awaits for the return road trip to your hotel.'
      }
    ]
  }
];
