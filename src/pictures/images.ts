// Centralized Image Asset Manager for Dubgan San Blas Trips
// All images are imported cleanly so Vite compiles them for production/development.

import dubganLogo from './dubgan-logo.png';
import firstIslandImg from './Firrst Island.jpeg';
import heroImg from './hero.jpg';
import cultureImg from './culture.jpg';
import tour1Img from './tour1.jpg';
import tour2Img from './tour2.jpg';
import tour3Img from './tour3.jpg';
import privateTour1Img from './privatetour1.jpeg';
import sharedTourImg from './shared.jpg';
import storyImg from './story.jpg';
import gallery1 from './gallery1.jpg';
import gallery2 from './gallery2.jpg';
import gallery3 from './gallery3.jpg';
import canoeImg from './canoe.png';
import sunsetImg from './sunset.jpg';
import sunsetBoatImg from './sunsetboat.jpg';
import snorkelingImg from './snoerkeling.jpg';
import elporvenirImg from './elporvenir.jpg';
import agujaImg from './aguja1.jpg';
import nalunegaImg from './nalunega1.jpg';
import pelicanoImg from './pelicano12.jpg';
import perroChicoImg from './perrochico.jpg';
import diabloImg from './diablo.jpg';
import cocoImg from './coco.jpg';
import chichimeImg from './chichime.jpg';
import naturalPoolImg from './naturalpool.jpg';
import homePic from './Homepic.jpeg';
import cayosHolandesesImg from './cayouholandese.jpg';
import gunaMolaImg from './Gunamola.jpg';

