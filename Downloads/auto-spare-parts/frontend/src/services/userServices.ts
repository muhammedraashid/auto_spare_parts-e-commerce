import api from "./api";

export interface User {
    id: string;
    name: string;
    email:string;
    role:'admin' | 'staff' | 'customer';
    status:'active' | 'inactive';
    lastLogin:string;
}

export interface UserResponse{
    id:number;
    name?:string;
    username?:string;
    email?:string;
    is_staff:boolean;
    is_active:boolean;
    last_login:string|null;

}

export const fetchUsers = async (): Promise<User[]> => {
    try {
      const response = await api.get<{ results: UserResponse[] }>('users/');
      return response.data.results.map((item) => ({
        id: item.id.toString(),
        name: item.name || item.username || '',
        email: item.email,
        role: item.is_staff ? 'admin' : 'customer',
        status: item.is_active ? 'active' : 'inactive',
        lastLogin: item.last_login || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };
  