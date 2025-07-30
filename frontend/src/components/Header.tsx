
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';

interface HeaderProps {
  onMenuClick: () => void;
}

const getBreadcrumb = (pathname: string) => {
  const paths: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/clientes': 'Clientes',
    '/usuarios': 'Usuários',
    '/veiculos': 'Veículos',
    '/vendas': 'Vendas',
    '/perfil': 'Perfil'
  };
  return paths[pathname] || 'Dashboard';
};

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden mr-2"
        >
          <Menu size={20} />
        </Button>
        
        <nav className="text-sm text-muted-foreground">
          <span className="text-foreground font-medium">
            {getBreadcrumb(location.pathname)}
          </span>
        </nav>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <User size={20} />
            <span className="hidden sm:inline">{user?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate('/perfil')}>
            <User className="mr-2 h-4 w-4" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
