import React from 'react';
import ColorScheme from 'color-scheme';
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
  ResponsiveContainer
} from 'recharts';

const scm = new ColorScheme();
const COLORS = scm.from_hue(235)
  .scheme('analogic')
  .distance(0.3)
  .add_complement(false)
  .variation('pastel')
  .web_safe(false).colors();

const GenderDetected = (props) => {
const {genderDetected, dataTickets } = props;
  return (
    <ResponsiveContainer >
      <PieChart>
        <Legend />
        <Pie innerRadius={60} outerRadius={80} paddingAngle={5} fill="#8884d8" data={genderDetected} dataKey="value" nameKey="name" >
          {
            dataTickets.map((entry, index) => <Cell key={`cell-${index}`} fill={'#' + COLORS[index % COLORS.length]} />)
          }
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default GenderDetected;