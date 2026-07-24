export type Photo = { src: string; caption?: string; alt?: string };

// Add more by dropping image files into public/photos/ and adding entries here.
// The homepage "Life" teaser shows the first three.
export const photos: Photo[] = [
  { src: '/photos/hiking.jpg', caption: 'Hiking in the mountains', alt: 'Hiking, holding a giant pine cone' },
  { src: '/photos/point-lobos.jpg', caption: 'Point Lobos, California', alt: 'A green cove seen through pines while hiking Point Lobos' },
  { src: '/photos/fishing.jpg', caption: 'A carp I caught at South Lake, Wuhan (2022)', alt: 'Holding a carp by South Lake at night' },
  { src: '/photos/chicago.jpg', caption: 'Chicago, above the fog', alt: 'Chicago skyline rising above night fog' },
  { src: '/photos/garden-1.jpg', caption: 'Tomatoes from my garden', alt: 'Ripe red tomatoes on the vine' },
  { src: '/photos/garden-4.jpg', caption: 'Homegrown strawberries', alt: 'A ripe strawberry I grew' },
  { src: '/photos/garden-3.jpg', caption: 'Cucumbers on the vine', alt: 'A cucumber growing on the plant' },
  { src: '/photos/garden-2.jpg', caption: 'Tomatoes ripening', alt: 'Green tomatoes ripening in a pot' },
];
