import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface RegisteredUser {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  phone?: string;
  referralCode: string;
  referredBy: string;
  city: string;
  role: 'member' | 'leader' | 'admin' | 'individual';
  isLeader: boolean;
  teamSize: number;
  joinDate: string;
  password: string;
}

interface AuthContextType {
  user: RegisteredUser | null;
  login: (mobile: string, password: string) => { success: boolean; message: string };
  register: (data: { name: string; mobile: string; city?: string; referralCode?: string; role: 'member' | 'leader' | 'individual'; password: string }) => { success: boolean; message: string; user?: RegisteredUser };
  logout: () => void;
  getAllUsers: () => RegisteredUser[];
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo users (pre-seeded)
const DEMO_USERS: RegisteredUser[] = [
  {
    id: '1',
    name: 'Admin User',
    mobile: '9876543210',
    referralCode: 'ADMIN001',
    referredBy: '',
    city: 'Jaipur',
    role: 'leader',
    isLeader: true,
    teamSize: 250,
    joinDate: '2023-01-01',
    password: 'admin123',
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    mobile: '9876543211',
    referralCode: 'RAJ002',
    referredBy: '1',
    city: 'Delhi',
    role: 'leader',
    isLeader: true,
    teamSize: 120,
    joinDate: '2023-03-15',
    password: 'raj123',
  },
  {
    id: '3',
    name: 'Priya Sharma',
    mobile: '9876543212',
    referralCode: 'PRI003',
    referredBy: '2',
    city: 'Mumbai',
    role: 'member',
    isLeader: false,
    teamSize: 45,
    joinDate: '2023-05-20',
    password: 'pri123',
  },
  {
    id: '4',
    name: 'Amit Patel',
    mobile: '9876543213',
    referralCode: '',
    referredBy: '',
    city: 'Ahmedabad',
    role: 'individual',
    isLeader: false,
    teamSize: 0,
    joinDate: '2024-01-15',
    password: 'amit123',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RegisteredUser | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('jwellbox_current_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('jwellbox_current_user');
      }
    }
  }, []);

  // Initialize demo users if not exists
  useEffect(() => {
    const existingUsers = localStorage.getItem('jwellbox_users');
    if (!existingUsers) {
      localStorage.setItem('jwellbox_users', JSON.stringify(DEMO_USERS));
    }
  }, []);

  const getAllUsers = (): RegisteredUser[] => {
    const stored = localStorage.getItem('jwellbox_users');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return DEMO_USERS;
      }
    }
    return DEMO_USERS;
  };

  const register = (data: { name: string; mobile: string; city?: string; referralCode?: string; role: 'member' | 'leader' | 'individual'; password: string }) => {
    const users = getAllUsers();
    
    // Check if mobile already exists
    if (users.find(u => u.mobile === data.mobile)) {
      return { success: false, message: 'This mobile number is already registered!' };
    }

    // Generate referral code (empty for individual users)
    const referralCode = data.role === 'individual' 
      ? '' 
      : data.name.substring(0, 3).toUpperCase() + Math.floor(100 + Math.random() * 900).toString();

    const newUser: RegisteredUser = {
      id: String(users.length + 1),
      name: data.name,
      mobile: data.mobile,
      referralCode,
      referredBy: data.referralCode || '',
      city: data.city || '',
      role: data.role,
      isLeader: data.role === 'leader',
      teamSize: 0,
      joinDate: new Date().toISOString().split('T')[0],
      password: data.password,
    };

    users.push(newUser);
    localStorage.setItem('jwellbox_users', JSON.stringify(users));

    return { success: true, message: 'Registration successful!', user: newUser };
  };

  const login = (mobile: string, password: string) => {
    const users = getAllUsers();
    const found = users.find(u => u.mobile === mobile && u.password === password);
    
    if (found) {
      setUser(found);
      localStorage.setItem('jwellbox_current_user', JSON.stringify(found));
      return { success: true, message: 'Login successful!' };
    }
    return { success: false, message: 'Invalid mobile number or password!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jwellbox_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
