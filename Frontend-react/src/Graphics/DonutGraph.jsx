import { PieChart, Pie, Cell } from 'recharts';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#A020F0', '#FF1493', '#20B2AA', '#D2691E',
];

export default function DonutGraph({ data, size = 200 }) {
  const chartData = data.map(({ Nombre, Total }) => ({
    name: Nombre,
    value: Total,
  }));

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '1rem',
        maxWidth: size + 580, // para evitar que se desborde mucho
      }}
    >
      {/* Gráfica Donut */}
      <PieChart width={size} height={size}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={size * 0.35}
          outerRadius={size * 0.45}
          paddingAngle={3}
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={8}
            />
          ))}
        </Pie>
      </PieChart>

      {/* Leyenda a la derecha */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: '0 rem',
          gap: '0.5rem',
          fontSize: '1rem',
          flexWrap: 'wrap',
          maxHeight: size,
        }}
      >
        {chartData.map((entry, index) => (
          <div
            key={`legend-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                backgroundColor: COLORS[index % COLORS.length],
                borderRadius: 3,
              }}
            ></div>
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
