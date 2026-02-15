import { Project } from '../models/project.model';

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/lilianagorga/',
  github: 'https://www.github.com/lilianagorga'
} as const;

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 'wear-again',
    title: 'WEAR AGAIN',
    description:
      'Piattaforma e-commerce second hand orientata alla moda sostenibile, con catalogo prodotti e gestione acquisti.',
    techStack: ['Java', 'Spring Boot', 'Thymeleaf', 'MongoDB'],
    imageUrl: '/projects/wear-again.svg',
    githubUrl: 'https://github.com/lilianagorga/wear-again',
    demoUrl: 'https://wear-again.lilianagorga.org'
  },
  {
    id: 'peer-voice',
    title: 'PEER VOICE',
    description:
      "Piattaforma dedicata all'ascolto e al confronto su temi di gender equality, con flussi orientati alla community.",
    techStack: ['Next.js', 'TypeScript', 'Appwrite', 'Tailwind CSS'],
    imageUrl: '/projects/peer-voice.svg',
    githubUrl: 'https://github.com/lilianagorga/peer-voice',
    demoUrl: 'https://peer-voice.lilianagorga.com'
  },
  {
    id: 'realty-mate-dashboard',
    title: 'REALTY MATE DASHBOARD',
    description:
      "Dashboard gestionale per agenzia immobiliare con controllo ruoli/permessi e gestione operativa dell'area admin.",
    techStack: ['Laravel', 'MySQL', 'Spatie Laravel-Permission'],
    imageUrl: '/projects/realty-mate-dashboard.svg',
    githubUrl: 'https://github.com/lilianagorga/realty-mate-backend',
    demoUrl: 'https://realty-mate-backend.lilianagorga.com'
  },
  {
    id: 'realty-mate',
    title: 'REALTY MATE',
    description:
      'Applicazione immobiliare lato utente con ricerca immobili, mappe interattive e navigazione delle schede proprietà.',
    techStack: ['React', 'Chakra UI', 'Swiper', 'Axios', 'Google Maps API'],
    imageUrl: '/projects/realty-mate.svg',
    githubUrl: 'https://github.com/lilianagorga/realty-mate',
    demoUrl: 'https://realty-mate.lilianagorga.com'
  },
  {
    id: 'eteach-hub',
    title: 'eTEACH HUB',
    description:
      "Progetto full-stack per scuola online, pensato per offrire percorsi formativi digitali in un ambiente d'apprendimento moderno.",
    techStack: ['Laravel', 'Vite', 'Tailwind CSS', 'Alpine.js'],
    imageUrl: '/projects/eteach-hub.svg',
    githubUrl: 'https://github.com/lilianagorga/e-teach-hub',
    demoUrl: 'https://eteachhub.lilianagorga.com'
  },
  {
    id: 'tech-blog',
    title: 'TECH BLOG',
    description:
      'Blog tecnico full-stack per pubblicazione contenuti, categorie e interazioni utenti, con pannello di gestione ruoli e permessi.',
    techStack: ['Docker', 'Laravel', 'React', 'Spatie', 'Vite'],
    imageUrl: '/projects/tech-blog.svg',
    githubUrl: 'https://github.com/lilianagorga/tech-blog',
    demoUrl: 'http://techblogproduction.lilianagorga.com'
  }
];
