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
      {installed_by_moth.length > 0 ?
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
          <Bar dataKey="total" fill={'#098f62'} />
        </ComposedChart>
        :
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          justifyContent: 'center',
          alignItems: 'center',
          display: "flex"
        }}>No hay datos disponibles</div>
      }
    </ResponsiveContainer>
  )
}

export default CamsInstalledByMonth;