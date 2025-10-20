import React from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';

interface CosmicChartProps {
  data: any[];
  type: 'line' | 'bar' | 'pie';
  dataKey: string;
  xAxisKey?: string;
  colors?: string[];
  height?: number;
}

const CosmicChart: React.FC<CosmicChartProps> = ({
  data,
  type,
  dataKey,
  xAxisKey = 'name',
  colors = ['#8a2be2', '#00bfff', '#ffd700', '#ff6b6b', '#4ecdc4'],
  height = 300
}) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(138, 43, 226, 0.2)" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
              axisLine={{ stroke: 'rgba(138, 43, 226, 0.3)' }}
            />
            <YAxis 
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
              axisLine={{ stroke: 'rgba(138, 43, 226, 0.3)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(10, 8, 20, 0.8)', 
                borderColor: 'rgba(138, 43, 226, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={colors[0]} 
              strokeWidth={3}
              dot={{ r: 5, fill: colors[0] }} 
              activeDot={{ r: 8, fill: colors[0] }}
            />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(138, 43, 226, 0.2)" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
              axisLine={{ stroke: 'rgba(138, 43, 226, 0.3)' }}
            />
            <YAxis 
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
              axisLine={{ stroke: 'rgba(138, 43, 226, 0.3)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(10, 8, 20, 0.8)', 
                borderColor: 'rgba(138, 43, 226, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar 
              dataKey={dataKey} 
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Bar>
          </BarChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(10, 8, 20, 0.8)', 
                borderColor: 'rgba(138, 43, 226, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
          </PieChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="cosmic-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="cosmic-card-glow"></div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CosmicChart;