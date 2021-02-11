import React from 'react';
import ColorScheme from 'color-scheme';
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

const scm = new ColorScheme();
const COLORS = scm.from_hue(235)
  .scheme('analogic')
  .distance(0.3)
  .add_complement(false)
  .variation('pastel')
  .web_safe(false).colors();


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
        <Bar barSize={30} dataKey="Cerrados" fill={'#' + COLORS[0 % COLORS.length]} />
        <Bar barSize={30} dataKey="Proceso" fill={'#' + COLORS[1 % COLORS.length]} />
      </ComposedChart>
    </ResponsiveContainer>
  )
};


export default AttendedVSclosed;