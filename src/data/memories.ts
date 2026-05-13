export type Memory = {
  id: string
  title: string
  location: string
  date: string
  coverImage: string
  images: string[]
  canvasX: number
  canvasY: number
  rotation: number
}

export const memories: Memory[] = [
  {
    id: 'sf-2022',
    title: 'San Francisco, 2022',
    location: 'San Francisco, CA',
    date: 'March 2022',
    coverImage: 'https://picsum.photos/seed/sf-cover/400/500',
    images: [
      'https://picsum.photos/seed/sf-cover/400/500',
      'https://picsum.photos/seed/sf-1/400/500',
      'https://picsum.photos/seed/sf-2/400/500',
      'https://picsum.photos/seed/sf-3/400/500',
      'https://picsum.photos/seed/sf-4/400/500',
    ],
    canvasX: 300,
    canvasY: 180,
    rotation: -4,
  },
  {
    id: 'sf-golden-gate',
    title: 'Golden Gate, 2022',
    location: 'San Francisco, CA',
    date: 'April 2022',
    coverImage: 'https://picsum.photos/seed/gg-cover/400/500',
    images: [
      'https://picsum.photos/seed/gg-cover/400/500',
      'https://picsum.photos/seed/gg-1/400/500',
      'https://picsum.photos/seed/gg-2/400/500',
      'https://picsum.photos/seed/gg-3/400/500',
    ],
    canvasX: 560,
    canvasY: 130,
    rotation: 3,
  },
  {
    id: 'sf-mission',
    title: 'The Mission, 2023',
    location: 'San Francisco, CA',
    date: 'June 2023',
    coverImage: 'https://picsum.photos/seed/mission-cover/400/500',
    images: [
      'https://picsum.photos/seed/mission-cover/400/500',
      'https://picsum.photos/seed/mission-1/400/500',
      'https://picsum.photos/seed/mission-2/400/500',
      'https://picsum.photos/seed/mission-3/400/500',
      'https://picsum.photos/seed/mission-4/400/500',
      'https://picsum.photos/seed/mission-5/400/500',
    ],
    canvasX: 420,
    canvasY: 440,
    rotation: 2,
  },

  {
    id: 'tokyo-2023',
    title: 'Tokyo, 2023',
    location: 'Tokyo, Japan',
    date: 'October 2023',
    coverImage: 'https://picsum.photos/seed/tokyo-cover/400/500',
    images: [
      'https://picsum.photos/seed/tokyo-cover/400/500',
      'https://picsum.photos/seed/tokyo-1/400/500',
      'https://picsum.photos/seed/tokyo-2/400/500',
      'https://picsum.photos/seed/tokyo-3/400/500',
      'https://picsum.photos/seed/tokyo-4/400/500',
    ],
    canvasX: 1980,
    canvasY: 620,
    rotation: -2,
  },
  {
    id: 'shibuya',
    title: 'Shibuya Crossing',
    location: 'Tokyo, Japan',
    date: 'October 2023',
    coverImage: 'https://picsum.photos/seed/shibuya-cover/400/500',
    images: [
      'https://picsum.photos/seed/shibuya-cover/400/500',
      'https://picsum.photos/seed/shibuya-1/400/500',
      'https://picsum.photos/seed/shibuya-2/400/500',
      'https://picsum.photos/seed/shibuya-3/400/500',
    ],
    canvasX: 2220,
    canvasY: 740,
    rotation: 5,
  },
  {
    id: 'kyoto-2023',
    title: 'Kyoto Temples',
    location: 'Kyoto, Japan',
    date: 'November 2023',
    coverImage: 'https://picsum.photos/seed/kyoto-cover/400/500',
    images: [
      'https://picsum.photos/seed/kyoto-cover/400/500',
      'https://picsum.photos/seed/kyoto-1/400/500',
      'https://picsum.photos/seed/kyoto-2/400/500',
      'https://picsum.photos/seed/kyoto-3/400/500',
      'https://picsum.photos/seed/kyoto-4/400/500',
    ],
    canvasX: 2050,
    canvasY: 430,
    rotation: -5,
  },

  {
    id: 'nyc-2024',
    title: 'New York, 2024',
    location: 'New York, NY',
    date: 'February 2024',
    coverImage: 'https://picsum.photos/seed/nyc-cover/400/500',
    images: [
      'https://picsum.photos/seed/nyc-cover/400/500',
      'https://picsum.photos/seed/nyc-1/400/500',
      'https://picsum.photos/seed/nyc-2/400/500',
      'https://picsum.photos/seed/nyc-3/400/500',
      'https://picsum.photos/seed/nyc-4/400/500',
    ],
    canvasX: 1050,
    canvasY: 1480,
    rotation: 3,
  },
  {
    id: 'brooklyn',
    title: 'Brooklyn Nights',
    location: 'New York, NY',
    date: 'March 2024',
    coverImage: 'https://picsum.photos/seed/brooklyn-cover/400/500',
    images: [
      'https://picsum.photos/seed/brooklyn-cover/400/500',
      'https://picsum.photos/seed/brooklyn-1/400/500',
      'https://picsum.photos/seed/brooklyn-2/400/500',
      'https://picsum.photos/seed/brooklyn-3/400/500',
      'https://picsum.photos/seed/brooklyn-4/400/500',
      'https://picsum.photos/seed/brooklyn-5/400/500',
    ],
    canvasX: 1280,
    canvasY: 1640,
    rotation: -3,
  },
  {
    id: 'central-park',
    title: 'Central Park, Spring',
    location: 'New York, NY',
    date: 'April 2024',
    coverImage: 'https://picsum.photos/seed/cp-cover/400/500',
    images: [
      'https://picsum.photos/seed/cp-cover/400/500',
      'https://picsum.photos/seed/cp-1/400/500',
      'https://picsum.photos/seed/cp-2/400/500',
      'https://picsum.photos/seed/cp-3/400/500',
    ],
    canvasX: 860,
    canvasY: 1620,
    rotation: 6,
  },
]

export const CANVAS_FOCUS = { x: 1350, y: 870 }
export const KYLIFE_CARD_POS = { x: 1300, y: 870 }
