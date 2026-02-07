export type VideoItem = {
  id: number;
  title: string;
  titleEn?: string;
  youtubeId: string;
  date?: string;
  thumbnail?: string;
};

export type NewsItem = {
  id: number;
  title: string;
  summary: string;
  content?: string;
  image: string;
  date?: string;
};

export type CategoryContent = {
  news: NewsItem[];
  videos: VideoItem[];
};

export const contentData: Record<string, CategoryContent> = {
  'local-governance': {
    news: [
      {
        id: 1,
        title: 'Road repair begins in Ward 5',
        summary: 'Pothole repairs and resurfacing started today in Ward 5.',
        content: 'The municipality has started the scheduled road repairs across Ward 5. Residents reported improvements in traffic flow.',
        image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31',
        date: '2026-01-20',
      },
    ],
    videos: [
      {
        id: 1,
        title: 'Ward 5 meeting highlights',
        youtubeId: 'dQw4w9WgXcQ',
        date: '2026-01-18',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      },
    ],
  },
  'voice-of-people': { news: [], videos: [] },
  'progress-path': { news: [], videos: [] },
  'crime-alert': { news: [], videos: [] },
  'ground-report': { news: [], videos: [] },
  'civic-special': { news: [], videos: [] },
  'accountability-meter': { news: [], videos: [] },
  'todays-question': { news: [], videos: [] },
  'from-citizens': { news: [], videos: [] },
  'india-on-rails': { news: [], videos: [] },
};



