import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { StorageService } from '../lib/storage';
import { INITIAL_USERS } from '../lib/mockData';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  register: (name: string, email: string, rollNumber?: string) => boolean;
  switchRole: (role: UserRole) => void;
  availableUsers: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    return StorageService.getActiveUser();
  });

  const availableUsers = INITIAL_USERS;

  useEffect(() => {
    if (user) {
      StorageService.saveActiveUser(user);
    }
  }, [user]);

  const login = (email: string, role?: UserRole): boolean => {
    const found = availableUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || (role && u.role === role)
    );
    if (found) {
      setUser(found);
      StorageService.addAuditLog({
        actorName: found.name,
        actorRole: found.role,
        action: 'USER_LOGIN',
        targetType: 'User',
        targetId: found.id,
        details: `User ${found.name} logged into ${found.role} dashboard`,
      });
      return true;
    }

    // Dynamic fallback login
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: role || 'student',
      badge: 'Student Member',
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    if (user) {
      StorageService.addAuditLog({
        actorName: user.name,
        actorRole: user.role,
        action: 'USER_LOGOUT',
        targetType: 'User',
        targetId: user.id,
        details: `User ${user.name} logged out`,
      });
    }
    // Set to public / guest or student default
    setUser(null);
  };

  const register = (name: string, email: string, rollNumber?: string): boolean => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: 'student',
      rollNumber: rollNumber || '2026CS9999',
      badge: 'Enrolled Student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };
    setUser(newUser);
    StorageService.addAuditLog({
      actorName: name,
      actorRole: 'student',
      action: 'USER_REGISTRATION',
      targetType: 'User',
      targetId: newUser.id,
      details: `New student account registered: ${name} (${rollNumber})`,
    });
    return true;
  };

  const switchRole = (newRole: UserRole) => {
    const match = availableUsers.find((u) => u.role === newRole);
    if (match) {
      setUser(match);
      StorageService.addAuditLog({
        actorName: match.name,
        actorRole: match.role,
        action: 'ROLE_SWITCH',
        targetType: 'User',
        targetId: match.id,
        details: `Active role switched to ${newRole}`,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'student',
        isAuthenticated: Boolean(user),
        login,
        logout,
        register,
        switchRole,
        availableUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
