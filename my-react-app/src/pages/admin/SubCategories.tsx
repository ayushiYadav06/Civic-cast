import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subCategoryService, SubCategory, categoryService, Category } from '../../services/adminService';
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
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';

export default function SubCategories() {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);

  const handleDeleteClick = async (subCategory: SubCategory) => {
    const ok = window.confirm(`Delete sub-category "${subCategory.name}"? This action cannot be undone.`);
    if (!ok) return;

    try {
      await subCategoryService.delete(subCategory.id);
      toast.success('Sub-category deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete sub-category');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subCats, cats] = await Promise.all([
        subCategoryService.getAll(),
        categoryService.getAll(true),
      ]);
      setSubCategories(subCats);
      setCategories(cats);
    } catch (error) {
      toast.error('Failed to load sub-categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subCategory: SubCategory) => {
    navigate(`/admin/sub-categories/${subCategory.id}/edit`);
  };

  const handleCreate = () => {
    navigate('/admin/sub-categories/new');
  };


  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sub-Categories</h1>
          <p className="text-gray-600">Manage sub-categories under categories</p>
        </div>
        <Button 
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Sub-Category
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Category</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Name</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Slug</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500 border border-gray-200">
                  No sub-categories found
                </TableCell>
              </TableRow>
            ) : (
              subCategories.map((subCategory) => (
                <TableRow key={subCategory.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="border border-gray-200 text-center">{subCategory.category_name || '-'}</TableCell>
                  <TableCell className="font-medium border border-gray-200 text-center">{subCategory.name}</TableCell>
                  <TableCell className="text-gray-500 border border-gray-200 text-center">{subCategory.slug}</TableCell>
                  <TableCell className="border border-gray-200 text-center">
                    <div className="flex justify-center">
                      <Badge variant={subCategory.is_active ? 'default' : 'secondary'}>
                        {subCategory.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="border border-gray-200 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(subCategory)}
                        className="hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(subCategory)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
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
