import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from 'react';
import { ColumnInfo, RawData } from '@/src/types';
import { parseNumeric, groupAndAggregateData } from '@/src/lib/data-utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

interface ChartViewProps {
  data: RawData[];
  columns: ColumnInfo[];
}

export function ChartView({ data, columns }: ChartViewProps) {
  const numericCols = columns.filter(c => c.type === 'number');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area' | 'pie' | 'scatter' | 'radar'>('bar');
  const [xAxis, setXAxis] = useState(columns[0]?.name || '');
  const [yAxis, setYAxis] = useState(numericCols[0]?.name || '');

  const aggregatedData = useMemo(() => {
    if (chartType === 'scatter') {
      return data.map(d => ({
        ...d,
        [yAxis]: parseNumeric(d[yAxis]) || 0
      }));
    }
    return groupAndAggregateData(data, xAxis, yAxis);
  }, [data, xAxis, yAxis, chartType]);

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
            <XAxis dataKey={xAxis} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => val.toLocaleString()} />
            <Tooltip 
              formatter={(value: any) => [value.toLocaleString(), `Total ${yAxis}`]}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--card)' }}
            />
            <Legend />
            <Bar dataKey={yAxis} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
            <XAxis dataKey={xAxis} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => val.toLocaleString()} />
            <Tooltip formatter={(value: any) => [value.toLocaleString(), `Total ${yAxis}`]} />
            <Legend />
            <Line type="monotone" dataKey={yAxis} stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={aggregatedData}>
            <defs>
              <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
            <XAxis dataKey={xAxis} axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => val.toLocaleString()} />
            <Tooltip formatter={(value: any) => [value.toLocaleString(), `Total ${yAxis}`]} />
            <Area type="monotone" dataKey={yAxis} stroke="#3b82f6" fillOpacity={1} fill="url(#colorY)" />
          </AreaChart>
        );
      case 'pie':
        const pieData = aggregatedData;
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey={yAxis}
              nameKey={xAxis}
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => [value.toLocaleString(), `Total ${yAxis}`]} />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center" 
              formatter={(value, entry: any) => {
                const item = pieData.find(d => d[xAxis] === value);
                const amount = item ? item[yAxis].toLocaleString() : '0';
                return (
                  <span className="text-xs font-medium">
                    {value}: <span className="font-mono text-primary">${amount}</span>
                  </span>
                );
              }}
              wrapperStyle={{ maxHeight: '100px', overflowY: 'auto', paddingTop: '20px' }} 
            />
          </PieChart>
        );
      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis type="category" dataKey={xAxis} name={xAxis} axisLine={false} tickLine={false} />
            <YAxis type="number" dataKey={yAxis} name={yAxis} axisLine={false} tickLine={false} tickFormatter={(val) => val.toLocaleString()} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name={yAxis} data={aggregatedData} fill="#3b82f6" />
          </ScatterChart>
        );
      case 'radar':
        const radarData = aggregatedData;
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid opacity={0.2} />
            <PolarAngleAxis dataKey={xAxis} tick={{ fontSize: 10 }} />
            <PolarRadiusAxis />
            <Radar name={yAxis} dataKey={yAxis} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Tooltip formatter={(value: any) => [value.toLocaleString(), `Total ${yAxis}`]} />
          </RadarChart>
        );
    }
  };

  return (
    <Card id="dashboard-charts" className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 pb-7 sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border/50">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold tracking-tight capitalize">
            {chartType} Chart: {yAxis} Analysis
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Visualizing <span className="font-mono font-medium text-foreground">{yAxis}</span> across <span className="font-mono font-medium text-foreground">{xAxis}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={chartType} onValueChange={(v: any) => setChartType(v)}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
              <SelectItem value="pie">Donut Chart</SelectItem>
              <SelectItem value="scatter">Scatter Plot</SelectItem>
              <SelectItem value="radar">Radar Chart</SelectItem>
            </SelectContent>
          </Select>

          <Select value={xAxis} onValueChange={setXAxis}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="X-Axis" />
            </SelectTrigger>
            <SelectContent>
              {columns.map(c => (
                <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={yAxis} onValueChange={setYAxis}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Y-Axis" />
            </SelectTrigger>
            <SelectContent>
              {numericCols.map(c => (
                <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart() || <div>Select columns to visualize</div>}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
