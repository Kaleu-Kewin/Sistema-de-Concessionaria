
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const resposta = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha: senha })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        toast.error(dados.mensagem || 'Erro ao fazer login');
        return false;
      }

      const userData: User = {
        id: dados.id,
        name: dados.nome,
        email: dados.email,
        role: dados.perfil
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Login realizado com sucesso!');
      return true;

    } catch (erro) {
      toast.error('Erro ao conectar ao servidor');
      return false;
    }
  };

  const register = async (name: string, email: string, senha: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userData = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user' as const
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Cadastro realizado com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao criar conta');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logout realizado com sucesso!');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
