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
      'Impuestos de entrada a Guna Yala no incluidos: extranjeros $22 USD por persona; panameños y residentes $7 USD por persona.',
      'Propinas opcionales para el equipo.'
    ],
    exclusionsEn: [
      'Guna Yala entry taxes are not included: foreign visitors $22 USD per person; Panamanians and residents $7 USD per person.',
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
    whatsappMessageEs: 'Hola, quisiera información sobre el tour privado Full Day en San Blas ($850 USD para hasta 3 personas).',
    whatsappMessageEn: 'Hello, I would like information about the San Blas Private Full Day tour ($850 USD for up to 3 people).'
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
    priceDisplayEs: '$135 USD por persona',
    priceDisplayEn: '$135 USD per person',
    shortDescriptionEs: 'Un día completo explorando las joyas de San Blas. Incluye transporte terrestre compartido de ida y vuelta desde tu hotel en la Ciudad de Panamá, transporte en lancha durante el día, guía local indígena Guna, almuerzo con bebida y visitas guiadas a una comunidad, dos islas y la piscina natural.',
    shortDescriptionEn: 'A full-day excursion exploring the gems of San Blas. Includes round-trip shared ground transportation from your hotel in Panama City, boat transportation during the day, a local Indigenous Guna guide, lunch with a drink, and guided visits to one community, two islands, and the natural pool.',
    fullDescriptionEs: 'Viaja junto a otros aventureros hacia el archipiélago de Guna Yala en un pasadía completamente organizado. Disfruta de transporte terrestre de ida y vuelta desde tu hotel, transporte en lancha durante el día, la compañía de un guía local indígena Guna, almuerzo con bebida y un recorrido para descubrir una comunidad indígena, dos islas de ensueño y la espectacular piscina natural.',
    fullDescriptionEn: 'Travel alongside fellow adventurers to the spectacular Guna Yala archipelago on a fully organized day trip. Enjoy convenient round-trip ground transportation from your hotel, boat transportation during the day, a local Indigenous Guna guide, lunch with a drink, and a curated tour visiting one Indigenous community, two dream islands, and the breathtaking natural pool.',
    imageKey: 'tour1', // Chichime & Diablo photo
    inclusionsEs: [
      'Transporte terrestre de ida y vuelta desde tu hotel en la Ciudad de Panamá.',
      'Transporte marítimo en lancha durante el día.',
      'Guía local indígena Guna.',
      'Almuerzo con una bebida.',
      'Visitas a cuatro lugares: una comunidad, dos islas y la piscina natural.',
      'Chaleco salvavidas y equipo de primeros auxilios.'
    ],
    inclusionsEn: [
      'Round-trip ground transportation from the guest’s hotel in Panama City.',
      'Boat transportation during the day.',
      'Local Indigenous Guna guide.',
      'Lunch with a drink.',
      'Visits to four places: one community, two islands, and the natural pool.',
      'Life jacket and first-aid equipment.'
    ],
    exclusionsEs: [
      'Impuestos de entrada a Guna Yala no incluidos: extranjeros $22 USD por persona; panameños y residentes $7 USD por persona.',
      'Bebidas adicionales y cervezas no incluidas.'
    ],
    exclusionsEn: [
      'Guna Yala entry taxes are not included: foreign visitors $22 USD per person; Panamanians and residents $7 USD per person.',
      'Additional beverages and beer are NOT included.'
    ],
    importantInfoEs: [
      'Capacidad de transporte: Vehículo 4x4 compartido y lancha segura.',
      'Almuerzo: Incluye plato fresco y una bebida.',
      'Impuestos: El pago de entrada a la comarca debe realizarse en efectivo en la frontera.'
    ],
    importantInfoEn: [
      'Transport Capacity: Shared 4x4 vehicle and safe speedboat.',
      'Lunch: Freshly prepared meal and one drink included.',
      'Taxes: Comarca entry taxes must be paid in cash at the border.'
    ],
    whatsappMessageEs: 'Hola, quisiera información sobre el tour compartido Full Day en San Blas de $135 USD.',
    whatsappMessageEn: 'Hello, I would like information about the San Blas Shared Full Day tour for $135 USD.',
    itineraryTimeline: [
      {
        time: 'Morning / Mañana',
        titleEs: 'Recogida en Ciudad de Panamá',
        titleEn: 'Panama City Pickup',
        descriptionEs: 'Comenzamos el día temprano con transporte terrestre de ida y vuelta en un vehículo compartido directamente desde tu hotel en la Ciudad de Panamá.',
        descriptionEn: 'We begin early with round-trip ground transportation in a shared vehicle directly from your hotel in Panama City.'
      },
      {
        time: 'Morning / Mañana',
        titleEs: 'Embarque y Navegación',
        titleEn: 'Boarding & Speedboat Transit',
        descriptionEs: 'Llegada al puerto de embarque. Con la asistencia de tu guía local indígena Guna, abordarás la lancha para iniciar la navegación a través de las hermosas aguas del Caribe.',
        descriptionEn: 'Arrival at the port. Assisted by your local Indigenous Guna guide, you will board the boat to begin navigating the beautiful Caribbean waters.'
      },
      {
        time: 'Midday / Mediodía',
        titleEs: 'Visitas guiadas y Almuerzo en el Paraíso',
        titleEn: 'Guided Island Visits & Lunch',
        descriptionEs: 'Exploración de las maravillas de Guna Yala. Durante el día visitaremos cuatro lugares espectaculares: una comunidad local para conocer su rica cultura, dos hermosas islas de arena blanca y la espectacular piscina natural de agua cristalina. Se servirá un almuerzo fresco con una bebida incluida.',
        descriptionEn: 'Explore the wonders of Guna Yala. Throughout the day, we will visit four spectacular places: a local Indigenous community to experience their rich culture, two beautiful white-sand islands, and the breathtaking natural pool. A fresh lunch with an included drink will be served.',
        activitiesEs: [
          'Visita a 1 comunidad indígena Guna',
          'Visita a 2 islas caribeñas',
          'Baño en la piscina natural',
          'Almuerzo con bebida incluido'
        ],
        activitiesEn: [
          'Visit 1 local Indigenous Guna community',
          'Visit 2 Caribbean islands',
          'Swim in the natural pool',
          'Lunch with included drink'
        ]
      },
      {
        time: 'Afternoon / Tarde',
        titleEs: 'Retorno a la Ciudad de Panamá',
        titleEn: 'Return to Panama City',
        descriptionEs: 'Abordamos la lancha de regreso al puerto. Desde allí, el transporte terrestre compartido te llevará de vuelta de forma segura y cómoda directamente hasta tu hotel en la Ciudad de Panamá.',
        descriptionEn: 'We board the return boat to the port. From there, the shared ground transportation will take you safely and comfortably back to your hotel in Panama City.'
      }
    ]
  },
  {
    id: 'island-hopping-2-nights',
    badgeEs: '2 NOCHES',
    badgeEn: '2 NIGHTS',
    isPrivate: false,
    titleEs: 'ISLAND HOPPING — 2 NOCHES',
    titleEn: 'ISLAND HOPPING — 2 NIGHTS',
    subtitleEs: 'Paquete de Hospedaje en Islas',
    subtitleEn: 'Island Accommodation Package',
    priceDisplayEs: '$265 USD por persona',
    priceDisplayEn: '$265 USD per person',
    shortDescriptionEs: 'La experiencia caribeña definitiva en Guna Yala. Disfruta de 2 noches en cabañas privadas en Isla Aguja e Isla Chichime Chico, con transporte de ida y vuelta desde Ciudad de Panamá, recorridos guiados y alimentación completa incluida.',
    shortDescriptionEn: 'The ultimate Caribbean experience in Guna Yala. Enjoy 2 nights in private cabins on Aguja Island and Chichime Chico Island, with round-trip transportation from Panama City, guided tours, and full meals included.',
    fullDescriptionEs: 'Disfruta de una inolvidable estadía de 2 noches en las hermosas islas de Guna Yala. Te hospedarás en cabañas privadas en Isla Aguja e Isla Chichime Chico. Este paquete completamente organizado incluye traslados ida y vuelta en vehículo 4x4 con aire acondicionado, transporte en lancha entre islas durante tu estadía, un guía local indígena Guna, excursiones guiadas a dos islas y la piscina natural, y alimentación completa (6 comidas con bebidas).',
    fullDescriptionEn: 'Enjoy an unforgettable 2-night stay in the beautiful islands of Guna Yala. You will stay in private cabins on Aguja Island and Chichime Chico Island. This fully organized package includes round-trip ground transportation from your Panama City hotel in an air-conditioned 4x4, boat transportation between islands during your stay, a local Indigenous Guna guide, guided excursions to two islands and the natural pool, and full board (6 meals with drinks).',
    imageKey: 'aguja',
    inclusionsEs: [
      'Dos noches de hospedaje en cabaña (Isla Aguja: cabaña privada con baño privado; Isla Chichime Chico: cabaña privada frente a la playa con baño compartido).',
      'Transporte terrestre de ida y vuelta en vehículo 4x4 con aire acondicionado desde tu hotel en la Ciudad de Panamá.',
      'Transporte marítimo en lancha entre islas durante la estadía.',
      'Guía local indígena Guna.',
      'Excursiones visitando dos islas y la piscina natural.',
      'Alimentación completa: 6 comidas con bebidas (2 desayunos, 2 almuerzos y 2 cenas).',
      'Chaleco salvavidas y equipo de primeros auxilios.'
    ],
    inclusionsEn: [
      'Two nights of cabin accommodation (Isla Aguja: private cabin with private bathroom; Isla Chichime Chico: private beachfront cabin with shared bathroom).',
      'Round-trip transportation in an air-conditioned 4x4 from the guest’s hotel in Panama City.',
      'Boat transportation between islands during the stay.',
      'Local Indigenous Guna guide.',
      'Excursions visiting two islands and the natural pool.',
      'Six meals with drinks: two breakfasts, two lunches, and two dinners.',
      'Life jacket and first-aid equipment.'
    ],
    exclusionsEs: [
      'Impuestos de entrada a Guna Yala no incluidos: extranjeros $22 USD por persona; panameños y residentes $7 USD por persona. (Pago obligatorio en efectivo en la frontera).',
      'Propinas opcionales.',
      'Almuerzo para la opción de salida por la tarde ($10 USD adicionales por persona, no incluye bebida).'
    ],
    exclusionsEn: [
      'Guna Yala entry taxes are not included: foreign visitors $22 USD per person; Panamanians and residents $7 USD per person. (Mandatory cash payment at the border).',
      'Optional staff tips.',
      'Lunch for the afternoon departure option (costs an additional $10 USD per person, without a drink).'
    ],
    recommendationsEs: [
      'Efectivo suficiente para el impuesto de entrada a la comarca y compras de recuerdos o bebidas adicionales.',
      'Pasaporte original vigente o cédula de identidad personal.',
      'Protector solar biodegradable y repelente de insectos.',
      'Toalla de playa, sandalias y trajes de baño.',
      'Una muda de ropa seca adicional para el viaje de regreso.'
    ],
    recommendationsEn: [
      'Sufficient cash for comarca entry taxes, optional souvenirs, or extra beverages.',
      'Original valid passport or Panamanian ID card.',
      'Biodegradable sunscreen and insect repellent.',
      'Beach towel, sandals, and swimwear.',
      'An extra change of dry clothes for the return journey.'
    ],
    importantInfoEs: [
      'Hospedaje Confirmado: Cabañas privadas en Isla Aguja (baño privado) e Isla Chichime Chico (baño compartido). Las islas de hospedaje están confirmadas, pero la asignación exacta de noches no está predeterminada.',
      'Opciones de Retorno (horarios de salida de la isla): Salida estándar a las 7:30 AM. Salida opcional por la tarde a las 3:00 PM (debe coordinarse el día anterior).',
      'Almuerzo de Salida por la Tarde: No está incluido en la tarifa base; tiene un costo adicional de $10 USD por persona (no incluye bebida).',
      'Servicios de Transporte y Guía: Todos los transportes terrestres y marítimos, así como los recorridos y guías, se realizan en servicios de traslado estándar coordinados para su comodidad.'
    ],
    importantInfoEn: [
      'Confirmed Accommodation: Private cabins on Isla Aguja (private bathroom) and Isla Chichime Chico (shared bathroom). Accommodation islands are confirmed, but the exact night allocation is not predetermined.',
      'Return Options (island departure times): Standard departure at 7:30 AM. Optional afternoon departure at 3:00 PM (must be arranged on the island the previous day).',
      'Afternoon Departure Lunch: Not included in the base rate; costs an additional $10 USD per person (without a drink).',
      'Transportation & Excursions: All ground/maritime transfers, tours, and guides are conducted on a standard coordinated basis.'
    ],
    whatsappMessageEs: 'Hola, quisiera información sobre el paquete de hospedaje Island Hopping de 2 Noches ($265 USD por persona).',
    whatsappMessageEn: 'Hello, I would like information about the Island Hopping 2-Nights accommodation package ($265 USD per person).',
    itineraryTimeline: [
      {
        time: 'Day 1 / Día 1',
        titleEs: 'Llegada y Primera Isla de Hospedaje',
        titleEn: 'Arrival & First Accommodation Island',
        descriptionEs: 'Transporte terrestre en vehículo 4x4 desde tu hotel en la Ciudad de Panamá hacia el puerto, seguido de traslado en lancha rápida hacia tu primera isla de estadía (Isla Aguja o Isla Chichime Chico). Almuerzo y cena incluidos con tiempo libre para disfrutar del paraíso caribeño.',
        descriptionEn: '4x4 ground transportation from your Panama City hotel to the port, followed by speedboat transfer to your first island of stay (Isla Aguja or Isla Chichime Chico). Lunch and dinner are included, with free time to enjoy the Caribbean paradise.'
      },
      {
        time: 'Day 2 / Día 2',
        titleEs: 'Excursión entre Islas y Segundo Hospedaje',
        titleEn: 'Island Exploration & Second Accommodation Island',
        descriptionEs: 'Desayuno completo. Excursión marítima en lancha para visitar dos hermosas islas adicionales y nadar en la espectacular piscina natural de agua cristalina. Al finalizar, traslado a tu segunda isla de hospedaje para registrarte en tu cabaña privada. Almuerzo y cena incluidos.',
        descriptionEn: 'Full breakfast. Speedboat tour visiting two gorgeous additional islands and swimming in the breathtaking natural pool. Afterward, transfer to your second island of stay to check in to your private cabin. Lunch and dinner are included.'
      },
      {
        time: 'Day 3 / Día 3',
        titleEs: 'Opciones de Retorno a Ciudad de Panamá',
        titleEn: 'Return Options to Panama City',
        descriptionEs: 'Desayuno completo. Prepárate para el retorno según la opción elegida: salida estándar de la isla a las 7:30 AM, o salida opcional por la tarde a las 3:00 PM (coordinada el día anterior; almuerzo adicional de $10 USD por persona no incluido, sin bebida). Traslado en lancha y vehículo 4x4 de vuelta a tu hotel.',
        descriptionEn: 'Full breakfast. Prepare for return based on your chosen option: standard island departure at 7:30 AM, or optional afternoon departure at 3:00 PM (must be arranged the day before; optional lunch available for $10 USD per person, without a drink). Speedboat and 4x4 transfer back to your hotel.'
      }
    ]
  },
  {
    id: 'island-hopping-3-nights',
    badgeEs: '3 NOCHES',
    badgeEn: '3 NIGHTS',
    isPrivate: false,
    titleEs: 'ISLAND HOPPING — 3 NOCHES',
    titleEn: 'ISLAND HOPPING — 3 NIGHTS',
    subtitleEs: 'Paquete de Hospedaje en Islas',
    subtitleEn: 'Island Accommodation Package',
    priceDisplayEs: '$355 USD por persona',
    priceDisplayEn: '$355 USD per person',
    shortDescriptionEs: 'La experiencia caribeña definitiva en Guna Yala. Disfruta de 3 noches en cabañas privadas en Isla Aguja, Isla Aroma e Isla Chichime Chico, con transporte de ida y vuelta desde Ciudad de Panamá, recorridos guiados y alimentación completa incluida.',
    shortDescriptionEn: 'The ultimate Caribbean experience in Guna Yala. Enjoy 3 nights in private cabins on Aguja Island, Aroma Island, and Chichime Chico Island, with round-trip transportation from Panama City, guided tours, and full meals included.',
    fullDescriptionEs: 'Disfruta de una maravillosa e inolvidable estadía de 3 noches en las hermosas islas de Guna Yala. Te hospedarás en cabañas privadas en Isla Aguja, Isla Aroma e Isla Chichime Chico. Este paquete completamente organizado incluye traslados de ida y vuelta desde tu hotel en la Ciudad de Panamá en un vehículo 4x4 con aire acondicionado, transporte marítimo en lancha entre islas durante tu estadía, la compañía de un guía local indígena Guna, excursiones guiadas visitando dos islas y la piscina de agua cristalina, y alimentación completa (desayunos, almuerzos y cenas con bebidas incluidas).',
    fullDescriptionEn: 'Enjoy a wonderful and unforgettable 3-night stay in the beautiful islands of Guna Yala. You will stay in private cabins on Isla Aguja, Isla Aroma, and Isla Chichime Chico. This fully organized package includes round-trip ground transportation from your Panama City hotel in an air-conditioned 4x4, boat transportation between islands during your stay, a local Indigenous Guna guide, guided excursions visiting two islands and the natural pool, and full board (breakfasts, lunches, and dinners with drinks included).',
    imageKey: 'chichime',
    inclusionsEs: [
      'Tres noches de hospedaje en cabaña (Isla Aguja: cabaña privada con baño privado; Isla Aroma: cabaña privada con baño privado; Isla Chichime Chico: cabaña privada frente a la playa con baño compartido).',
      'Transporte terrestre de ida y vuelta en vehículo 4x4 con aire acondicionado desde tu hotel en la Ciudad de Panamá.',
      'Transporte marítimo en lancha entre islas durante la estadía.',
      'Guía local indígena Guna.',
      'Excursiones visitando dos islas y la piscina natural.',
      'Alimentación completa: desayunos, almuerzos y cenas con bebidas incluidas.',
      'Chaleco salvavidas y equipo de primeros auxilios.'
    ],
    inclusionsEn: [
      'Three nights of cabin accommodation (Isla Aguja: private cabin with private bathroom; Isla Aroma: private cabin with private bathroom; Isla Chichime Chico: private beachfront cabin with shared bathroom).',
      'Round-trip transportation in an air-conditioned 4x4 from the guest’s hotel in Panama City.',
      'Boat transportation between islands during the stay.',
      'Local Indigenous Guna guide.',
      'Excursions visiting two islands and the natural pool.',
      'Full board: breakfasts, lunches, and dinners with drinks included.',
      'Life jacket and first-aid equipment.'
    ],
    exclusionsEs: [
      'Impuestos de entrada a Guna Yala no incluidos: extranjeros $22 USD por persona; panameños y residentes $7 USD por persona. (Pago obligatorio en efectivo en la frontera).',
      'Propinas opcionales.',
      'Almuerzo para la opción de salida por la tarde ($10 USD adicionales por persona, no incluye bebida).'
    ],
    exclusionsEn: [
      'Guna Yala entry taxes are not included: foreign visitors $22 USD per person; Panamanians and residents $7 USD per person. (Mandatory cash payment at the border).',
      'Optional staff tips.',
      'Lunch for the afternoon departure option (costs an additional $10 USD per person, without a drink).'
    ],
    recommendationsEs: [
      'Efectivo suficiente para el impuesto de entrada a la comarca y compras de recuerdos o bebidas adicionales.',
      'Pasaporte original vigente o cédula de identidad personal.',
      'Protector solar biodegradable y repelente de insectos.',
      'Toalla de playa, sandalias y trajes de baño.',
      'Una muda de ropa seca adicional para el viaje de regreso.'
    ],
    recommendationsEn: [
      'Sufficient cash for comarca entry taxes, optional souvenirs, or extra beverages.',
      'Original valid passport or Panamanian ID card.',
      'Biodegradable sunscreen and insect repellent.',
      'Beach towel, sandals, and swimwear.',
      'An extra change of dry clothes for the return journey.'
    ],
    importantInfoEs: [
      'Hospedaje Confirmado: Cabañas privadas en Isla Aguja (baño privado), Isla Aroma (baño privado) e Isla Chichime Chico (baño compartido). Las islas de hospedaje están confirmadas, pero la asignación exacta de noches, el orden de las islas o la elección de cabañas no están predeterminados.',
      'Opciones de Retorno (horarios de salida de la isla): Salida estándar a las 7:30 AM. Salida opcional por la tarde a las 3:00 PM (debe coordinarse el día anterior en la isla).',
      'Almuerzo de Salida por la Tarde: No está incluido en la tarifa base de hospedaje; tiene un costo adicional de $10 USD por persona (no incluye bebida).',
      'Servicios de Transporte y Guía: Todos los transportes terrestres y marítimos, así como los recorridos y guías, se realizan en servicios de traslado estándar coordinados para su comodidad.'
    ],
    importantInfoEn: [
      'Confirmed Accommodation: Private cabins on Isla Aguja (private bathroom), Isla Aroma (private bathroom), and Isla Chichime Chico (shared bathroom). Accommodation islands are confirmed, but the exact night allocation, order of islands, or accommodation choices are not predetermined.',
      'Return Options (island departure times): Standard departure at 7:30 AM. Optional afternoon departure at 3:00 PM (must be arranged on the island the previous day).',
      'Afternoon Departure Lunch: Not included in the base accommodation rate; costs an additional $10 USD per person (without a drink).',
      'Transportation & Excursions: All ground/maritime transfers, tours, and guides are conducted on a standard coordinated basis.'
    ],
    whatsappMessageEs: 'Hola, quisiera información sobre el paquete de hospedaje Island Hopping de 3 Noches ($355 USD por persona).',
    whatsappMessageEn: 'Hello, I would like information about the Island Hopping 3-Nights accommodation package ($355 USD per person).',
    itineraryTimeline: [
      {
        time: 'Day 1 / Día 1',
        titleEs: 'Llegada y Primera Isla de Hospedaje',
        titleEn: 'Arrival & First Accommodation Island',
        descriptionEs: 'Transporte terrestre en vehículo 4x4 desde tu hotel en la Ciudad de Panamá hacia el puerto, seguido de traslado en lancha rápida hacia tu primera isla de estadía (Isla Aguja, Isla Aroma o Isla Chichime Chico). Almuerzo y cena incluidos con tiempo libre.',
        descriptionEn: '4x4 ground transportation from your Panama City hotel to the port, followed by speedboat transfer to your first island of stay (Isla Aguja, Isla Aroma, or Isla Chichime Chico). Lunch and dinner are included, with free time.'
      },
      {
        time: 'Days 2 & 3 / Días 2 y 3',
        titleEs: 'Excursión entre Islas y Siguientes Hospedajes',
        titleEn: 'Island Exploration & Next Accommodation Islands',
        descriptionEs: 'Desayuno completo. Excursión marítima en lancha para visitar dos hermosas islas adicionales y nadar en la piscina de agua cristalina. Registros en tus siguientes islas de hospedaje para descansar en tus cabañas privadas. Alimentación completa incluida.',
        descriptionEn: 'Full breakfast. Speedboat tour visiting two gorgeous additional islands and swimming in the natural pool. Check-in at your next islands of stay to rest in your private cabins. Full board included.'
      },
      {
        time: 'Day 4 / Día 4',
        titleEs: 'Opciones de Retorno a Ciudad de Panamá',
        titleEn: 'Return Options to Panama City',
        descriptionEs: 'Desayuno completo. Regreso según la opción elegida: salida estándar de la isla a las 7:30 AM, o salida opcional por la tarde a las 3:00 PM (coordinada el día anterior en la isla; almuerzo adicional de $10 USD por persona no incluido, sin bebida). Traslado en lancha y vehículo 4x4 de vuelta a tu hotel.',
        descriptionEn: 'Full breakfast. Return based on your chosen option: standard island departure at 7:30 AM, or optional afternoon departure at 3:00 PM (must be arranged the day before on the island; optional lunch available for $10 USD per person, without a drink). Speedboat and 4x4 transfer back to your hotel.'
      }
    ]
  }
];
