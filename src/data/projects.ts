export type Project = {
  name: string;
  url: string; // primary link (website if there is one, else repo)
  desc: string;
  tagline?: string; // short line shown on highlighted cards
  lang?: string;
  color?: string;
  stars?: number;
  repo?: string; // GitHub link, when `url` points to a website
  image?: string; // thumbnail for highlighted cards
  highlight?: boolean; // large featured card with image
  featured?: boolean; // shown on the homepage
};

// Homepage shows `highlight` projects as large cards + other `featured` ones as compact cards.
export const projects: Project[] = [
  {
    name: 'PantheonOS',
    url: 'https://pantheonos.stanford.edu/',
    tagline: 'The AgentOS that redefines data science',
    desc: 'An evolvable, distributed multi-agent framework and harness for automatic scientific discovery.',
    repo: 'https://github.com/aristoteleo/PantheonOS',
    image: '/projects/pantheonos.jpg',
    lang: 'Python',
    color: '#3572A5',
    stars: 473,
    highlight: true,
    featured: true,
  },
  {
    name: 'Virtual Embryo',
    url: 'https://virtualembryo.ai/',
    tagline: 'Developmental biology in the era of AI',
    desc: 'An interactive AI atlas of mouse embryogenesis — 3D reconstructions, histology, and gene expression across 28 stages, with a spatiotemporal morphogenesis predictor and open REST / MCP endpoints.',
    image: '/projects/virtualembryo.jpg',
    highlight: true,
    featured: true,
  },
  {
    name: 'CoolBox',
    url: 'https://github.com/GangCaoLab/CoolBox',
    desc: 'Jupyter-based genomic data visualization toolkit for Hi-C, ChIP-seq, and tracks.',
    lang: 'Python',
    color: '#3572A5',
    stars: 260,
    featured: true,
  },
  {
    name: 'U-FISH',
    url: 'https://github.com/UFISH-Team/U-FISH',
    desc: 'Deep-learning based spot detection for FISH microscopy images.',
    lang: 'Python',
    color: '#3572A5',
    stars: 34,
    featured: true,
  },
  {
    name: 'AniNet',
    url: 'https://github.com/AniNet-Project/AniNet',
    desc: 'Interactive character-relationship network visualization for anime, manga, and games.',
    lang: 'TypeScript',
    color: '#3178c6',
    stars: 91,
    featured: true,
  },
  {
    name: 'bioView',
    url: 'https://github.com/Nanguage/bioView',
    desc: 'Readability enhancement tool for bioinformatics file formats (FASTQ / FASTA / SAM).',
    lang: 'Nim',
    color: '#ffc200',
    stars: 29,
    featured: true,
  },
  {
    name: 'executor-engine',
    url: 'https://github.com/Nanguage/executor-engine',
    desc: 'Effortless, flexible, and powerful job execution engine for Python.',
    lang: 'Python',
    color: '#3572A5',
    stars: 10,
  },
  {
    name: 'U-Probe',
    url: 'https://github.com/UFISH-Team/U-Probe',
    desc: 'Universal and agentic probe design tool for imaging-based spatial omics.',
    lang: 'Python',
    color: '#3572A5',
    stars: 4,
  },
  {
    name: 'web-python-console',
    url: 'https://github.com/Nanguage/web-python-console',
    desc: 'A browser-based Python console powered by Pyodide and ImJoy.',
    lang: 'HTML',
    color: '#e34c26',
    stars: 9,
  },
  {
    name: 'funcdesc',
    url: 'https://github.com/Nanguage/funcdesc',
    desc: 'Describe, validate, and introspect Python function inputs and outputs.',
    lang: 'Python',
    color: '#3572A5',
    stars: 3,
  },
  {
    name: 'executor-view',
    url: 'https://github.com/Nanguage/executor-view',
    desc: 'Web interface for the executor HTTP server.',
    lang: 'TypeScript',
    color: '#3178c6',
  },
];
