import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { advertisementService, Advertisement } from '../../services/adminService';
import { Button } from '../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Power, Megaphone } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';

export default function Advertisements() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  const handleDeleteClick = async (ad: Advertisement) => {
    const ok = window.confirm(`Delete advertisement "${ad.title || ad.id}"? This action cannot be undone.`);
    if (!ok) return;

    try {
      await advertisementService.delete(ad.id);
      toast.success('Advertisement deleted successfully');
      loadAdvertisements();
    } catch (error) {
      toast.error('Failed to delete advertisement');
    }
  };

  useEffect(() => {
    loadAdvertisements();
  }, []);

  const loadAdvertisements = async () => {
    try {
      const endpoint = user?.role === 'operator' 
        ? API_ENDPOINTS.OPERATOR_ADVERTISEMENTS 
        : API_ENDPOINTS.ADVERTISEMENTS;
      const data = await advertisementService.getAll({ endpoint });
      setAdvertisements(data);
    } catch (error) {
      toast.error('Failed to load advertisements');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ad: Advertisement) => {
    navigate(`/admin/advertisements/${ad.id}/edit`);
  };

  const handleCreate = () => {
    navigate('/admin/advertisements/new');
  };

  const handleToggleActive = async (id: number) => {
    try {
      await advertisementService.toggleActive(id);
      toast.success('Advertisement status updated');
      loadAdvertisements();
    } catch (error) {
      toast.error('Failed to update advertisement status');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advertisements</h1>
          <p className="text-gray-600">Manage advertisements</p>
        </div>
        <Button 
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Advertisement
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Image</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Title</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Link</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {advertisements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-500 border border-gray-200">
                  <div className="flex flex-col items-center gap-2">
                    <Megaphone className="h-12 w-12 text-gray-300" />
                    <p className="text-lg font-medium">No advertisements found</p>
                    <p className="text-sm">Click "Add Advertisement" to create your first advertisement</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              advertisements.map((ad) => (
                <TableRow key={ad.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="border border-gray-200 text-center">
                    <div className="flex justify-center">
                      <img
                        src={ad.image_url}
                        alt={ad.title || 'Advertisement'}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 border border-gray-200 text-center">{ad.title || <span className="text-gray-400">-</span>}</TableCell>
                  <TableCell className="max-w-xs truncate text-gray-600 border border-gray-200 text-center">{ad.link_url || <span className="text-gray-400">-</span>}</TableCell>
                  <TableCell className="border border-gray-200 text-center">
                    <div className="flex justify-center">
                      <Badge 
                        variant={ad.is_active ? 'default' : 'secondary'}
                        className={ad.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}
                      >
                        {ad.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="border border-gray-200 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(ad)}
                        className="hover:bg-amber-50 hover:text-slate-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(ad.id)}
                        title={ad.is_active ? 'Deactivate' : 'Activate'}
                        className="hover:bg-green-50"
                      >
                        <Power className={`h-4 w-4 ${ad.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(ad)}
                        className="hover:bg-red-50 hover:text-red-700"
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
