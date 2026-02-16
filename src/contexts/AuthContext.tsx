import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface User {
  id: string;
  username?: string;
  phone?: string;
  isAdmin: boolean;
  loginType: 'guest' | 'username' | 'phone';
  createdAt: string;
}

export interface SiteSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  pages: Page[];
  banners: Banner[];
  buttons: ButtonConfig[];
}

export interface Page {
  id: string;
  name: string;
  path: string;
  isVisible: boolean;
  order: number;
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
  order: number;
}

export interface ButtonConfig {
  id: string;
  label: string;
  path: string;
  position: 'header' | 'footer' | 'sidebar';
  isVisible: boolean;
  order: number;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  settings: SiteSettings;
  login: (type: 'guest' | 'username' | 'phone', credentials?: { username?: string; password?: string; phone?: string }) => boolean;
  logout: () => void;
  register: (data: { username?: string; phone?: string; password: string }) => { success: boolean; message: string };
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  addPage: (page: Omit<Page, 'id'>) => void;
  removePage: (id: string) => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  removeBanner: (id: string) => void;
  addButton: (button: Omit<ButtonConfig, 'id'>) => void;
  removeButton: (id: string) => void;
  updateButton: (id: string, updates: Partial<ButtonConfig>) => void;
  getAllUsers: () => User[];
  deleteUser: (id: string) => void;
  validateUsername: (username: string) => { valid: boolean; message: string };
  validatePassword: (password: string) => { valid: boolean; message: string };
  validatePhone: (phone: string) => { valid: boolean; message: string };
}

