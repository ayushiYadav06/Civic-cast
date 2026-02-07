import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import logoImage from '../../assets/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'operator'>('admin');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, role);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src={logoImage} alt="CivicCast" className="h-16 w-16 rounded-lg shadow-md" />
          <h2 className="mt-4 text-3xl font-bold text-slate-800">CivicCast CMS</h2>
          <p className="text-sm text-gray-600 mt-1">Sign in to your account</p>
        </div>

        <Card className="w-full shadow-xl rounded-2xl overflow-hidden border border-blue-200 bg-blue-50" style={{width:"40%" , margin:"auto"}}>
          <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="role" className="text-gray-700 font-medium ">Login As</Label>
              <Select value={role} onValueChange={(value) => setRole(value as 'admin' | 'operator')} >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="operator">Operator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                {role === 'admin' ? 'Email or Username' : 'Login ID'}
              </Label>
              <Input
                id="email"
                type="text"
                placeholder={role === 'admin' ? 'admin@civiccast.com' : 'Enter login ID'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            <Button type="submit" className="w-full h-12 text-base font-medium mt-6" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-center text-gray-600">
            <p><span className="font-medium">Default Admin:</span> admin / admin123</p>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
