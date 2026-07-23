export type Photo = { src: string; caption?: string; alt?: string };

// Add more by dropping image files into public/photos/ and adding entries here.
export const photos: Photo[] = [
  { src: '/photos/hiking.jpg', caption: 'Hiking', alt: 'Hiking in the mountains' },
  { src: '/photos/garden-1.jpg', caption: 'Growing tomatoes', alt: 'Ripe tomatoes from my garden' },
  { src: '/photos/garden-2.jpg', caption: 'Growing tomatoes', alt: 'Tomato plant in a pot' },
  { src: '/photos/placeholder-fishing-3.svg', caption: 'Fishing', alt: 'Fishing (placeholder — add a photo)' },
  { src: '/photos/placeholder-travel-5.svg', caption: 'Travel', alt: 'Travel (placeholder — add a photo)' },
];
