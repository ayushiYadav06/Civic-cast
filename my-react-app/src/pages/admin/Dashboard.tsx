import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Newspaper, Eye, Calendar, Megaphone, FolderTree, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const statsData = await dashboardService.getStats();
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
            <CardTitle className="text-base font-semibold text-gray-700">Categories</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center shadow-sm">
              <FolderTree className="h-6 w-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-5xl font-extrabold text-gray-900 mb-2">{stats?.categories?.total || 0}</div>
            <p className="text-sm text-gray-500 font-medium">Total categories</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
            <CardTitle className="text-base font-semibold text-gray-700">Sub-Categories</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center shadow-sm">
              <FolderTree className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-5xl font-extrabold text-gray-900 mb-2">{stats?.sub_categories?.total || 0}</div>
            <p className="text-sm text-gray-500 font-medium">Total sub-categories</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
            <CardTitle className="text-base font-semibold text-gray-700">Operators</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center shadow-sm">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-5xl font-extrabold text-gray-900 mb-2">{stats?.operators?.total || 0}</div>
            <p className="text-sm text-gray-500 font-medium">Total operators</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
            <CardTitle className="text-base font-semibold text-gray-700">Total News</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center shadow-sm">
              <Newspaper className="h-6 w-6 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-5xl font-extrabold text-gray-900 mb-2">{stats?.news?.total || 0}</div>
            <p className="text-sm text-gray-500 font-medium">
              {stats?.news?.pending || 0} pending approval
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
            <CardTitle className="text-base font-semibold text-gray-700">Total Views</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shadow-sm">
              <Eye className="h-6 w-6 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-5xl font-extrabold text-gray-900 mb-2">{stats?.news?.total_views?.toLocaleString() || 0}</div>
            <p className="text-sm text-gray-500 font-medium">All time views</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
            <CardTitle className="text-base font-semibold text-gray-700">This Month</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center shadow-sm">
              <Calendar className="h-6 w-6 text-teal-600" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-5xl font-extrabold text-gray-900 mb-2">{stats?.news?.this_month || 0}</div>
            <p className="text-sm text-gray-500 font-medium">News posted this month</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
            <CardTitle className="text-base font-semibold text-gray-700">Advertisements</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-pink-100 flex items-center justify-center shadow-sm">
              <Megaphone className="h-6 w-6 text-pink-600" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-5xl font-extrabold text-gray-900 mb-2">{stats?.advertisements?.total || 0}</div>
            <p className="text-sm text-gray-500 font-medium">{stats?.advertisements?.active || 0} active</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
