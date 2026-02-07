import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { operatorService, Operator } from '../../services/adminService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';

export default function OperatorForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newOperator, setNewOperator] = useState<Operator | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    post: '',
    user_id: '',
    password: '',
  });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing && id) {
      loadOperator(parseInt(id));
    }
  }, [id, isEditing]);

  const loadOperator = async (operatorId: number) => {
    try {
      setLoading(true);
      const operator = await operatorService.getById(operatorId);
      setFormData({
        name: operator.name,
        area: operator.area,
        post: operator.post,
        user_id: operator.user_id || '',
        password: '',
      });
    } catch (error) {
      toast.error('Failed to load operator');
      navigate('/admin/operators');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.area || !formData.post) {
      toast.error('Name, area, and post are required');
      return;
    }

    try {
      setSaving(true);
      
      if (isEditing && id) {
        const updateData: any = {
          name: formData.name,
          area: formData.area,
          post: formData.post,
          user_id: formData.user_id || undefined,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await operatorService.update(parseInt(id), updateData);
        toast.success('Operator updated successfully');
        navigate('/admin/operators');
      } else {
        const data = await operatorService.create({
          name: formData.name,
          area: formData.area,
          post: formData.post,
          user_id: formData.user_id || undefined,
        });
        setNewOperator(data);
        toast.success('Operator created successfully');
      }
    } catch (error: any) {
      console.error('Operator operation error:', error);
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
          onClick={() => navigate('/admin/operators')}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Operator' : 'Create Operator'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update operator details' : 'Add a new operator to your system'}
          </p>
        </div>
      </div>

      {/* New Operator Credentials Alert */}
      {newOperator && newOperator.generated_password && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            <div className="space-y-2">
              <p className="font-semibold">Operator created successfully!</p>
              <div className="space-y-1 text-sm">
                <p><strong>Login ID:</strong> {newOperator.login_id}</p>
                <p><strong>Password:</strong> {newOperator.generated_password}</p>
              </div>
              <p className="text-xs text-green-700 mt-2">
                Please save these credentials. The password will not be shown again.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium text-sm">
              Operator Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="border-gray-300 focus:border-slate-700 focus:ring-slate-700/20 h-11"
              placeholder="Enter operator name"
            />
          </div>

          {/* Area Field */}
          <div className="space-y-2">
            <Label htmlFor="area" className="text-gray-700 font-medium text-sm">
              Area <span className="text-red-500">*</span>
            </Label>
            <Input
              id="area"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              required
              className="border-gray-300 focus:border-slate-700 focus:ring-slate-700/20 h-11"
              placeholder="Enter area"
            />
          </div>

          {/* Post Field */}
          <div className="space-y-2">
            <Label htmlFor="post" className="text-gray-700 font-medium text-sm">
              Post <span className="text-red-500">*</span>
            </Label>
            <Input
              id="post"
              value={formData.post}
              onChange={(e) => setFormData({ ...formData, post: e.target.value })}
              required
              className="border-gray-300 focus:border-slate-700 focus:ring-slate-700/20 h-11"
              placeholder="Enter post/position"
            />
          </div>

          {/* User ID Field */}
          <div className="space-y-2">
            <Label htmlFor="user_id" className="text-gray-700 font-medium text-sm">
              User ID
            </Label>
            <Input
              id="user_id"
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              className="border-gray-300 focus:border-slate-700 focus:ring-slate-700/20 h-11"
              placeholder="Enter user ID (optional)"
            />
          </div>

          {/* Password Field (only for editing) */}
          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 pr-10"
                  placeholder="Leave blank to keep current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-10 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/operators')}
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
                  {isEditing ? 'Update Operator' : 'Create Operator'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
