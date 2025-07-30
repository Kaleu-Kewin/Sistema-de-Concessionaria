
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Shield, Key, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const Perfil = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.name || !profileData.email) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      toast.error('Email inválido');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
    }, 1000);
  };

  const validatePasswordForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Nova senha deve ter pelo menos 6 caracteres';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Senha alterada com sucesso!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
    }, 1000);
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrador',
      gerente: 'Gerente',
      vendedor: 'Vendedor',
      user: 'Usuário'
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e configurações
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Atualize suas informações básicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-muted' : ''}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-muted' : ''}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Função</Label>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {getRoleLabel(user?.role || 'user')}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                {isEditing ? (
                  <>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Editar Perfil
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Alterar Senha
            </CardTitle>
            <CardDescription>
              Mantenha sua conta segura com uma senha forte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className={errors.currentPassword ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-destructive">{errors.currentPassword}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className={errors.newPassword ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-destructive">{errors.newPassword}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full">
                <Key className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>
            Detalhes sobre sua conta no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">ID da Conta</Label>
              <p className="text-sm">{user?.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <p className="text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Função</Label>
              <p className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {getRoleLabel(user?.role || 'user')}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <p className="text-sm text-green-600 font-medium">Ativo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Perfil;
