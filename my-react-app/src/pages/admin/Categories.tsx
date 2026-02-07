import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService, Category } from '../../services/adminService';
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
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Loader2, FolderTree } from 'lucide-react';

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleDeleteClick = async (category: Category) => {
    const ok = window.confirm(`Delete category "${category.name}"? This action cannot be undone.`);
    if (!ok) return;

    try {
      await categoryService.delete(category.id);
      toast.success('Category deleted successfully');
      loadCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    navigate(`/admin/categories/${category.id}/edit`);
  };

  const handleCreate = () => {
    navigate('/admin/categories/new');
  };


  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">Manage news categories</p>
        </div>
        <Button 
          type="button"
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Name</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Slug</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Description</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-500 border border-gray-200">
                  <div className="flex flex-col items-center gap-2">
                    <FolderTree className="h-12 w-12 text-gray-300" />
                    <p className="text-lg font-medium">No categories found</p>
                    <p className="text-sm">Click "Add Category" to create your first category</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-900 border border-gray-200 text-center">{category.name}</TableCell>
                  <TableCell className="text-gray-600 font-mono text-sm border border-gray-200 text-center">{category.slug}</TableCell>
                  <TableCell className="text-gray-600 max-w-xs truncate border border-gray-200 text-center">
                    {category.description || <span className="text-gray-400">-</span>}
                  </TableCell>
                  <TableCell className="border border-gray-200 text-center">
                    <div className="flex justify-center">
                      <Badge 
                        variant={category.is_active ? 'default' : 'secondary'}
                        className={category.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}
                      >
                        {category.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="border border-gray-200 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(category)}
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
