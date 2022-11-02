import React from 'react';
import {
  Legend,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  ComposedChart,
} from 'recharts';


const CamsInstalledByMonth = (props) => {
  const { installed_by_moth } = props;
  return (
    <ResponsiveContainer>
      <ComposedChart
        data={installed_by_moth}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis allowDecimals={false} />
        <Tooltip itemStyle={{ color: "#666666" }} />
        <Legend />
        <Bar dataKey="total" fill={'#008ffb'} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default CamsInstalledByMonth;