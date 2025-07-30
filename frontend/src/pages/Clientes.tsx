
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Loader2, User, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
  cep?: string;
  endereco?: string;
  cidade?: string;
  uf?: string;
  saldo?: number;
  status: 'Ativo' | 'Inativo' | 'Bloqueado';
  dataCadastro?: string;
}

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

const formatCEP = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
};

const consultarCEP = async (cep: string) => {
  const cleanCEP = cep.replace(/\D/g, '');
  if (cleanCEP.length === 8) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      if (!data.erro) {
        return {
          endereco: data.logradouro || '',
          cidade: data.localidade || '',
          uf: data.uf || ''
        };
      }
    } catch (error) {
      console.error('Erro ao consultar CEP:', error);
    }
  }
  return null;
};

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    cep: '',
    endereco: '',
    cidade: '',
    uf: '',
    saldo: 0,
    status: 'Ativo' as 'Ativo' | 'Inativo' | 'Bloqueado'
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`);
      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      } else {
        toast.error('Erro ao carregar clientes');
      }
    } catch (error) {
      toast.error('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const createCliente = async (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });

      if (response.ok) {
        toast.success('Cliente cadastrado com sucesso!');
        fetchClientes();
        return true;
      } else {
        toast.error('Erro ao cadastrar cliente');
        return false;
      }
    } catch (error) {
      toast.error('Erro de conexão com o servidor');
      return false;
    }
  };

  const updateCliente = async (id: number, cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });

      if (response.ok) {
        toast.success('Cliente atualizado com sucesso!');
        fetchClientes();
        return true;
      } else {
        toast.error('Erro ao atualizar cliente');
        return false;
      }
    } catch (error) {
      toast.error('Erro de conexão com o servidor');
      return false;
    }
  };

  const deleteCliente = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Cliente removido com sucesso!');
        fetchClientes();
        return true;
      } else {
        toast.error('Erro ao remover cliente');
        return false;
      }
    } catch (error) {
      toast.error('Erro de conexão com o servidor');
      return false;
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cliente.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    cliente.cpf.includes(searchTerm)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingCliente) {
      const success = await updateCliente(editingCliente.id, formData);
      if (success) {
        resetForm();
      }
    } else {
      const success = await createCliente(formData);
      if (success) {
        resetForm();
      }
    }

    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      cep: '',
      endereco: '',
      cidade: '',
      uf: '',
      saldo: 0,
      status: 'Ativo'
    });
    setEditingCliente(null);
    setIsDialogOpen(false);
  };

  const handleCEPChange = async (cep: string) => {
    const formatted = formatCEP(cep);
    if (formatted.length <= 9) {
      setFormData(prev => ({ ...prev, cep: formatted }));

      const cleanCEP = cep.replace(/\D/g, '');
      if (cleanCEP.length === 8) {
        setLoadingCEP(true);
        const enderecoDados = await consultarCEP(cleanCEP);
        if (enderecoDados) {
          setFormData(prev => ({
            ...prev,
            endereco: enderecoDados.endereco,
            cidade: enderecoDados.cidade,
            uf: enderecoDados.uf
          }));
          toast.success('Endereço preenchido automaticamente!');
        } else {
          toast.error('CEP não encontrado');
        }
        setLoadingCEP(false);
      }
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
      email: cliente.email || '',
      cep: cliente.cep || '',
      endereco: cliente.endereco || '',
      cidade: cliente.cidade || '',
      uf: cliente.uf || '',
      saldo: cliente.saldo || 0,
      status: cliente.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteCliente(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes da concessionária
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCliente(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
              </DialogTitle>

              <DialogDescription>
                {editingCliente
                  ? 'Atualize as informações do cliente'
                  : 'Preencha os dados para cadastrar um novo cliente'
                }
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      if (formatted.length <= 14) {
                        setFormData(prev => ({ ...prev, cpf: formatted }));
                      }
                    }}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      if (formatted.length <= 15) {
                        setFormData(prev => ({ ...prev, telefone: formatted }));
                      }
                    }}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <div className="relative">
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => handleCEPChange(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                    {loadingCEP && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uf">UF</Label>
                  <Input
                    id="uf"
                    value={formData.uf}
                    onChange={(e) => setFormData(prev => ({ ...prev, uf: e.target.value }))}
                    maxLength={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="saldo">Saldo</Label>
                  <Input
                    id="saldo"
                    type="number"
                    step="0.01"
                    value={formData.saldo}
                    onChange={(e) => setFormData(prev => ({ ...prev, saldo: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'Ativo' | 'Inativo' | 'Bloqueado') => setFormData(prev => ({ ...prev, status: value }))}>
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
                <Button type="button" variant="outline" onClick={resetForm} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingCliente ? 'Salvando...' : 'Cadastrando...'}
                    </>
                  ) : (
                    editingCliente ? 'Salvar' : 'Cadastrar'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Todos os clientes cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando clientes...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cidade/UF</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClientes.map((cliente) => (
                     <TableRow key={cliente.id}>
                       <TableCell className="font-medium">
                         <div className="flex items-center">
                           <User className="h-4 w-4 mr-2 text-muted-foreground" />
                           {cliente.nome}
                         </div>
                       </TableCell>
                       <TableCell>{cliente.cpf}</TableCell>
                       <TableCell>
                         <div className="flex items-center">
                           <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                           {cliente.telefone}
                         </div>
                       </TableCell>
                       <TableCell>
                         <div className="flex items-center">
                           <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                           {cliente.email || '-'}
                         </div>
                       </TableCell>
                      <TableCell>
                        {cliente.cidade && cliente.uf
                          ? `${cliente.cidade}/${cliente.uf}`
                          : cliente.cidade || cliente.uf || '-'
                        }
                      </TableCell>
                       <TableCell>
                         <Badge
                           className={
                             cliente.status === 'Ativo'
                               ? 'bg-green-500 text-white hover:bg-green-600'
                               : cliente.status === 'Inativo'
                               ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                               : 'bg-red-500 text-white hover:bg-red-600'
                           }
                         >
                           {cliente.status}
                         </Badge>
                       </TableCell>
                      <TableCell>
                        {cliente.saldo !== undefined
                          ? `R$ ${cliente.saldo.toFixed(2)}`
                          : 'R$ 0,00'
                        }
                      </TableCell>
                       <TableCell>
                         <div className="flex space-x-2">
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => handleEdit(cliente)}
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
                                   Tem certeza que deseja remover o cliente "{cliente.nome}"? Esta ação não pode ser desfeita.
                                 </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                 <AlertDialogAction
                                   onClick={() => handleDelete(cliente.id)}
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

export default Clientes;
