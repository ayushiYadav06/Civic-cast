import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { newsService, News } from '../../services/adminService';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Eye, Plus, Newspaper, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { API_ENDPOINTS } from '../../config/api';

export default function News() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadNews();
  }, [statusFilter]);

  const loadNews = async () => {
    try {
      const filters: any = {};
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      // Use correct endpoint based on user role
      filters.endpoint = user?.role === 'operator' 
        ? API_ENDPOINTS.OPERATOR_NEWS 
        : API_ENDPOINTS.ADMIN_NEWS;
      
      const data = await newsService.getAll(filters);
      setNews(data);
    } catch (error) {
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await newsService.approve(id);
      toast.success('News approved successfully');
      loadNews();
    } catch (error) {
      toast.error('Failed to approve news');
    }
  };

  const handleView = (newsItem: News) => {
    navigate(`/admin/news/${newsItem.id}/view`);
  };

  const handleReject = (newsItem: News) => {
    navigate(`/admin/news/${newsItem.id}/reject`);
  };

  const handleEdit = (newsItem: News) => {
    navigate(`/admin/news/${newsItem.id}/edit`);
  };

  const handleDeleteClick = (newsItem: News) => {
    console.log('Request delete for news item:', newsItem);
    const ok = window.confirm(`Delete news "${newsItem.title}"? This action cannot be undone.`);
    if (!ok) return;

    (async () => {
      try {
        console.log('User confirmed delete, calling API for id:', newsItem.id);
        await newsService.delete(newsItem.id);
        toast.success('News deleted successfully');
        // reload list
        loadNews();
      } catch (error: any) {
        console.error('Delete failed:', error);
        toast.error(error?.response?.data?.message || 'Failed to delete news');
      }
    })();
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

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">News Management</h1>
          <p className="text-gray-600">Approve or reject news submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] border-gray-300">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => navigate('/admin/news/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create News
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Title</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Operator</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Views</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Created</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500 border border-gray-200">
                  <div className="flex flex-col items-center gap-2">
                    <Newspaper className="h-12 w-12 text-gray-300" />
                    <p className="text-lg font-medium">No news found</p>
                    <p className="text-sm">Click "Create News" to add a new article</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              news.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-900 max-w-xs truncate border border-gray-200 text-center">{item.title}</TableCell>
                  <TableCell className="text-gray-600 border border-gray-200 text-center">{item.operator_name}</TableCell>
                  <TableCell className="border border-gray-200 text-center">
                    <div className="flex justify-center">
                      {getStatusBadge(item.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 border border-gray-200 text-center">{item.views}</TableCell>
                  <TableCell className="text-sm text-gray-500 border border-gray-200 text-center">
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="border border-gray-200 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(item)}
                        className="hover:bg-amber-50 hover:text-slate-700"
                        title="View News"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="hover:bg-blue-50 hover:text-blue-700"
                        title="Edit News"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {item.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(item.id)}
                            className="text-green-600 hover:bg-green-50"
                            title="Approve News"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(item)}
                            className="text-red-600 hover:bg-red-50"
                            title="Reject News"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(item)}
                        className="text-red-600 hover:bg-red-50"
                        title="Delete News"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}
