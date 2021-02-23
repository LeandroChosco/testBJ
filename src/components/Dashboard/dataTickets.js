import React from 'react';
import ColorScheme from 'color-scheme';
import {
  Legend,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell, 
} from 'recharts';
const scm = new ColorScheme();

const COLORS = scm.from_hue(235)
  .scheme('analogic')
  .distance(0.3)
  .add_complement(false)
  .variation('pastel')
  .web_safe(false).colors();


const DataTickets = (props) => {
  const { dataTickets, dataTotalTickets } = props;
  return (
    <ResponsiveContainer>
      <PieChart>
        <Legend />
        <Pie data={dataTickets} outerRadius={95} dataKey="value" nameKey="name" >
          {
            dataTickets.map((entry, index) => <Cell key={`cell-${index}`} fill={'#' + COLORS[index % COLORS.length]} />)
          }
        </Pie>
        <Pie data={dataTotalTickets} dataKey="value" innerRadius={100} outerRadius={110} fill={"#" + COLORS[COLORS.length - 1]} label />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default DataTickets;