export const images = {
  elporvenir: {
    src: elporvenirImg,
    altEs: 'Vista de El Porvenir, Guna Yala.',
    altEn: 'View of El Porvenir, Guna Yala.',
  },
  nalunega: {
    src: nalunegaImg,
    altEs: 'Vista de Nalunega, Guna Yala.',
    altEn: 'View of Nalunega, Guna Yala.',
  },
  aguja: {
    src: agujaImg,
    altEs: 'Vista de Isla Aguja, Guna Yala.',
    altEn: 'View of Isla Aguja, Guna Yala.',
  },
  pelicano: {
    src: pelicanoImg,
    altEs: 'Vista de Isla Pelícano, Guna Yala.',
    altEn: 'View of Pelican Island, Guna Yala.',
  },
  perrochico: {
    src: perroChicoImg,
    altEs: 'Vista de Isla Perro Chico, Guna Yala.',
    altEn: 'View of Dog Island (Isla Perro Chico), Guna Yala.',
  },
  diablo: {
    src: diabloImg,
    altEs: 'Vista de Isla Diablo, Guna Yala.',
    altEn: 'View of Diablo Island, Guna Yala.',
  },
  coco: {
    src: cocoImg,
    altEs: 'Vista de Isla Coco, Guna Yala.',
    altEn: 'View of Coco Island, Guna Yala.',
  },
  chichime: {
    src: chichimeImg,
    altEs: 'Vista de Isla Chichime, Guna Yala.',
    altEn: 'View of Chichime Island, Guna Yala.',
  },
  naturalpool: {
    src: naturalPoolImg,
    altEs: 'Vista de la Piscina Natural, San Blas, Guna Yala.',
    altEn: 'View of Natural Pool (Starfish Sandbar), San Blas, Guna Yala.',
  },
  holandeses: {
    src: cayosHolandesesImg,
    altEs: 'Vista de Cayos Holandeses, San Blas, Guna Yala.',
    altEn: 'View of Dutch Cays (Cayos Holandeses), San Blas, Guna Yala.',
  },
  logo: {
    src: dubganLogo,
    altEs: 'Logotipo de Dubgan San Blas Trips',
    altEn: 'Dubgan San Blas Trips Logo',
  },
  hero: {
    src: homePic,
    altEs: 'Vista aérea de las islas de San Blas Guna Yala Panamá',
    altEn: 'Aerial view of San Blas islands in Guna Yala Panama',
  },
  culture: {
    src: gunaMolaImg,
    altEs: 'Ilustración generada con IA de dos mujeres con textiles mola en un entorno isleño.',
    altEn: 'AI-generated illustration of two women with mola textiles in an island setting.',
  },
  tours: {
    tour1: {
      src: sharedTourImg,
      altEs: 'Ilustración generada con IA de viajeros disfrutando de una playa tropical con una lancha cerca.',
      altEn: 'AI-generated illustration of travelers enjoying a tropical island beach with a boat nearby.',
    },
    tour2: {
      src: privateTour1Img,
      altEs: 'Experiencia exclusiva privada en San Blas',
      altEn: 'Private full-day experience in San Blas',
    },
    tour3: {
      src: tour3Img,
      altEs: 'Aventura de snorkel en arrecifes de coral',
      altEn: 'Snorkeling Adventure in coral reefs',
    },
  },
  story: {
    src: storyImg,
    altEs: 'Navegación tradicional en bote al atardecer en Guna Yala',
    altEn: 'Traditional boat cruising during golden hour sunset in Guna Yala',
  },
  gallery: [
    {
      id: 'gallery1',
      src: naturalPoolImg,
      category: 'islands' as const,
      altEs: 'Vista de la Piscina Natural, San Blas, Guna Yala.',
      altEn: 'View of Natural Pool (Starfish Sandbar), San Blas, Guna Yala.',
      titleEs: 'Piscina Natural',
      titleEn: 'Natural Pool',
    },
    {
      id: 'gallery2',
      src: canoeImg,
      category: 'boats' as const,
      altEs: 'Ilustración generada con IA de una canoa de madera en aguas turquesas cristalinas.',
      altEn: 'AI-generated illustration of a wooden dugout canoe in clear turquoise water.',
      titleEs: 'Canoa Tradicional',
      titleEn: 'Traditional Canoe',
    },
    {
      id: 'gallery3',
      src: sunsetImg,
      category: 'islands' as const,
      altEs: 'Ilustración generada con IA de un atardecer dorado sobre el mar junto a una playa con palmeras.',
      altEn: 'AI-generated illustration of a golden sunset over the sea beside a palm-lined beach.',
      titleEs: 'Atardecer Caribeño',
      titleEn: 'Caribbean Sunset',
    },
    {
      id: 'gallery4',
      src: firstIslandImg,
      category: 'islands' as const,
      altEs: 'Vista aérea del archipiélago de San Blas',
      altEn: 'Aerial view of San Blas Archipelago',
      titleEs: 'Archipiélago de San Blas',
      titleEn: 'San Blas Archipelago',
    },
    {
      id: 'gallery5',
      src: sunsetBoatImg,
      category: 'boats' as const,
      altEs: 'Ilustración generada con IA de una lancha de pasajeros navegando por el mar al atardecer.',
      altEn: 'AI-generated illustration of a passenger boat cruising across the sea at sunset.',
      titleEs: 'Navegación al Atardecer',
      titleEn: 'Sunset Navigation',
    },
    {
      id: 'gallery6',
      src: snorkelingImg,
      category: 'activities' as const,
      altEs: 'Ilustración generada con IA de dos viajeros practicando esnórquel en aguas turquesas cristalinas.',
      altEn: 'AI-generated illustration of two travelers snorkeling in clear turquoise water.',
      titleEs: 'Esnórquel',
      titleEn: 'Snorkeling',
    },
    {
      id: 'gallery-porvenir',
      src: elporvenirImg,
      category: 'islands' as const,
      altEs: 'Vista de El Porvenir, Guna Yala.',
      altEn: 'View of El Porvenir, Guna Yala.',
      titleEs: 'El Porvenir',
      titleEn: 'El Porvenir',
    },
    {
      id: 'gallery-nalunega',
      src: nalunegaImg,
      category: 'islands' as const,
      altEs: 'Vista de Nalunega, Guna Yala.',
      altEn: 'View of Nalunega, Guna Yala.',
      titleEs: 'Isla Nalunega',
      titleEn: 'Nalunega Island',
    },
    {
      id: 'gallery-aguja',
      src: agujaImg,
      category: 'islands' as const,
      altEs: 'Vista de Isla Aguja, Guna Yala.',
      altEn: 'View of Isla Aguja, Guna Yala.',
      titleEs: 'Isla Aguja',
      titleEn: 'Aguja Island',
    },
    {
      id: 'gallery-pelicano',
      src: pelicanoImg,
      category: 'islands' as const,
      altEs: 'Vista de Isla Pelícano, Guna Yala.',
      altEn: 'View of Pelican Island, Guna Yala.',
      titleEs: 'Isla Pelícano',
      titleEn: 'Pelican Island',
    },
    {
      id: 'gallery-perrochico',
      src: perroChicoImg,
      category: 'islands' as const,
      altEs: 'Vista de Isla Perro Chico, Guna Yala.',
      altEn: 'View of Dog Island (Isla Perro Chico), Guna Yala.',
      titleEs: 'Isla Perro Chico',
      titleEn: 'Dog Island (Perro Chico)',
    },
    {
      id: 'gallery-diablo',
      src: diabloImg,
      category: 'islands' as const,
      altEs: 'Vista de Isla Diablo, Guna Yala.',
      altEn: 'View of Diablo Island, Guna Yala.',
      titleEs: 'Isla Diablo',
      titleEn: 'Diablo Island',
    },
    {
      id: 'gallery-coco',
      src: cocoImg,
      category: 'islands' as const,
      altEs: 'Vista de Isla Coco, Guna Yala.',
      altEn: 'View of Coco Island, Guna Yala.',
      titleEs: 'Isla Coco',
      titleEn: 'Coco Island',
    },
    {
      id: 'gallery-chichime',
      src: chichimeImg,
      category: 'islands' as const,
      altEs: 'Vista de Isla Chichime, Guna Yala.',
      altEn: 'View of Chichime Island, Guna Yala.',
      titleEs: 'Isla Chichime',
      titleEn: 'Chichime Island',
    },
    {
      id: 'gallery-holandeses',
      src: cayosHolandesesImg,
      category: 'islands' as const,
      altEs: 'Vista de Cayos Holandeses, San Blas, Guna Yala.',
      altEn: 'View of Dutch Cays (Cayos Holandeses), San Blas, Guna Yala.',
      titleEs: 'Cayos Holandeses',
      titleEn: 'Dutch Cays',
    },
  ],
};

export default images;
