import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnergyLevelResult } from '@/data/energyLevelQuestions';

interface EnergyLevelBIChartProps {
  data: EnergyLevelResult[];
  className?: string;
}

const EnergyLevelBIChart: React.FC<EnergyLevelBIChartProps> = ({ data, className = '' }) => {
  // Format data for charts
  const formattedData = data.map((result, index) => ({
    name: `Test ${index + 1}`,
    sattva: result.percentages.sattva,
    rajas: result.percentages.rajas,
    tamas: result.percentages.tamas,
    date: new Date().toLocaleDateString() // In a real app, this would come from the result timestamp
  }));

  // Data for pie chart (latest result)
  const latestResult = data.length > 0 ? data[0] : null;
  const pieData = latestResult ? [
    { name: 'Sattva', value: latestResult.percentages.sattva },
    { name: 'Rajas', value: latestResult.percentages.rajas },
    { name: 'Tamas', value: latestResult.percentages.tamas }
  ] : [];

  const COLORS = ['#10b981', '#f97316', '#ef4444'];

  // Data for trend line chart
  const trendData = data.map((result, index) => ({
    name: `Test ${data.length - index}`,
    sattva: result.percentages.sattva,
    rajas: result.percentages.rajas,
    tamas: result.percentages.tamas
  })).reverse();

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Energy Level BI Analytics</CardTitle>
          <CardDescription>Track your energy balance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No energy level data available yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Bar Chart - Current Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Current Energy Distribution</CardTitle>
          <CardDescription>Latest energy level assessment</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={latestResult ? [latestResult.percentages] : []}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
                tickFormatter={() => ''} // Hide x-axis labels for single data point
              />
              <YAxis stroke="#9ca3af" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  borderColor: '#4b5563',
                  borderRadius: '0.5rem'
                }}
                formatter={(value) => [`${value}%`, 'Percentage']}
                labelFormatter={() => 'Energy Distribution'}
              />
              <Legend />
              <Bar dataKey="sattva" name="Sattva" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rajas" name="Rajas" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tamas" name="Tamas" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart - Current Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Energy Composition</CardTitle>
          <CardDescription>Proportional view of your energy balance</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  borderColor: '#4b5563',
                  borderRadius: '0.5rem'
                }}
                formatter={(value) => [`${value}%`, 'Percentage']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart - Trend Over Time */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Energy Level Trend</CardTitle>
          <CardDescription>Track your energy balance progression</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  borderColor: '#4b5563',
                  borderRadius: '0.5rem'
                }}
                formatter={(value) => [`${value}%`, 'Percentage']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sattva" 
                name="Sattva" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="rajas" 
                name="Rajas" 
                stroke="#f97316" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="tamas" 
                name="Tamas" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnergyLevelBIChart;