import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsService, News, NewsImage } from '../../services/adminService';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, ExternalLink, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NewsView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [images, setImages] = useState<NewsImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadNews();
    }
  }, [id]);

  const loadNews = async () => {
    if (!id) return;
    
    try {
      const data = await newsService.getById(parseInt(id));
      console.log('News data loaded:', data);
      setNews(data);
      
      // Load images if available
      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        console.log('Images found:', data.images);
        setImages(data.images);
      } else {
        console.log('No images found in response');
        setImages([]);
      }
    } catch (error) {
      console.error('Error loading news:', error);
      toast.error('Failed to load news');
      navigate('/admin/news');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const handleViewOnSite = () => {
    if (news?.status === 'approved') {
      window.open(`/news/${news.id}`, '_blank');
    } else {
      toast.error('News must be approved to view on site');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!news) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">News not found</p>
        <Button onClick={() => navigate('/admin/news')} className="mt-4">
          Back to News
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/news')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{news.title}</h1>
            <p className="text-gray-600">{news.sub_title || 'No subtitle'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate(`/admin/news/${news.id}/edit`)}
            variant="outline"
            className="border-gray-300"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          {news.status === 'approved' && (
            <Button
              onClick={handleViewOnSite}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Site
            </Button>
          )}
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm border-b pb-4">
            <div>
              <span className="font-medium text-gray-700">Category:</span>
              <p className="text-gray-900 mt-1">{news.category_name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Sub-Category:</span>
              <p className="text-gray-900 mt-1">{news.sub_category_name || 'None'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Operator:</span>
              <p className="text-gray-900 mt-1">{news.operator_name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <div className="mt-1">{getStatusBadge(news.status)}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Views:</span>
              <p className="text-gray-900 mt-1">{news.views}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Images:</span>
              <p className="text-gray-900 mt-1">{images.length || news.image_count || 0}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Created:</span>
              <p className="text-gray-900 mt-1">
                {formatDistanceToNow(new Date(news.created_at), { addSuffix: true })}
              </p>
            </div>
            {news.approved_at && (
              <div>
                <span className="font-medium text-gray-700">Approved:</span>
                <p className="text-gray-900 mt-1">
                  {formatDistanceToNow(new Date(news.approved_at), { addSuffix: true })}
                </p>
              </div>
            )}
          </div>

          {/* Images */}
          {images.length > 0 ? (
            <div>
              <span className="font-medium text-gray-700 mb-2 block">Images ({images.length}):</span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {images
                  .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                  .map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_url}
                        alt={`News image ${image.display_order || image.id}`}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          console.error('Image load error:', image.image_url);
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ) : news.image_count > 0 ? (
            <div className="text-yellow-600 text-sm">
              ⚠️ {news.image_count} image(s) exist but could not be loaded. Please check the image URLs.
            </div>
          ) : null}

          {/* Content */}
          <div>
            <span className="font-medium text-gray-700 mb-2 block">Content:</span>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-900">
              {news.content}
            </div>
          </div>

          {/* Rejection Reason */}
          {news.rejected_reason && (
            <div>
              <span className="font-medium text-red-600 mb-2 block">Rejection Reason:</span>
              <div className="mt-2 p-4 bg-red-50 rounded-lg text-gray-900">
                {news.rejected_reason}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
