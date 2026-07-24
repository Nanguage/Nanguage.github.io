export type Topic = { key: string; title: string; desc: string; image?: string };

// Order in which research themes appear on /research/.
export const topics: Topic[] = [
  {
    key: 'agentic',
    title: 'Agentic systems for scientific discovery',
    desc: 'Multi-agent frameworks that plan, run, and reason over scientific analyses.',
    image: '/research/agentic.png',
  },
  {
    key: 'imaging',
    title: 'Imaging-based spatial transcriptomics',
    desc: 'Methods and deep-learning tools that read gene expression in situ from microscopy.',
    image: '/research/imaging.png',
  },
  {
    key: 'genome3d',
    title: '3D genomics',
    desc: 'Mapping and visualizing chromosome conformation and the spatial organization of the genome.',
    image: '/research/genome3d.png',
  },
  {
    key: 'other',
    title: 'Other contributions',
    desc: 'Selected collaborative work across single-cell biology, immunology, and microbiology.',
  },
];
