import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicService, PublicNews } from '../services/publicService';
import { Newspaper } from 'lucide-react';

const ITEMS_PER_PAGE = 3;
const IMAGE_HEIGHT = 220;
const CARD_HEIGHT = 460;

export function NewsCarousel() {
  const [allNews, setAllNews] = useState<PublicNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    publicService.getNews({ limit: 12 }).then((data) => {
      if (!cancelled) setAllNews(data);
    }).catch((e) => {
      if (!cancelled) console.error('Failed to load news', e);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const totalPages = Math.max(1, Math.ceil(allNews.length / ITEMS_PER_PAGE));
  const [page, setPage] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const start = page * ITEMS_PER_PAGE;
  const visibleNews = allNews.slice(start, start + ITEMS_PER_PAGE);

  // 🔁 LOOPING ARROWS (FIX)
  const handlePrev = () => {
    setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const toggleExpanded = (id: number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center py-16 text-gray-500">
          Loading latest news...
        </div>
      </section>
    );
  }

  if (!allNews.length) return null;

  return (
    <section className="py-20 bg-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative">

        {/* HEADER */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Newspaper className="w-8 h-8 text-blue-600" />
            <h2 className="text-4xl font-bold">Latest News</h2>
          </div>
          <p className="text-gray-600">ताज़ा खबरें</p>
        </div>

        {/* LEFT ARROW (ALWAYS VISIBLE) */}
        <button
          onClick={handlePrev}
          className="absolute -left-8 top-[30%] z-30
                     w-10 h-30 rounded-full border border-black bg-black text-white
                     flex items-center justify-center text-xl
                     hover:bg-gray-800 transition-colors"
        >
          ‹
        </button>

        {/* RIGHT ARROW (ALWAYS VISIBLE) */}
        <button
          onClick={handleNext}
          className="absolute -right-8 top-[30%] z-30
                     w-10 h-30 rounded-full border border-black bg-black text-white
                     flex items-center justify-center text-xl
                     hover:bg-gray-800 transition-colors"
        >
          ›
        </button>

        {/* CARD CONTAINER (REPLACE, NOT STACK) */}
        <div
          className="overflow-hidden"
          style={{ minHeight: CARD_HEIGHT + 40 }}
        >
          <div
            key={page}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {visibleNews.map((item) => {
              const isExpanded = expandedCards.has(item.id);
              const imageUrl = item.images?.[0]?.image_url;
              const plainContent = item.content?.replace(/<[^>]*>/g, '') ?? '';
              const summary = plainContent.slice(0, 120) + (plainContent.length > 120 ? '...' : '');

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden transition-all duration-300"
                  style={{ height: isExpanded ? 'auto' : CARD_HEIGHT }}
                >
                  <div
                    className="w-full bg-gray-200 overflow-hidden"
                    style={{ height: IMAGE_HEIGHT }}
                  >
                    <img
                      src={imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-1 text-center">
                    <h4 className="text-lg font-semibold mb-3 line-clamp-2">
                      {item.title}
                    </h4>

                    <p className={`text-sm text-gray-600 mb-6 ${isExpanded ? '' : 'line-clamp-3'}`}>
                      {isExpanded ? plainContent : summary}
                    </p>

                    <div className="mt-auto flex gap-2 justify-center">
                      <button
                        onClick={(e) => { e.preventDefault(); toggleExpanded(item.id); }}
                        className="border border-black px-6 py-2 rounded-md text-sm hover:bg-black hover:text-white transition"
                      >
                        {isExpanded ? 'Show Less' : 'Read More'}
                      </button>
                      <Link
                        to={`/news/${item.id}`}
                        className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md text-sm hover:bg-blue-600 hover:text-white transition"
                      >
                        Full Article
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DOT INDICATORS */}
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-3 h-3 rounded-full ${
                i === page ? 'bg-black' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
