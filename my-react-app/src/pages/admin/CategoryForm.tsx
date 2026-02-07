import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryService, Category } from '../../services/adminService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function CategoryForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', is_active: 1 });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing && id) {
      loadCategory(parseInt(id));
    }
  }, [id, isEditing]);

  const loadCategory = async (categoryId: number) => {
    try {
      setLoading(true);
      const category = await categoryService.getById(categoryId);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        is_active: category.is_active,
      });
    } catch (error) {
      toast.error('Failed to load category');
      navigate('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    // Allow Unicode letters and numbers, convert spaces to hyphens
    return name
      .toLowerCase()
      .trim()
      // remove characters except letters, numbers, spaces and hyphens (Unicode-aware)
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug) {
      toast.error('Name and slug are required');
      return;
    }

    try {
      setSaving(true);
      const dataToSend = {
        ...formData,
        is_active: typeof formData.is_active === 'number' ? formData.is_active : (formData.is_active ? 1 : 0),
        description: formData.description || undefined
      };

      if (isEditing && id) {
        await categoryService.update(parseInt(id), dataToSend);
        toast.success('Category updated successfully');
        navigate('/admin/categories');
      } else {
        const created = await categoryService.create(dataToSend);
        toast.success('Category created successfully');
        navigate('/admin/categories');
      }
    } catch (error: any) {
      console.error('Category operation error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Operation failed';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/categories')}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Category' : 'Create Category'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update category details' : 'Add a new category to your system'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium text-sm">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  name: e.target.value,
                  slug: generateSlug(e.target.value),
                });
              }}
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11"
              placeholder="Enter category name"
            />
          </div>

          {/* Slug Field */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-gray-700 font-medium text-sm">
              Slug <span className="text-red-500">*</span>
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 font-mono text-sm"
              placeholder="category-slug"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium text-sm">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              placeholder="Enter a brief description (optional)"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <Label htmlFor="is_active" className="text-gray-700 font-medium text-sm cursor-pointer">
                Category Status
              </Label>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active === 1}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked ? 1 : 0 })
              }
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/categories')}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm min-w-[120px]"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Category' : 'Create Category'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
