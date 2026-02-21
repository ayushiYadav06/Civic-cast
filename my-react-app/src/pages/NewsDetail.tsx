import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Eye, User } from 'lucide-react';

interface NewsDetail {
  id: number;
  title: string;
  sub_title?: string;
  content: string;
  category_name?: string;
  sub_category_name?: string;
  operator_name?: string;
  views: number;
  created_at: string;
  images?: Array<{
    id: number;
    image_url: string;
    display_order: number;
  }>;
}

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadNews();
      incrementViews();
    }
  }, [id]);

  const loadNews = async () => {
    if (!id) return;

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.NEWS_BY_ID(parseInt(id))}`);
      const result = await response.json();

      if (result.success && result.data) {
        setNews(result.data);
      } else {
        toast.error('News not found');
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to load news');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    if (!id) return;

    try {
      await fetch(`${API_BASE_URL}${API_ENDPOINTS.INCREMENT_VIEWS(parseInt(id))}`, {
        method: 'POST',
      });
    } catch (error) {
      // Silently fail - views increment is not critical
      console.error('Failed to increment views:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading news...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">News not found</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Title Section */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {news.title}
            </h1>
            {news.sub_title && (
              <p className="text-xl text-gray-600 mb-4">{news.sub_title}</p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-200">
              {news.category_name && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Category:</span>
                  <span>{news.category_name}</span>
                  {news.sub_category_name && <span> / {news.sub_category_name}</span>}
                </div>
              )}
              {news.operator_name && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Admin</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(news.created_at).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{news.views} views</span>
              </div>
            </div>
          </div>

          {/* Images */}
          {news.images && news.images.length > 0 && (
            <div className="p-6 md:p-8 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {news.images
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((image) => (
                    <img
                      key={image.id}
                      src={image.image_url}
                      alt={`${news.title} - Image ${image.display_order}`}
                      className="w-full h-auto rounded-lg border border-gray-200"
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                {news.content}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
