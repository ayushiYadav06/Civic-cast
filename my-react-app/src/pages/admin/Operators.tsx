import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { operatorService, Operator } from '../../services/adminService';
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
import { Plus, Edit, Power, Users } from 'lucide-react';

export default function Operators() {
  const navigate = useNavigate();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOperators();
  }, []);

  const loadOperators = async () => {
    try {
      const data = await operatorService.getAll();
      setOperators(data);
    } catch (error) {
      toast.error('Failed to load operators');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (operator: Operator) => {
    navigate(`/admin/operators/${operator.id}/edit`);
  };

  const handleCreate = () => {
    navigate('/admin/operators/new');
  };

  const handleToggleActive = async (id: number) => {
    try {
      await operatorService.toggleActive(id);
      toast.success('Operator status updated');
      loadOperators();
    } catch (error) {
      toast.error('Failed to update operator status');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Operators</h1>
          <p className="text-gray-600">Manage news operators</p>
        </div>
        <Button 
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Operator
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Login ID</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Name</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Area</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Post</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">User ID</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 border border-gray-200 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operators.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-500 border border-gray-200">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-12 w-12 text-gray-300" />
                    <p className="text-lg font-medium">No operators found</p>
                    <p className="text-sm">Click "Add Operator" to create your first operator</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              operators.map((operator) => (
                <TableRow key={operator.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-mono text-sm text-gray-900 border border-gray-200 text-center">{operator.login_id}</TableCell>
                  <TableCell className="font-medium text-gray-900 border border-gray-200 text-center">{operator.name}</TableCell>
                  <TableCell className="text-gray-600 border border-gray-200 text-center">{operator.area}</TableCell>
                  <TableCell className="text-gray-600 border border-gray-200 text-center">{operator.post}</TableCell>
                  <TableCell className="text-gray-600 border border-gray-200 text-center">{operator.user_id || <span className="text-gray-400">-</span>}</TableCell>
                  <TableCell className="border border-gray-200 text-center">
                    <div className="flex justify-center">
                      <Badge 
                        variant={operator.is_active ? 'default' : 'secondary'}
                        className={operator.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}
                      >
                        {operator.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="border border-gray-200 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(operator)}
                        className="hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(operator.id)}
                        title={operator.is_active ? 'Deactivate' : 'Activate'}
                        className="hover:bg-green-50"
                      >
                        <Power className={`h-4 w-4 ${operator.is_active ? 'text-green-600' : 'text-gray-400'}`} />
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
