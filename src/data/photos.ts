export type Photo = { src: string; caption?: string; alt?: string };

// Add more by dropping image files into public/photos/ and adding entries here.
// The homepage "Life" teaser shows the first three.
export const photos: Photo[] = [
  { src: '/photos/hiking.jpg', caption: 'Hiking', alt: 'Hiking in the mountains' },
  { src: '/photos/fishing.jpg', caption: 'Fishing', alt: 'A carp I caught' },
  { src: '/photos/garden-1.jpg', caption: 'Growing tomatoes', alt: 'Ripe tomatoes from my garden' },
  { src: '/photos/garden-4.jpg', caption: 'Growing strawberries', alt: 'A strawberry I grew' },
  { src: '/photos/garden-3.jpg', caption: 'Growing cucumbers', alt: 'A cucumber from my garden' },
  { src: '/photos/garden-2.jpg', caption: 'Growing tomatoes', alt: 'Tomato plant in a pot' },
];
