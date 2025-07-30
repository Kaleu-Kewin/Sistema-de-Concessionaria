
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Car, ShoppingCart, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total de Clientes',
      value: '1,234',
      icon: Users,
      description: '+20% em relação ao mês anterior',
      color: 'text-blue-500'
    },
    {
      title: 'Veículos em Estoque',
      value: '156',
      icon: Car,
      description: '12 novos veículos esta semana',
      color: 'text-green-500'
    },
    {
      title: 'Vendas no Mês',
      value: '89',
      icon: ShoppingCart,
      description: '+12% em relação ao mês anterior',
      color: 'text-purple-500'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 2.4M',
      icon: TrendingUp,
      description: '+18% em relação ao mês anterior',
      color: 'text-orange-500'
    }
  ];

  const recentSales = [
    { id: 1, client: 'João Silva', vehicle: 'Honda Civic 2023', value: 'R$ 85.000', date: '2024-01-15' },
    { id: 2, client: 'Maria Santos', vehicle: 'Toyota Corolla 2022', value: 'R$ 78.000', date: '2024-01-14' },
    { id: 3, client: 'Pedro Costa', vehicle: 'Nissan Sentra 2023', value: 'R$ 82.000', date: '2024-01-13' },
    { id: 4, client: 'Ana Oliveira', vehicle: 'Hyundai HB20 2022', value: 'R$ 45.000', date: '2024-01-12' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do desempenho da concessionária
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Sales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
            <CardDescription>
              Últimas vendas realizadas na concessionária
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {sale.client}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {sale.vehicle}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {sale.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Vendas por Categoria</CardTitle>
            <CardDescription>
              Distribuição de vendas por tipo de veículo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sedans</p>
                  <p className="text-sm text-muted-foreground">45%</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">SUVs</p>
                  <p className="text-sm text-muted-foreground">30%</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Hatchbacks</p>
                  <p className="text-sm text-muted-foreground">25%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
