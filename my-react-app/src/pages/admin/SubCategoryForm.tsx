import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { subCategoryService, SubCategory, categoryService, Category } from '../../services/adminService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function SubCategoryForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    slug: '',
    description: '',
    is_active: 1,
  });

  const isEditing = !!id;

  useEffect(() => {
    loadCategories();
    if (isEditing && id) {
      loadSubCategory(parseInt(id));
    }
  }, [id, isEditing]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll(true);
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const loadSubCategory = async (subCategoryId: number) => {
    try {
      setLoading(true);
      const subCategory = await subCategoryService.getById(subCategoryId);
      setFormData({
        category_id: subCategory.category_id.toString(),
        name: subCategory.name,
        slug: subCategory.slug,
        description: subCategory.description || '',
        is_active: subCategory.is_active,
      });
    } catch (error) {
      toast.error('Failed to load sub-category');
      navigate('/admin/sub-categories');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    // Unicode-aware slug: keep letters/numbers, convert spaces to hyphens
    return name
      .toLowerCase()
      .trim()
      .replace(/[^^\p{L}\p{N}\s-]/gu, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category_id || !formData.name || !formData.slug) {
      toast.error('Category, name and slug are required');
      return;
    }

    try {
      setSaving(true);
      const dataToSend = {
        category_id: parseInt(formData.category_id),
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        is_active: typeof formData.is_active === 'number' ? formData.is_active : (formData.is_active ? 1 : 0),
      };

      if (isEditing && id) {
        await subCategoryService.update(parseInt(id), dataToSend);
        toast.success('Sub-category updated successfully');
      } else {
        await subCategoryService.create(dataToSend);
        toast.success('Sub-category created successfully');
      }
      
      navigate('/admin/sub-categories');
    } catch (error: any) {
      console.error('Sub-category operation error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Operation failed';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
          onClick={() => navigate('/admin/sub-categories')}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Sub-Category' : 'Create Sub-Category'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update sub-category details' : 'Add a new sub-category to your system'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category_id" className="text-gray-700 font-medium text-sm">
              Parent Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              required
            >
              <SelectTrigger className="h-11 w-full border-gray-300 focus:border-slate-700 focus:ring-slate-700/20">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium text-sm">
              Sub-Category Name <span className="text-red-500">*</span>
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
              className="border-gray-300 focus:border-slate-700 focus:ring-slate-700/20 h-11"
              placeholder="Enter sub-category name"
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
              placeholder="sub-category-slug"
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
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div>
              <Label htmlFor="is_active" className="text-gray-700 font-medium text-sm cursor-pointer">
                Sub-Category Status
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
              onClick={() => navigate('/admin/sub-categories')}
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
                  {isEditing ? 'Update Sub-Category' : 'Create Sub-Category'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
