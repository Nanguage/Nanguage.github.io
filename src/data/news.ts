export type NewsItem = { date: string; html: string };

// Latest items show on the homepage. `date` is a free-form string.
// Replace with talks, papers, releases, awards — keep them specific.
export const news: NewsItem[] = [
  {
    date: '2026',
    html: 'Working on <a href="https://github.com/aristoteleo/PantheonOS">PantheonOS</a>, an agent framework for data-science workflows.',
  },
  {
    date: '2023',
    html: 'Released <a href="https://github.com/UFISH-Team/U-FISH">U-FISH</a>, a deep-learning method for spot detection in FISH images.',
  },
  {
    date: '2021',
    html: 'Released <a href="https://github.com/GangCaoLab/CoolBox">CoolBox</a> for genomic data visualization in Jupyter.',
  },
];
