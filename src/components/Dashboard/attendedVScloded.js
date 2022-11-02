import React from 'react';
import {
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  ComposedChart,
  Legend
} from 'recharts';


const AttendedVSclosed = (props) => {
  const { attendedVSclosed } = props;
  return (
    <ResponsiveContainer>
      <ComposedChart
        data={attendedVSclosed}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar barSize={30} dataKey="Cerrados" fill={'#008ffb'} />
        <Bar barSize={30} dataKey="Proceso" fill={'#f2833e'} />
      </ComposedChart>
    </ResponsiveContainer>
  )
};


export default AttendedVSclosed;