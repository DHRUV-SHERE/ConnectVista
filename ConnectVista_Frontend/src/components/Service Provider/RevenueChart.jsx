"use client";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const RevenueChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="p-3 rounded-lg border shadow-lg"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-color)'
          }}
        >
          <p className="font-medium mb-1">{label}</p>
          <p className="text-sm">
            Revenue: <span className="font-medium" style={{ color: '#8b5cf6' }}>
              ${payload[0].value}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="var(--border-color)"
          opacity={0.5}
        />
        <XAxis 
          dataKey="name"
          stroke="var(--text-color)"
          opacity={0.7}
          fontSize={12}
        />
        <YAxis 
          stroke="var(--text-color)"
          opacity={0.7}
          fontSize={12}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="#8b5cf6" 
          fill="#8b5cf6" 
          fillOpacity={0.1}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;