const defaultSettings: SiteSettings = {
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
  },
  pages: [
    { id: '1', name: 'الرئيسية', path: '/', isVisible: true, order: 1 },
    { id: '2', name: 'عن الموقع', path: '/about', isVisible: true, order: 2 },
    { id: '3', name: 'الخدمات', path: '/services', isVisible: true, order: 3 },
    { id: '4', name: 'اتصل بنا', path: '/contact', isVisible: true, order: 4 },
  ],
  banners: [],
  buttons: [
    { id: '1', label: 'الرئيسية', path: '/', position: 'header', isVisible: true, order: 1 },
    { id: '2', label: 'عن الموقع', path: '/about', position: 'header', isVisible: true, order: 2 },
    { id: '3', label: 'الخدمات', path: '/services', position: 'header', isVisible: true, order: 3 },
    { id: '4', label: 'اتصل بنا', path: '/contact', position: 'header', isVisible: true, order: 4 },
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  // Initialize admin and load data
  useEffect(() => {
    const storedUsers = localStorage.getItem('bodrix_users');
    const storedSettings = localStorage.getItem('bodrix_settings');
    const storedCurrentUser = localStorage.getItem('bodrix_current_user');
    
    let initialUsers: User[] = [];
    
    if (storedUsers) {
      initialUsers = JSON.parse(storedUsers);
    }
    
    // Check if admin exists, if not create it
    const adminExists = initialUsers.find(u => u.username === 'bo');
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin-001',
        username: 'bo',
        isAdmin: true,
        loginType: 'username',
        createdAt: new Date().toISOString(),
      };
      initialUsers.push(adminUser);
      localStorage.setItem('bodrix_users', JSON.stringify(initialUsers));
      localStorage.setItem('bodrix_admin_pass', 'drix1');
    }
    
    setUsers(initialUsers);
    
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    } else {
      localStorage.setItem('bodrix_settings', JSON.stringify(defaultSettings));
    }
    
    if (storedCurrentUser) {
      setUser(JSON.parse(storedCurrentUser));
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('bodrix_users', JSON.stringify(users));
    }
  }, [users]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bodrix_settings', JSON.stringify(settings));
  }, [settings]);

  // Save current user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('bodrix_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bodrix_current_user');
    }
  }, [user]);

  const validateUsername = (username: string): { valid: boolean; message: string } => {
    if (username.length < 6) {
      return { valid: false, message: 'اسم المستخدم يجب أن يكون 6 خانات على الأقل' };
    }
    if (!/^[a-zA-Z]/.test(username)) {
      return { valid: false, message: 'اسم المستخدم يجب أن يبدأ بحرف' };
    }
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(username)) {
      return { valid: false, message: 'اسم المستخدم يجب أن يحتوي على أحرف وأرقام فقط' };
    }
    return { valid: true, message: '' };
  };

  const validatePassword = (password: string): { valid: boolean; message: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'كلمة المرور يجب أن تكون 8 خانات على الأقل' };
    }
    if (!/^[a-zA-Z]/.test(password)) {
      return { valid: false, message: 'كلمة المرور يجب أن تبدأ بحرف' };
    }
    return { valid: true, message: '' };
  };

  const validatePhone = (phone: string): { valid: boolean; message: string } => {
    const phoneRegex = /^\+\d{1,4}\d{8,12}$/;
    if (!phoneRegex.test(phone)) {
      return { valid: false, message: 'رقم الجوال يجب أن يبدأ برمز الدولة (مثل +966) متبوعاً برقم الجوال' };
    }
    return { valid: true, message: '' };
  };

  const login = (type: 'guest' | 'username' | 'phone', credentials?: { username?: string; password?: string; phone?: string }): boolean => {
    if (type === 'guest') {
      const guestUser: User = {
        id: `guest-${Date.now()}`,
        isAdmin: false,
        loginType: 'guest',
        createdAt: new Date().toISOString(),
      };
      setUser(guestUser);
      return true;
    }

    if (type === 'username' && credentials?.username && credentials?.password) {
      // Check admin login
      if (credentials.username === 'bo') {
        const adminPass = localStorage.getItem('bodrix_admin_pass');
        if (credentials.password === adminPass) {
          const adminUser = users.find(u => u.username === 'bo');
          if (adminUser) {
            setUser(adminUser);
            return true;
          }
        }
      }
      
      // Check regular user
      const storedPass = localStorage.getItem(`bodrix_pass_${credentials.username}`);
      if (storedPass === credentials.password) {
        const foundUser = users.find(u => u.username === credentials.username);
        if (foundUser) {
          setUser(foundUser);
          return true;
        }
      }
    }

    if (type === 'phone' && credentials?.phone && credentials?.password) {
      const storedPass = localStorage.getItem(`bodrix_pass_${credentials.phone}`);
      if (storedPass === credentials.password) {
        const foundUser = users.find(u => u.phone === credentials.phone);
        if (foundUser) {
          setUser(foundUser);
          return true;
        }
      }
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bodrix_current_user');
  };

  const register = (data: { username?: string; phone?: string; password: string }): { success: boolean; message: string } => {
    if (data.username) {
      const usernameValidation = validateUsername(data.username);
      if (!usernameValidation.valid) {
        return { success: false, message: usernameValidation.message };
      }
      
      if (users.some(u => u.username === data.username)) {
        return { success: false, message: 'اسم المستخدم موجود مسبقاً' };
      }

      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.valid) {
        return { success: false, message: passwordValidation.message };
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        username: data.username,
        isAdmin: false,
        loginType: 'username',
        createdAt: new Date().toISOString(),
      };

      setUsers(prev => [...prev, newUser]);
      localStorage.setItem(`bodrix_pass_${data.username}`, data.password);
      return { success: true, message: 'تم التسجيل بنجاح' };
    }

    if (data.phone) {
      const phoneValidation = validatePhone(data.phone);
      if (!phoneValidation.valid) {
        return { success: false, message: phoneValidation.message };
      }

      if (users.some(u => u.phone === data.phone)) {
        return { success: false, message: 'رقم الجوال مسجل مسبقاً' };
      }

      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.valid) {
        return { success: false, message: passwordValidation.message };
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        phone: data.phone,
        isAdmin: false,
        loginType: 'phone',
        createdAt: new Date().toISOString(),
      };

      setUsers(prev => [...prev, newUser]);
      localStorage.setItem(`bodrix_pass_${data.phone}`, data.password);
      return { success: true, message: 'تم التسجيل بنجاح' };
    }

    return { success: false, message: 'بيانات غير صحيحة' };
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addPage = (page: Omit<Page, 'id'>) => {
    const newPage: Page = { ...page, id: `page-${Date.now()}` };
    setSettings(prev => ({ ...prev, pages: [...prev.pages, newPage] }));
  };

  const removePage = (id: string) => {
    setSettings(prev => ({ ...prev, pages: prev.pages.filter(p => p.id !== id) }));
  };

  const updatePage = (id: string, updates: Partial<Page>) => {
    setSettings(prev => ({
      ...prev,
      pages: prev.pages.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const addBanner = (banner: Omit<Banner, 'id'>) => {
    const newBanner: Banner = { ...banner, id: `banner-${Date.now()}` };
    setSettings(prev => ({ ...prev, banners: [...prev.banners, newBanner] }));
  };

  const removeBanner = (id: string) => {
    setSettings(prev => ({ ...prev, banners: prev.banners.filter(b => b.id !== id) }));
  };

  const addButton = (button: Omit<ButtonConfig, 'id'>) => {
    const newButton: ButtonConfig = { ...button, id: `btn-${Date.now()}` };
    setSettings(prev => ({ ...prev, buttons: [...prev.buttons, newButton] }));
  };

  const removeButton = (id: string) => {
    setSettings(prev => ({ ...prev, buttons: prev.buttons.filter(b => b.id !== id) }));
  };

  const updateButton = (id: string, updates: Partial<ButtonConfig>) => {
    setSettings(prev => ({
      ...prev,
      buttons: prev.buttons.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  const getAllUsers = () => users;

  const deleteUser = (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete && !userToDelete.isAdmin) {
      setUsers(prev => prev.filter(u => u.id !== id));
      if (userToDelete.username) {
        localStorage.removeItem(`bodrix_pass_${userToDelete.username}`);
      }
      if (userToDelete.phone) {
        localStorage.removeItem(`bodrix_pass_${userToDelete.phone}`);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      settings,
      login,
      logout,
      register,
      updateSettings,
      addPage,
      removePage,
      updatePage,
      addBanner,
      removeBanner,
      addButton,
      removeButton,
      updateButton,
      getAllUsers,
      deleteUser,
      validateUsername,
      validatePassword,
      validatePhone,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
