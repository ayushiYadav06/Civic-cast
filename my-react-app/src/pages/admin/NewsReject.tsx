import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsService, News } from '../../services/adminService';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, XCircle } from 'lucide-react';

export default function NewsReject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadNews();
    }
  }, [id]);

  const loadNews = async () => {
    if (!id) return;
    
    try {
      const data = await newsService.getById(parseInt(id));
      setNews(data);
    } catch (error) {
      toast.error('Failed to load news');
      navigate('/admin/news');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!news || !rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    setSubmitting(true);
    try {
      await newsService.reject(news.id, rejectReason);
      toast.success('News rejected successfully');
      navigate('/admin/news');
    } catch (error) {
      toast.error('Failed to reject news');
    } finally {
      setSubmitting(false);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reject News</h1>
          <p className="text-gray-600">Provide a reason for rejecting this news article</p>
        </div>
      </div>

      {/* News Info Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{news.title}</h2>
        <p className="text-gray-600">{news.sub_title || 'No subtitle'}</p>
        <div className="mt-4 text-sm text-gray-500">
          <span>Category: {news.category_name}</span>
          {news.sub_category_name && <span className="ml-4">Sub-Category: {news.sub_category_name}</span>}
        </div>
      </div>

      {/* Reject Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={6}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">
              Please provide a clear reason for rejecting this news article.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/news')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={submitting || !rejectReason.trim()}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {submitting ? 'Rejecting...' : 'Reject News'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
