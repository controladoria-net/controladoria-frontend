import { Case } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardChartProps {
  cases: Case[];
}

export function DashboardChart({ cases }: DashboardChartProps) {
  const statusData = [
    { name: 'Aprovado', value: cases.filter((c) => c.status === 'aprovado').length, color: '#10b981' },
    { name: 'Negado', value: cases.filter((c) => c.status === 'negado').length, color: '#ef4444' },
    { name: 'Em Análise', value: cases.filter((c) => c.status === 'em_analise').length, color: '#3b82f6' },
    { name: 'Doc. Incompleta', value: cases.filter((c) => c.status === 'documentacao_incompleta').length, color: '#f59e0b' },
    { name: 'Pendente', value: cases.filter((c) => c.status === 'pendente').length, color: '#6b7280' },
  ];

  const monthlyData = [
    { mes: 'Set', casos: 2 },
    { mes: 'Out', casos: cases.length },
    { mes: 'Nov', casos: 0 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Casos por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="casos" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
