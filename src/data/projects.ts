export type Project = {
  name: string;
  url: string;
  desc: string;
  lang?: string;
  color?: string;
  stars?: number;
  featured?: boolean;
};

// Descriptions auto-drafted from GitHub — verify/tweak the wording.
// Homepage shows every entry with `featured: true`.
export const projects: Project[] = [
  {
    name: 'PantheonOS',
    url: 'https://github.com/aristoteleo/PantheonOS',
    desc: 'An evolvable, distributed agent framework and harness for data science.',
    lang: 'Python',
    color: '#3572A5',
    stars: 473,
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
    name: 'AniNet',
    url: 'https://github.com/AniNet-Project/AniNet',
    desc: 'Interactive character-relationship network visualization for anime, manga, and games.',
    lang: 'TypeScript',
    color: '#3178c6',
    stars: 91,
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
    featured: true,
  },
  {
    name: 'U-Probe',
    url: 'https://github.com/UFISH-Team/U-Probe',
    desc: 'Universal and agentic probe design tool.',
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
  {
    name: 'chain-thought',
    url: 'https://github.com/Nanguage/chain-thought',
    desc: 'A small web experiment for visualizing chain-of-thought style reasoning.',
    lang: 'JavaScript',
    color: '#f1e05a',
  },
];
