
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
  AlertDialogTrigger,
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
import { Plus, Search, Edit, Trash2, Car, Bike, Truck, HelpCircle, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

interface Veiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  cor: 'Preto' | 'Branco' | 'Prata' | 'Cinza' | 'Outro';
  preco: number;
  status: 'Disponível' | 'Indisponível' | 'Vendido' | 'Manutenção' | 'Reservado';
  km: number;
  tipo: 'Carro' | 'Moto' | 'Caminhão' | 'Indefinido';
  dataCadastro: string;
}

const Veiculos = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState<Veiculo | null>(null);
  const [formData, setFormData] = useState({
    placa: '',
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    cor: 'Preto' as 'Preto' | 'Branco' | 'Prata' | 'Cinza' | 'Outro',
    preco: 0,
    status: 'Disponível' as 'Disponível' | 'Indisponível' | 'Vendido' | 'Manutenção' | 'Reservado',
    km: 0,
    tipo: 'Carro' as 'Carro' | 'Moto' | 'Caminhão' | 'Indefinido'
  });

  useEffect(() => {
    fetchVeiculos();
  }, []);

  const fetchVeiculos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://127.0.0.1:5000/api/veiculos');

      if (!response.ok) {
        throw new Error('Erro ao buscar veículos');
      }

      const data = await response.json();
      setVeiculos(data);
    } catch (err) {
      console.error('Erro ao buscar veículos:', err);
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const filteredVeiculos = veiculos.filter(veiculo => {
    const matchesSearch = veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         veiculo.cor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'todos' || veiculo.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const formatStatusDisplay = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'Disponivel': 'Disponível',
      'Indisponivel': 'Indisponível',
      'Vendido': 'Vendido',
      'Manutencao': 'Manutenção',
      'Reservado': 'Reservado'
    };
    return statusMap[status] || status;
  };

  const formatTipoDisplay = (tipo: string) => {
    const tipoMap: { [key: string]: string } = {
      'Carro': 'Carro',
      'Moto': 'Moto',
      'Caminhao': 'Caminhão',
      'Indefinido': 'Indefinido'
    };
    return tipoMap[tipo] || tipo;
  };

  // Converte valores de exibição (com acentos) para backend (sem acentos)
  const formatStatusBackend = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'Disponível': 'Disponivel',
      'Indisponível': 'Indisponivel',
      'Vendido': 'Vendido',
      'Manutenção': 'Manutencao',
      'Reservado': 'Reservado'
    };
    return statusMap[status] || status;
  };

  const formatTipoBackend = (tipo: string) => {
    const tipoMap: { [key: string]: string } = {
      'Carro': 'Carro',
      'Moto': 'Moto',
      'Caminhão': 'Caminhao',
      'Indefinido': 'Indefinido'
    };
    return tipoMap[tipo] || tipo;
  };

  const getStatusBadge = (status: string) => {
    const displayStatus = formatStatusDisplay(status);
    const variants = {
      'Disponível': 'bg-green-500 text-white hover:bg-green-600',
      'Indisponível': 'bg-yellow-500 text-white hover:bg-yellow-600',
      'Vendido': 'bg-red-500 text-white hover:bg-red-600',
      'Manutenção': 'bg-yellow-500 text-white hover:bg-yellow-600',
      'Reservado': 'bg-blue-500 text-white hover:bg-blue-600'
    };
    return variants[displayStatus as keyof typeof variants] || 'bg-gray-500 text-white hover:bg-gray-600';
  };

  const getTipoBadge = (tipo: string) => {
    const displayTipo = formatTipoDisplay(tipo);
    const variants = {
      'Carro': 'bg-blue-500 text-white hover:bg-blue-600',
      'Moto': 'bg-green-500 text-white hover:bg-green-600',
      'Caminhão': 'bg-orange-500 text-white hover:bg-orange-600',
      'Indefinido': 'bg-gray-500 text-white hover:bg-gray-600'
    };
    return variants[displayTipo as keyof typeof variants] || 'bg-gray-500 text-white hover:bg-gray-600';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingVeiculo) {
        // Update existing vehicle
        const response = await fetch(`http://127.0.0.1:5000/api/veiculos/${editingVeiculo.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
        placa: formData.placa,
        marca: formData.marca,
        modelo: formData.modelo,
        ano: formData.ano,
        cor: formData.cor,
        preco: formData.preco,
        km: formData.km,
        tipo: formatTipoBackend(formData.tipo),
        status: formatStatusBackend(formData.status)
      }),
        });

        if (!response.ok) {
          throw new Error('Erro ao atualizar veículo');
        }

        toast.success('Veículo atualizado com sucesso!');
      } else {
        // Create new vehicle
        const response = await fetch('http://127.0.0.1:5000/api/veiculos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
        placa: formData.placa,
        marca: formData.marca,
        modelo: formData.modelo,
        ano: formData.ano,
        cor: formData.cor,
        preco: formData.preco,
        km: formData.km,
        tipo: formatTipoBackend(formData.tipo),
        status: formatStatusBackend(formData.status)
      }),
        });

        if (!response.ok) {
          throw new Error('Erro ao cadastrar veículo');
        }

        toast.success('Veículo cadastrado com sucesso!');
      }

      resetForm();
      fetchVeiculos();
    } catch (err) {
      console.error('Erro ao salvar veículo:', err);
      toast.error('Erro de conexão com o servidor');
    }
  };

  const resetForm = () => {
    setFormData({
      placa: '',
      marca: '',
      modelo: '',
      ano: new Date().getFullYear(),
      cor: 'Preto',
      preco: 0,
      status: 'Disponível',
      km: 0,
      tipo: 'Carro'
    });
    setEditingVeiculo(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (veiculo: Veiculo) => {
    setEditingVeiculo(veiculo);
    setFormData({
      placa: veiculo.placa,
      marca: veiculo.marca,
      modelo: veiculo.modelo,
      ano: veiculo.ano,
      cor: veiculo.cor,
      preco: veiculo.preco,
      km: veiculo.km,
      tipo: formatTipoDisplay(veiculo.tipo) as any,
      status: formatStatusDisplay(veiculo.status) as any
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/veiculos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar veículo');
      }

      toast.success('Veículo removido com sucesso!');
      fetchVeiculos();
    } catch (err) {
      console.error('Erro ao deletar veículo:', err);
      toast.error('Erro de conexão com o servidor');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Veículos</h1>
          <p className="text-muted-foreground">
            Gerencie o estoque de veículos
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingVeiculo(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Veículo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {editingVeiculo ? 'Editar Veículo' : 'Novo Veículo'}
              </DialogTitle>
              <DialogDescription>
                {editingVeiculo
                  ? 'Atualize as informações do veículo'
                  : 'Preencha os dados para cadastrar um novo veículo'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="placa">Placa</Label>
                  <Input
                    id="placa"
                    value={formData.placa}
                    onChange={(e) => setFormData(prev => ({ ...prev, placa: e.target.value }))}
                    placeholder="XXX-0000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marca">Marca</Label>
                  <Input
                    id="marca"
                    value={formData.marca}
                    onChange={(e) => setFormData(prev => ({ ...prev, marca: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input
                    id="modelo"
                    value={formData.modelo}
                    onChange={(e) => setFormData(prev => ({ ...prev, modelo: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ano">Ano</Label>
                  <Input
                    id="ano"
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData(prev => ({ ...prev, ano: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cor">Cor</Label>
                  <Select value={formData.cor} onValueChange={(value) => setFormData(prev => ({ ...prev, cor: value as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Preto">Preto</SelectItem>
                      <SelectItem value="Branco">Branco</SelectItem>
                      <SelectItem value="Prata">Prata</SelectItem>
                      <SelectItem value="Cinza">Cinza</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Carro">Carro</SelectItem>
                      <SelectItem value="Moto">Moto</SelectItem>
                      <SelectItem value="Caminhão">Caminhão</SelectItem>
                      <SelectItem value="Indefinido">Indefinido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    value={formData.preco}
                    onChange={(e) => setFormData(prev => ({ ...prev, preco: parseFloat(e.target.value) }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="km">Quilometragem</Label>
                  <Input
                    id="km"
                    type="number"
                    value={formData.km}
                    onChange={(e) => setFormData(prev => ({ ...prev, km: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponível">Disponível</SelectItem>
                    <SelectItem value="Indisponível">Indisponível</SelectItem>
                    <SelectItem value="Vendido">Vendido</SelectItem>
                    <SelectItem value="Manutenção">Manutenção</SelectItem>
                    <SelectItem value="Reservado">Reservado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingVeiculo ? 'Salvar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estoque de Veículos</CardTitle>
          <CardDescription>
            Todos os veículos cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por placa, marca, modelo ou cor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="Disponível">Disponível</SelectItem>
                <SelectItem value="Indisponível">Indisponível</SelectItem>
                <SelectItem value="Vendido">Vendido</SelectItem>
                <SelectItem value="Manutenção">Manutenção</SelectItem>
                <SelectItem value="Reservado">Reservado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Carregando veículos...
            </div>
          ) : error ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>KM</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Nenhum veículo encontrado
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>KM</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVeiculos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Nenhum veículo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVeiculos.map((veiculo) => (
                    <TableRow key={veiculo.id}>
                      <TableCell className="font-medium">{veiculo.placa}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                           {formatTipoDisplay(veiculo.tipo) === 'Carro' && <Car className="h-4 w-4 mr-2 text-muted-foreground" />}
                           {formatTipoDisplay(veiculo.tipo) === 'Moto' && <Bike className="h-4 w-4 mr-2 text-muted-foreground" />}
                           {formatTipoDisplay(veiculo.tipo) === 'Caminhão' && <Truck className="h-4 w-4 mr-2 text-muted-foreground" />}
                           {formatTipoDisplay(veiculo.tipo) === 'Indefinido' && <HelpCircle className="h-4 w-4 mr-2 text-muted-foreground" />}
                          {veiculo.marca} {veiculo.modelo}
                        </div>
                      </TableCell>
                      <TableCell>{veiculo.ano}</TableCell>
                      <TableCell>{veiculo.cor}</TableCell>
                      <TableCell>
                      <Badge className={getTipoBadge(veiculo.tipo)}>
                        {formatTipoDisplay(veiculo.tipo)}
                      </Badge>
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(veiculo.preco)}
                      </TableCell>
                      <TableCell>{veiculo.km.toLocaleString()} km</TableCell>
                      <TableCell>
                      <Badge className={getStatusBadge(veiculo.status)}>
                        {formatStatusDisplay(veiculo.status)}
                      </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(veiculo)}
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
                                  Tem certeza que deseja excluir o veículo <strong>{veiculo.marca} {veiculo.modelo}</strong> (placa: {veiculo.placa})? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(veiculo.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
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

export default Veiculos;
