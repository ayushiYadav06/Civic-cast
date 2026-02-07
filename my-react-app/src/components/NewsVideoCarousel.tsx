import React, { useState } from 'react';
import { contentData, VideoItem } from '../data/contentData';
import { Video, X } from 'lucide-react';

const ITEMS_PER_PAGE = 3;

export function NewsVideoCarousel() {
  const allVideos = Object.values(contentData).flatMap(
    (category) => category.videos
  );

  const totalPages = Math.ceil(allVideos.length / ITEMS_PER_PAGE);
  const [page, setPage] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const start = page * ITEMS_PER_PAGE;
  const visibleVideos = allVideos.slice(start, start + ITEMS_PER_PAGE);

  const handlePrev = () => {
    setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  if (!allVideos.length) return null;

  return (
    <>
      {/* VIDEO MODAL */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="mt-4 text-white">
              <h3 className="text-xl font-semibold mb-1">{selectedVideo.title}</h3>
              {selectedVideo.titleEn && (
                <p className="text-gray-300">{selectedVideo.titleEn}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative">

        {/* HEADER */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Video className="w-8 h-8 text-red-600" />
            <h2 className="text-4xl font-bold">News Videos</h2>
          </div>
          <p className="text-gray-600">समाचार वीडियो</p>
        </div>

        {/* LEFT ARROW */}
        <button
          onClick={handlePrev}
          className="absolute -left-8 top-[70%] z-30
                     w-10 h-10 rounded-full border border-black bg-black text-white
                     flex items-center justify-center text-xl
                     hover:bg-gray-800 transition-colors"
        >
          ‹
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={handleNext}
          className="absolute -right-8 top-[70%] z-30
                     w-10 h-10 rounded-full border border-black bg-black text-white
                     flex items-center justify-center text-xl
                     hover:bg-gray-800 transition-colors"
        >
          ›
        </button>

        {/* VIDEO CONTAINER */}
        <div className="overflow-hidden" style={{ minHeight: 500 }}>
          <div
            key={page}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {visibleVideos.map((video) => (
              <div
                key={video.id}
                className="bg-gray-100 rounded-xl shadow-md flex flex-col overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* VIDEO THUMBNAIL */}
                <div 
                  className="relative w-full aspect-video bg-gray-900 overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                    }}
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all">
                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>

                  {/* Date Badge */}
                  {video.date && (
                    <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {video.date}
                    </div>
                  )}
                </div>

                {/* VIDEO INFO */}
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="text-base font-semibold mb-2 line-clamp-2">
                    {video.title}
                  </h4>
                  {video.titleEn && (
                    <p className="text-sm text-gray-600 line-clamp-1 mb-3">
                      {video.titleEn}
                    </p>
                  )}
                  
                  <button 
                    onClick={() => setSelectedVideo(video)}
                    className="mt-auto mx-auto border border-red-600 text-red-600 px-6 py-2 rounded-md text-sm hover:bg-red-600 hover:text-white transition"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DOT INDICATORS */}
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-3 h-3 rounded-full ${
                i === page ? 'bg-red-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
    </>
  );
}
