
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  ShoppingCart, 
  User, 
  Settings,
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/clientes', label: 'Clientes', icon: Users },
  { path: '/usuarios', label: 'Usuários', icon: User },
  { path: '/veiculos', label: 'Veículos', icon: Car },
  { path: '/vendas', label: 'Vendas', icon: ShoppingCart },
  { path: '/perfil', label: 'Perfil', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">Concessionária</h1>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-sidebar-accent md:hidden"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center px-4 py-3 mx-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon size={20} className="mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};
