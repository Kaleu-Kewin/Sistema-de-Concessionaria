
import { useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, ShoppingCart, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Venda {
  id: string;
  clienteId: string;
  clienteNome: string;
  veiculoId: string;
  veiculoInfo: string;
  valorVenda: number;
  dataVenda: string;
  status: 'pendente' | 'confirmada' | 'cancelada';
  vendedor: string;
  observacoes: string;
}

const Vendas = () => {
  const [vendas, setVendas] = useState<Venda[]>([
    {
      id: '1',
      clienteId: '1',
      clienteNome: 'João Silva',
      veiculoId: '1',
      veiculoInfo: 'Honda Civic 2023',
      valorVenda: 85000,
      dataVenda: '2024-01-15',
      status: 'confirmada',
      vendedor: 'Carlos Vendedor',
      observacoes: 'Venda à vista com desconto'
    },
    {
      id: '2',
      clienteId: '2',
      clienteNome: 'Maria Santos',
      veiculoId: '2',
      veiculoInfo: 'Toyota Corolla 2022',
      valorVenda: 78000,
      dataVenda: '2024-01-14',
      status: 'confirmada',
      vendedor: 'Ana Gerente',
      observacoes: 'Financiamento em 60x'
    },
    {
      id: '3',
      clienteId: '3',
      clienteNome: 'Pedro Costa',
      veiculoId: '3',
      veiculoInfo: 'Volkswagen Jetta 2023',
      valorVenda: 92000,
      dataVenda: '2024-01-13',
      status: 'pendente',
      vendedor: 'Carlos Vendedor',
      observacoes: 'Aguardando aprovação do financiamento'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVenda, setEditingVenda] = useState<Venda | null>(null);
  const [formData, setFormData] = useState({
    clienteId: '',
    clienteNome: '',
    veiculoId: '',
    veiculoInfo: '',
    valorVenda: 0,
    dataVenda: new Date().toISOString().split('T')[0],
    status: 'pendente' as 'pendente' | 'confirmada' | 'cancelada',
    vendedor: '',
    observacoes: ''
  });

  const clientes = [
    { id: '1', nome: 'João Silva' },
    { id: '2', nome: 'Maria Santos' },
    { id: '3', nome: 'Pedro Costa' }
  ];

  const veiculos = [
    { id: '1', info: 'Honda Civic 2023 - Branco' },
    { id: '2', info: 'Toyota Corolla 2022 - Prata' },
    { id: '3', info: 'Volkswagen Jetta 2023 - Preto' }
  ];

  const filteredVendas = vendas.filter(venda => {
    const matchesSearch = venda.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venda.veiculoInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venda.vendedor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'todos' || venda.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pendente: 'secondary',
      confirmada: 'default',
      cancelada: 'destructive'
    };
    return variants[status as keyof typeof variants];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pendente: 'Pendente',
      confirmada: 'Confirmada',
      cancelada: 'Cancelada'
    };
    return labels[status as keyof typeof labels];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingVenda) {
      setVendas(prev => prev.map(venda =>
        venda.id === editingVenda.id
          ? { ...venda, ...formData }
          : venda
      ));
      toast.success('Venda atualizada com sucesso!');
    } else {
      const newVenda: Venda = {
        id: Date.now().toString(),
        ...formData
      };
      setVendas(prev => [...prev, newVenda]);
      toast.success('Venda registrada com sucesso!');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      clienteId: '',
      clienteNome: '',
      veiculoId: '',
      veiculoInfo: '',
      valorVenda: 0,
      dataVenda: new Date().toISOString().split('T')[0],
      status: 'pendente',
      vendedor: '',
      observacoes: ''
    });
    setEditingVenda(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (venda: Venda) => {
    setEditingVenda(venda);
    setFormData({
      clienteId: venda.clienteId,
      clienteNome: venda.clienteNome,
      veiculoId: venda.veiculoId,
      veiculoInfo: venda.veiculoInfo,
      valorVenda: venda.valorVenda,
      dataVenda: venda.dataVenda,
      status: venda.status,
      vendedor: venda.vendedor,
      observacoes: venda.observacoes
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setVendas(prev => prev.filter(venda => venda.id !== id));
    toast.success('Venda removida com sucesso!');
  };

  const handleClienteChange = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    setFormData(prev => ({
      ...prev,
      clienteId,
      clienteNome: cliente?.nome || ''
    }));
  };

  const handleVeiculoChange = (veiculoId: string) => {
    const veiculo = veiculos.find(v => v.id === veiculoId);
    setFormData(prev => ({
      ...prev,
      veiculoId,
      veiculoInfo: veiculo?.info || ''
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
          <p className="text-muted-foreground">
            Gerencie as vendas da concessionária
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingVenda(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingVenda ? 'Editar Venda' : 'Nova Venda'}
              </DialogTitle>
              <DialogDescription>
                {editingVenda
                  ? 'Atualize as informações da venda'
                  : 'Preencha os dados para registrar uma nova venda'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Select value={formData.clienteId} onValueChange={handleClienteChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map(cliente => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="veiculo">Veículo</Label>
                  <Select value={formData.veiculoId} onValueChange={handleVeiculoChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {veiculos.map(veiculo => (
                        <SelectItem key={veiculo.id} value={veiculo.id}>
                          {veiculo.info}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valorVenda">Valor da Venda (R$)</Label>
                  <Input
                    id="valorVenda"
                    type="number"
                    value={formData.valorVenda}
                    onChange={(e) => setFormData(prev => ({ ...prev, valorVenda: parseFloat(e.target.value) }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataVenda">Data da Venda</Label>
                  <Input
                    id="dataVenda"
                    type="date"
                    value={formData.dataVenda}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataVenda: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendedor">Vendedor</Label>
                  <Input
                    id="vendedor"
                    value={formData.vendedor}
                    onChange={(e) => setFormData(prev => ({ ...prev, vendedor: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="confirmada">Confirmada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Observações sobre a venda..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingVenda ? 'Salvar' : 'Registrar Venda'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Vendas</CardTitle>
          <CardDescription>
            Todas as vendas registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, veículo ou vendedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendas.map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell className="font-medium">{venda.clienteNome}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2 text-muted-foreground" />
                      {venda.veiculoInfo}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(venda.valorVenda)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {new Date(venda.dataVenda).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{venda.vendedor}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(venda.status) as any}>
                      {getStatusLabel(venda.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(venda)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(venda.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Vendas;
