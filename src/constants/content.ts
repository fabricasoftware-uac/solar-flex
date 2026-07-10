import type {
  ContactInfo,
  NavLink,
  Pillar,
  Solution,
  Stat,
  StoryMilestone,
  Testimonial,
} from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "La estación", href: "#estacion" },
  { label: "Escenarios", href: "#escenarios" },
  { label: "Historia", href: "#historia" },
  { label: "Contacto", href: "#contacto" },
];

export const HERO = {
  headline: "Energía que te da libertad.",
  /** Frases que rotan en el titular tras la entrada */
  rotating: [
    "Energía que te da libertad.",
    "El sol, contigo a donde vayas.",
    "Carga limpia, en cualquier lugar.",
    "Libertad de la red eléctrica.",
  ],
  sub: "Una estación solar portátil e inteligente para vivir, trabajar y explorar sin depender de la red.",
  cta: "Adquiere la tuya",
  ctaSecondary: "Conoce la estación",
};

export const MANIFESTO =
  "Más que un cargador. Una estación de energía capaz de alimentar tu vida entera: celulares, computadores, lo esencial. Diseñada para la ciudad, la carretera y los lugares donde la red no llega. El sol trabaja. Tú vives.";

export const PILLARS: Pillar[] = [
  {
    title: "Carga solar limpia",
    body: "Paneles de última generación convierten luz en energía renovable, sin sacrificar velocidad de carga.",
    image: "/img/product-1.jpg",
  },
  {
    title: "Energía siempre disponible",
    body: "La batería inteligente almacena el sol del día para que lo uses cuando lo necesites.",
    image: "/img/context-1.jpg",
  },
  {
    title: "Entradas múltiples",
    body: "Varios puertos simultáneos para cargar todos tus dispositivos a la vez.",
    image: "/img/product-2.jpg",
  },
  {
    title: "Menos impacto, más futuro",
    body: "Cada carga reemplaza energía de la red por energía del sol.",
    image: "/img/context-2.jpg",
  },
];

/** Imágenes flotantes de acento en la sección producto */
export const PRODUCT_FLOATS = ["/img/product-3.jpg", "/img/product-4.jpg"];

export const SOLUTIONS: Solution[] = [
  {
    title: "Ciudad",
    body: "Respaldo silencioso para tu casa u oficina. Cuando la red falla, Solarion responde.",
    image: "/img/product-2.jpg",
  },
  {
    title: "Carretera",
    body: "Viajes, camping y trabajo remoto. Energía completa donde termina el pavimento.",
    image: "/img/product-3.jpg",
  },
  {
    title: "Sin red",
    body: "Zonas rurales y emergencias. Independencia total de la infraestructura eléctrica.",
    image: "/img/product-4.jpg",
  },
];

export const STATS: Stat[] = [
  { value: 65, label: "clientes que ya viven con el sol" },
  { value: 2, label: "años escuchando a nuestros usuarios" },
  { value: 20, label: "reconocimientos a la innovación" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Perfecta para mis viajes de campamento y días de playa. La transición a la energía renovable nunca fue tan fácil.",
    name: "Carlos Martínez",
    role: "CEO y fundador",
    image: "/img/voice-1.jpg",
  },
  {
    quote:
      "Increíblemente fácil de usar, y la tranquilidad de saber que estoy cuidando el medio ambiente no tiene precio.",
    name: "Ana García",
    role: "Diseñadora",
    image: "/img/voice-2.jpg",
  },
  {
    quote:
      "Robusta, eficiente y fácil de transportar. He notado una reducción real en mis costos de energía.",
    name: "María Peña",
    role: "Comerciante",
    image: "/img/voice-3.jpg",
  },
  {
    quote:
      "La compré para mi oficina en casa y funciona perfecto. Una inversión que vale cada centavo.",
    name: "Luis Rincón",
    role: "Freelancer",
    image: "/img/voice-4.jpg",
  },
  {
    quote:
      "Práctica y de primera categoría. Justo lo que necesitaba para apoyar la transición energética.",
    name: "Javier Luligo",
    role: "Emprendedor",
    image: "/img/voice-5.jpg",
  },
];

export const STORY = {
  intro:
    "Solarion nació en Popayán, Colombia, con una convicción simple: el acceso a la energía no debería depender de un enchufe.",
  founder: {
    name: "Luis Miguel Martínez",
    role: "Fundador",
    image: "/img/founder.jpg",
  },
  milestones: [
    {
      title: "El origen",
      body: "En el Cauca, donde la red eléctrica no llega a todos, imaginamos energía que viaja con las personas.",
    },
    {
      title: "El producto",
      body: "De un prototipo de regleta solar a una estación de energía inteligente con identidad propia.",
    },
    {
      title: "Los aliados",
      body: "Emprendelab y la Universidad Autónoma creyeron primero. Con ellos pasamos de idea a empresa.",
    },
    {
      title: "Hoy",
      body: "Sesenta y cinco hogares y negocios ya viven con el sol. Esto apenas comienza.",
    },
  ] satisfies StoryMilestone[],
  allies: [
    { name: "Emprendelab", image: "/img/ally-emprendelab-white.png" },
    { name: "Universidad Autónoma", image: "/img/ally-autonoma-white.png" },
  ],
};

export const CTA = {
  headline: "Lleva el sol contigo.",
  sub: "Escríbenos y recibe tu estación Solarion en cualquier lugar de Colombia.",
};

export const CONTACT: ContactInfo = {
  email: "solarflex.servicio@gmail.com",
  phone: "+57 316 910 4778",
  location: "Popayán, Cauca, Colombia",
};

export const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com/solarion.energy" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];
