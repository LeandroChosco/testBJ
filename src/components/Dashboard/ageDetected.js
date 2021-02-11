import React from 'react';
import ColorScheme from 'color-scheme';
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
const scm = new ColorScheme();

const COLORS = scm.from_hue(235)
  .scheme('analogic')
  .distance(0.3)
  .add_complement(false)
  .variation('pastel')
  .web_safe(false).colors();

const AgeDetected = (props) => {
  const { agesDetected} = props;
  return (
    <ResponsiveContainer>
      <ComposedChart
        data={agesDetected}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Mujeres" fill={'#' + COLORS[0]} />
        <Bar dataKey="total" fill={'#' + COLORS[1]} />
        <Bar dataKey="Hombres" fill={'#' + COLORS[2]} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default AgeDetected;