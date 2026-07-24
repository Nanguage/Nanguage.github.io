export type NewsItem = { date: string; html: string };

// Latest items show on the homepage. `date` is a free-form string.
// Replace with talks, papers, releases, awards — keep them specific.
export const news: NewsItem[] = [
  {
    date: '2026.05',
    html: 'Invited online talk at the <a href="https://www.youtube.com/watch?v=XsFjKteXxJ4">Sydney Precision Data Science Centre</a>.',
  },
  {
    date: '2026.04',
    html: 'Gave an online talk at the <a href="https://hit-webinar.com/">HIT Webinar</a> (<a href="https://hit-webinar.com/assets/poster/talk260425.jpg">poster</a>).',
  },
  {
    date: '2026.03',
    html: 'Selected as a speaker at the 2026 Stanford Heart Center Research Day.',
  },
  {
    date: '2026.02',
    html: 'Posted the <a href="https://www.biorxiv.org/content/10.64898/2026.02.26.707870v1">PantheonOS</a> preprint on bioRxiv.',
  },
  {
    date: '2025.09',
    html: 'U-FISH published in <a href="https://link.springer.com/article/10.1186/s13059-025-03736-x">Genome Biology</a>.',
  },
  {
    date: '2024.11',
    html: 'Joined <a href="https://www.devo-evo.com/">Xiaojie Qiu\'s lab</a> at Stanford as a postdoctoral scholar.',
  },
];

