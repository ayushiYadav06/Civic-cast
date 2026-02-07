import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { advertisementService, Advertisement } from '../../services/adminService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';

export default function AdvertisementForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    link_url: '',
    is_active: 1,
  });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing && id) {
      loadAdvertisement(parseInt(id));
    }
  }, [id, isEditing]);

  const loadAdvertisement = async (adId: number) => {
    try {
      setLoading(true);
      const ad = await advertisementService.getById(adId);
      setFormData({
        title: ad.title || '',
        link_url: ad.link_url || '',
        is_active: ad.is_active,
      });
      setPreview(ad.image_url);
    } catch (error) {
      toast.error('Failed to load advertisement');
      navigate('/admin/advertisements');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (!isEditing) {
      setPreview(null);
    } else {
      // Keep existing image preview when editing
      loadAdvertisement(parseInt(id!));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditing && !imageFile) {
      toast.error('Image is required for new advertisements');
      return;
    }

    try {
      setSaving(true);
      const formDataToSend = new FormData();
      if (formData.title) formDataToSend.append('title', formData.title);
      if (formData.link_url) formDataToSend.append('link_url', formData.link_url);
      formDataToSend.append('is_active', formData.is_active.toString());
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (isEditing && id) {
        await advertisementService.update(parseInt(id), imageFile ? formDataToSend : formData);
        toast.success('Advertisement updated successfully');
      } else {
        await advertisementService.create(formDataToSend);
        toast.success('Advertisement created successfully');
      }
      
      navigate('/admin/advertisements');
    } catch (error: any) {
      console.error('Advertisement operation error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Operation failed';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
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
          onClick={() => navigate('/admin/advertisements')}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Advertisement' : 'Create Advertisement'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update advertisement details' : 'Add a new advertisement to your system'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 font-medium text-sm">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border-gray-300 focus:border-slate-700 focus:ring-slate-700/20 h-11"
              placeholder="Enter advertisement title (optional)"
            />
          </div>

          {/* Link URL Field */}
          <div className="space-y-2">
            <Label htmlFor="link_url" className="text-gray-700 font-medium text-sm">
              Link URL
            </Label>
            <Input
              id="link_url"
              type="url"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              className="border-gray-300 focus:border-slate-700 focus:ring-slate-700/20 h-11"
              placeholder="https://example.com"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium text-sm">
              {isEditing ? 'New Image (Optional)' : 'Image'} <span className="text-red-500">{!isEditing && '*'}</span>
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
              <div className="flex flex-col items-center justify-center space-y-4">
                {preview ? (
                  <div className="relative w-full">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                    <div className="text-center">
                      <Label htmlFor="image" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          Click to upload image
                        </span>
                        <span className="text-gray-500"> or drag and drop</span>
                      </Label>
                    </div>
                  </>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="space-y-1">
              <Label htmlFor="is_active" className="text-gray-700 font-medium text-sm cursor-pointer">
                Advertisement Status
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
              onClick={() => navigate('/admin/advertisements')}
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
                  {isEditing ? 'Update Advertisement' : 'Create Advertisement'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
