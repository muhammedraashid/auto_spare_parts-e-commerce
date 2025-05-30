
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Omega, Search } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { fetchUsers } from '@/services/userServices';

// Mock data for users
const mockUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2023-04-25T14:30:00'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'staff',
    status: 'active',
    lastLogin: '2023-04-24T09:15:00'
  },
  {
    id: '3',
    name: 'Mohammad Al-Farsi',
    email: 'mohammad@example.com',
    role: 'staff',
    status: 'inactive',
    lastLogin: '2023-04-10T11:20:00'
  },
  {
    id: '4',
    name: 'Ahmed Abdullah',
    email: 'ahmed@example.com',
    role: 'customer',
    status: 'active',
    lastLogin: '2023-04-22T16:45:00'
  }
];

export default function UsersPage() {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load users.');
      } finally {
        setLoading(false);
      }
    };
  
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default" className="bg-purple-500">{isRtl ? 'مدير' : 'Admin'}</Badge>;
      case 'staff':
        return <Badge variant="default" className="bg-blue-500">{isRtl ? 'موظف' : 'Staff'}</Badge>;
      default:
        return <Badge variant="outline">{isRtl ? 'عميل' : 'Customer'}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge variant="outline" className="border-green-500 text-green-500">{isRtl ? 'نشط' : 'Active'}</Badge>
      : <Badge variant="outline" className="border-red-500 text-red-500">{isRtl ? 'غير نشط' : 'Inactive'}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(isRtl ? 'ar' : 'en', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }).format(date);
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
        : user
    ));
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isRtl ? 'إدارة المستخدمين' : 'User Management'}
          </h1>
          <p className="text-muted-foreground">
            {isRtl ? 'عرض وإدارة المستخدمين والأذونات' : 'View and manage users and permissions'}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={isRtl ? 'البحث عن مستخدم...' : 'Search users...'}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isRtl ? 'قائمة المستخدمين' : 'User List'}</CardTitle>
          <CardDescription>
            {isRtl ? 'قائمة بجميع المستخدمين المسجلين في النظام' : 'List of all users registered in the system'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">{isRtl ? 'الاسم' : 'Name'}</th>
                  <th className="text-left py-3 px-4">{isRtl ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className="text-left py-3 px-4">{isRtl ? 'الدور' : 'Role'}</th>
                  <th className="text-left py-3 px-4">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="text-left py-3 px-4">{isRtl ? 'آخر تسجيل دخول' : 'Last Login'}</th>
                  <th className="text-right py-3 px-4">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                    <td className="py-3 px-4">{formatDate(user.lastLogin)}</td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.status === 'active' 
                          ? (isRtl ? 'تعطيل' : 'Deactivate') 
                          : (isRtl ? 'تفعيل' : 'Activate')}
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted-foreground">
                      {isRtl ? 'لا توجد نتائج مطابقة' : 'No matching results found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
