import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { newsService, News, NewsImage } from '../../services/adminService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2, X, Upload } from 'lucide-react';

export default function NewsForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<NewsImage[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    sub_title: '',
    content: '',
  });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing && id) {
      loadNews(parseInt(id));
    }
  }, [id, isEditing]);

  const loadNews = async (newsId: number) => {
    try {
      setLoading(true);
      const news = await newsService.getById(newsId);
      setFormData({
        title: news.title,
        sub_title: news.sub_title || '',
        content: news.content,
      });
      // Load existing images
      if (news.images && Array.isArray(news.images)) {
        setExistingImages(news.images);
      } else {
        setExistingImages([]);
      }
    } catch (error) {
      toast.error('Failed to load news');
      navigate('/admin/news');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      console.log('📁 Files selected:', files.length);
      files.forEach((file, index) => {
        console.log(`  File ${index + 1}: ${file.name} (${file.size} bytes, type: ${file.type})`);
      });
      
      const newFiles = [...selectedImages, ...files];
      setSelectedImages(newFiles);
      
      // Create previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
      
      console.log('✅ Total selected images:', newFiles.length);
    } else {
      console.log('⚠️ No files selected');
    }
    
    // Reset input to allow selecting the same file again
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setPreviewImages(newPreviews);
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    if (!id) return;
    
    try {
      await newsService.deleteImage(parseInt(id), imageId);
      toast.success('Image deleted successfully');
      // Reload news to refresh images
      if (id) {
        await loadNews(parseInt(id));
      }
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔵 Form submitted');
    console.log('Form data:', formData);
    console.log('Is editing:', isEditing);
    console.log('Selected images:', selectedImages.length);
    
    if (!formData.title || !formData.content) {
      console.log('❌ Validation failed:', {
        title: formData.title,
        content: formData.content,
      });
      toast.error('Title and content are required');
      return;
    }

    try {
      setSaving(true);
      console.log('🟡 Starting API call...');
      
      if (isEditing && id) {
        console.log('📝 Updating news with ID:', id);
        const updateData = {
          title: formData.title,
          sub_title: formData.sub_title || undefined,
          content: formData.content,
        };
        console.log('Update data:', updateData);
        await newsService.update(parseInt(id), updateData);
        
        // Upload new images if any were selected
        if (selectedImages.length > 0) {
          console.log('📷 Uploading new images:', selectedImages.length);
          try {
            const uploadedImages = await newsService.uploadImages(parseInt(id), selectedImages);
            console.log('✅ Images uploaded successfully:', uploadedImages);
            if (!uploadedImages || uploadedImages.length === 0) {
              toast.warning('Images were sent but none were saved. Please check backend logs.');
            } else {
              toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
            }
          } catch (error: any) {
            console.error('❌ Image upload error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to upload images';
            toast.error(`Image upload failed: ${errorMsg}`);
            // Don't throw - allow the news update to complete even if images fail
          }
        }
        
        console.log('✅ News updated successfully');
        toast.success('News updated successfully');
        navigate('/admin/news');
      } else {
        console.log('➕ Creating new news');
        const createData = {
          title: formData.title,
          sub_title: formData.sub_title || undefined,
          content: formData.content,
          images: selectedImages.length > 0 ? selectedImages : undefined,
        };
        console.log('Create data:', {
          ...createData,
          images: createData.images ? `${createData.images.length} files` : 'none',
        });
        console.log('🟢 Calling newsService.create...');
        const result = await newsService.create(createData);
        console.log('✅ News created successfully, result:', result);
        toast.success('News created successfully');
        navigate('/admin/news');
      }
    } catch (error: any) {
      console.error('❌ News operation error:', error);
      console.error('Error details:', {
        response: error.response,
        data: error.response?.data,
        status: error.response?.status,
        message: error.message,
        stack: error.stack,
      });
      
      // Extract error message from various possible locations
      let errorMessage = 'Operation failed';
      if (error.response?.data) {
        errorMessage = error.response.data.message || 
                      error.response.data.error || 
                      error.response.data.data?.message ||
                      JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} news: ${errorMessage}`);
    } finally {
      setSaving(false);
      console.log('🟣 Form submission finished');
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
          onClick={() => navigate('/admin/news')}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit News' : 'Create News'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update news article details' : 'Create a new news article'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 font-medium text-sm">
              News Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="border-gray-300 focus:border-slate-700 focus:ring-slate-700/20 h-11"
              placeholder="Enter news title"
            />
          </div>

          {/* Sub-Title Field */}
          <div className="space-y-2">
            <Label htmlFor="sub_title" className="text-gray-700 font-medium text-sm">
              Sub-Title
            </Label>
            <Input
              id="sub_title"
              value={formData.sub_title}
              onChange={(e) => setFormData({ ...formData, sub_title: e.target.value })}
              className="border-gray-300 focus:border-slate-700 focus:ring-slate-700/20 h-11"
              placeholder="Enter sub-title (optional)"
            />
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-gray-700 font-medium text-sm">
              Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={12}
              className="border-gray-300 focus:border-slate-700 focus:ring-slate-700/20 resize-none"
              placeholder="Enter the full news content..."
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium text-sm">
              Images {isEditing && <span className="text-gray-500 font-normal">(Add new images)</span>}
            </Label>
            
            {/* Existing Images (Edit Mode Only) */}
            {isEditing && existingImages.length > 0 && (
              <div className="mb-4">
                <Label className="text-gray-600 font-medium text-xs mb-2 block">Existing Images:</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_url}
                        alt={`News image ${image.display_order || image.id}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteExistingImage(image.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Upload className="h-10 w-10 text-gray-400" />
                <div className="text-center">
                  <Label htmlFor="images" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Click to upload images
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </Label>
                </div>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>
            
            {/* New Image Previews */}
            {previewImages.length > 0 && (
              <div className="mt-4">
                <Label className="text-gray-600 font-medium text-xs mb-2 block">New Images to Upload:</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/news')}
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
                  {isEditing ? 'Update News' : 'Create News'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
