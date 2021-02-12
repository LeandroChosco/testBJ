import React from 'react';
import {
  Legend,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  ComposedChart
} from 'recharts';

import ColorScheme from 'color-scheme'
const scm = new ColorScheme();
const COLORS = scm.from_hue(235)
  .scheme('analogic')
  .distance(0.3)
  .add_complement(false)
  .variation('pastel')
  .web_safe(false).colors();

const IntalledLastMonth = (props) => {
  const { installed_last_moth } = props;
  return (
    <ResponsiveContainer>
      <ComposedChart
        data={installed_last_moth}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill={'#' + COLORS[0]} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default IntalledLastMonth;