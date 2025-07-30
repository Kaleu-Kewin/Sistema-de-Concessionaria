import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Loader2, User, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  tipo: 'Comum' | 'Administrador' | 'Vendedor' | 'Gerente' | 'Financeiro' | 'Mecânico' | 'Estoquista' | 'Caixa' | 'Atendente';
  status: 'Ativo' | 'Inativo' | 'Bloqueado';
  created_at?: string;
  ultimoLogin?: string;
}

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'Comum' as 'Comum' | 'Administrador' | 'Vendedor' | 'Gerente' | 'Financeiro' | 'Mecânico' | 'Estoquista' | 'Caixa' | 'Atendente',
    status: 'Ativo' as 'Ativo' | 'Inativo' | 'Bloqueado'
  });

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`);
      if (response.ok) {
        const data = await response.json();
        const mappedData = data.map((usuario: any) => ({
          ...usuario,
          tipo: usuario.tipo_usuario || usuario.tipo
        }));
        setUsuarios(mappedData);
      } else {
        toast.error('Erro ao carregar usuários');
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Converte valores do backend (sem acentos) para exibição (com acentos)
  const formatTipoDisplay = (tipo: string) => {
    const tipoMap: { [key: string]: string } = {
      'Administrador': 'Administrador',
      'Gerente': 'Gerente',
      'Mecanico': 'Mecânico',
      'Vendedor': 'Vendedor',
      'Atendente': 'Atendente',
      'Comum': 'Comum',
      'Financeiro': 'Financeiro',
      'Estoquista': 'Estoquista',
      'Caixa': 'Caixa'
    };
    return tipoMap[tipo] || tipo;
  };

  // Converte valores de exibição (com acentos) para backend (sem acentos)
  const formatTipoBackend = (tipo: string) => {
    const tipoMap: { [key: string]: string } = {
      'Administrador': 'Administrador',
      'Gerente': 'Gerente',
      'Mecânico': 'Mecanico',
      'Vendedor': 'Vendedor',
      'Atendente': 'Atendente',
      'Comum': 'Comum',
      'Financeiro': 'Financeiro',
      'Estoquista': 'Estoquista',
      'Caixa': 'Caixa'
    };
    return tipoMap[tipo] || tipo;
  };

  const getTipoUsuarioBadge = (tipo: string) => {
    const displayTipo = formatTipoDisplay(tipo);
    switch (displayTipo) {
      case 'Administrador':
        return 'bg-red-500 text-white hover:bg-red-600';
      case 'Gerente':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'Vendedor':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'Financeiro':
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'Mecânico':
        return 'bg-purple-500 text-white hover:bg-purple-600';
      case 'Estoquista':
        return 'bg-orange-500 text-white hover:bg-orange-600';
      case 'Caixa':
        return 'bg-pink-500 text-white hover:bg-pink-600';
      case 'Atendente':
        return 'bg-indigo-500 text-white hover:bg-indigo-600';
      case 'Comum':
        return 'bg-gray-500 text-white hover:bg-gray-600';
      default:
        return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'Inativo':
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'Bloqueado':
        return 'bg-red-500 text-white hover:bg-red-600';
      default:
        return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.senha) {
      toast.error('Nome, email e senha são obrigatórios!');
      return;
    }

    setLoading(true);
    try {
      // Mapear o campo "tipo" para "tipo_usuario" para o backend
      const backendData = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        tipo: formatTipoBackend(formData.tipo),
        status: formData.status
      };

      if (editingUsuario) {
        // Atualizar usuário existente
        const response = await fetch(`${API_BASE_URL}/usuarios/${editingUsuario.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendData),
        });

        if (response.ok) {
          toast.success('Usuário atualizado com sucesso!');
          loadUsuarios();
        } else {
          toast.error('Erro ao atualizar usuário');
        }
      } else {
        // Criar novo usuário
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        tipo: formatTipoBackend(formData.tipo),
        status: formData.status
      }),
        });

        if (response.ok) {
          toast.success('Usuário cadastrado com sucesso!');
          loadUsuarios();
        } else {
          toast.error('Erro ao cadastrar usuário');
        }
      }

      resetForm();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      senha: '',
      tipo: 'Comum',
      status: 'Ativo'
    });
    setEditingUsuario(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: '',
      tipo: formatTipoDisplay(usuario.tipo) as any,
      status: usuario.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Usuário removido com sucesso!');
        loadUsuarios();
      } else {
        toast.error('Erro ao remover usuário');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUsuario(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingUsuario ? 'Editar Usuário' : 'Novo Usuário'}
              </DialogTitle>
              <DialogDescription>
                {editingUsuario
                  ? 'Atualize as informações do usuário'
                  : 'Preencha os dados para cadastrar um novo usuário'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha *</Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                  required
                  placeholder={editingUsuario ? 'Deixe em branco para manter a senha atual' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Usuário *</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Comum">Comum</SelectItem>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Vendedor">Vendedor</SelectItem>
                    <SelectItem value="Gerente">Gerente</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                    <SelectItem value="Mecânico">Mecânico</SelectItem>
                    <SelectItem value="Estoquista">Estoquista</SelectItem>
                    <SelectItem value="Caixa">Caixa</SelectItem>
                    <SelectItem value="Atendente">Atendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingUsuario ? 'Salvar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Todos os usuários cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando usuários...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Cadastro</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
               <TableBody>
                 {filteredUsuarios.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                       Nenhum usuário encontrado
                     </TableCell>
                   </TableRow>
                 ) : (
                    filteredUsuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            {usuario.nome}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            {usuario.email}
                          </div>
                        </TableCell>
                         <TableCell>
                           <div className="flex items-center">
                             <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Badge className={getTipoUsuarioBadge(usuario.tipo)}>
                        {formatTipoDisplay(usuario.tipo)}
                      </Badge>
                           </div>
                         </TableCell>
                       <TableCell>
                         <Badge className={getStatusBadge(usuario.status)}>
                           {usuario.status}
                         </Badge>
                       </TableCell>
                     <TableCell>
                       {usuario.created_at
                         ? new Date(usuario.created_at).toLocaleDateString()
                         : '-'
                       }
                     </TableCell>
                    <TableCell>
                      {usuario.ultimoLogin === 'Nunca' || !usuario.ultimoLogin
                        ? 'Nunca'
                        : new Date(usuario.ultimoLogin).toLocaleDateString()
                      }
                    </TableCell>
                     <TableCell>
                       <div className="flex space-x-2">
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handleEdit(usuario)}
                         >
                           <Edit className="h-4 w-4" />
                         </Button>
                         <AlertDialog>
                           <AlertDialogTrigger asChild>
                             <Button
                               variant="outline"
                               size="sm"
                               className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                             >
                               <Trash2 className="h-4 w-4" />
                             </Button>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                             <AlertDialogHeader>
                               <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                               <AlertDialogDescription>
                                 Tem certeza que deseja remover o usuário "{usuario.nome}"? Esta ação não pode ser desfeita.
                               </AlertDialogDescription>
                             </AlertDialogHeader>
                             <AlertDialogFooter>
                               <AlertDialogCancel>Cancelar</AlertDialogCancel>
                               <AlertDialogAction
                                 onClick={() => handleDelete(usuario.id)}
                                 className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                               >
                                 Remover
                               </AlertDialogAction>
                             </AlertDialogFooter>
                           </AlertDialogContent>
                         </AlertDialog>
                       </div>
                      </TableCell>
                   </TableRow>
                 ))
                 )}
               </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Usuarios;
