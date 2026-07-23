export type Photo = { src: string; caption?: string; alt?: string };

// Replace these placeholders with your own photos.
// Drop image files into public/photos/ and point `src` at them,
// e.g. { src: '/photos/yosemite.jpg', caption: 'Yosemite, 2025' }.
export const photos: Photo[] = [
  { src: '/photos/placeholder-hiking-1.svg', caption: 'Hiking', alt: 'Hiking' },
  { src: '/photos/placeholder-travel-5.svg', caption: 'Travel', alt: 'Travel' },
  { src: '/photos/placeholder-fishing-3.svg', caption: 'Fishing', alt: 'Fishing' },
  { src: '/photos/placeholder-travel-6.svg', caption: 'Travel', alt: 'Travel' },
  { src: '/photos/placeholder-hiking-2.svg', caption: 'Hiking', alt: 'Hiking' },
  { src: '/photos/placeholder-fishing-4.svg', caption: 'Fishing', alt: 'Fishing' },
];
