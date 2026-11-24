import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

export default function TopicChart({ topics, onSelect }) {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={topics} layout="vertical" margin={{ left: 30 }}>
        <CartesianGrid stroke="#f1f5f9" />
        <XAxis type="number" allowDecimals={false} fontSize={12} />
        <YAxis type="category" dataKey="topic" width={120} fontSize={13} />
        <Tooltip />
        <Legend />
        <Bar dataKey="negative" name="Complaints" fill="#f43f5e" radius={[0, 4, 4, 0]} onClick={(item) => onSelect(item.topic)} cursor="pointer" />
        <Bar dataKey="positive" name="Praise" fill="#10b981" radius={[0, 4, 4, 0]} onClick={(item) => onSelect(item.topic)} cursor="pointer" />
      </BarChart>
    </ResponsiveContainer>
  );
}
