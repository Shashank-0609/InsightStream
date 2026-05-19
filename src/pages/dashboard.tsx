import { useState, useMemo } from 'react';
import { Sidebar } from '@/src/components/dashboard/sidebar';
import { DataUpload } from '@/src/components/dashboard/data-upload';
import { ChartView } from '@/src/components/dashboard/chart-view';
import { DataTable } from '@/src/components/dashboard/data-table';
import { AIInsights } from '@/src/components/dashboard/ai-insights';
import { useDataManagement } from '@/src/hooks/use-data';
import { getColumnStats } from '@/src/lib/data-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, Users, Package, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export function DashboardPage({ onExit }: { onExit: () => void }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { data, columns, isLoading, fileName, handleFileUpload, setData, setColumns } = useDataManagement();

  const metrics = useMemo(() => {
    if (!data.length || !columns.length) return [];
    
    const numericCols = columns.filter(c => c.type === 'number');
    const firstMetricCol = numericCols[0]?.name;
    const secondMetricCol = numericCols[1]?.name;

    const stats = firstMetricCol ? getColumnStats(data, firstMetricCol) : null;
    const stats2 = secondMetricCol ? getColumnStats(data, secondMetricCol) : null;

    return [
      { label: 'Total Records', value: data.length, icon: Activity, trend: '+12%', up: true },
      { label: firstMetricCol || 'Metrics', value: stats ? Math.round(stats.total) : 0, icon: DollarSign, trend: '+5%', up: true },
      { label: firstMetricCol ? `Avg ${firstMetricCol}` : 'Average', value: stats ? Math.round(stats.avg) : 0, icon: Users, trend: '-2%', up: false },
      { label: secondMetricCol || 'Volume', value: stats2 ? Math.round(stats2.total) : 0, icon: Package, trend: '+8%', up: true },
    ];
  }, [data, columns]);

  const handleExportPDF = async () => {
    const dashboard = document.getElementById('dashboard-content');
    if (!dashboard) return;
    
    const canvas = await html2canvas(dashboard);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`InsightStream-Report-${new Date().getTime()}.pdf`);
  };

  const handleExportCSV = () => {
    if (!data.length) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(data[0]).join(",") + "\n"
      + data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exported_dataset.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <TooltipProvider>
      <div className="flex bg-background min-h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onExit={onExit} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">
                  {activeTab === 'dashboard' ? 'Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
                <p className="text-muted-foreground">
                  {fileName ? `Analyzing ${fileName}` : 'Welcome back, Analyst. Upload a dataset to begin.'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={!data.length}>
                  <Download size={16} className="mr-2" />
                  CSV
                </Button>
                <Button size="sm" onClick={handleExportPDF} disabled={!data.length}>
                  <Download size={16} className="mr-2" />
                  PDF Report
                </Button>
              </div>
            </header>

            <div id="dashboard-content" className="space-y-8">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.length > 0 ? (
                  metrics.map((m, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <m.icon size={20} />
                          </div>
                          <div className={`flex items-center text-xs font-medium ${m.up ? 'text-green-500' : 'text-red-500'}`}>
                            {m.trend}
                            {m.up ? <ArrowUpRight size={12} className="ml-1" /> : <ArrowDownRight size={12} className="ml-1" />}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold truncate">
                            {m.label}
                          </p>
                          <h3 className="text-2xl font-bold tracking-tight">{m.value.toLocaleString()}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  [1,2,3,4].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="h-32 bg-muted/20" />
                    </Card>
                  ))
                )}
              </div>

              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-3">
                     <DataUpload 
                        onUpload={handleFileUpload} 
                        isLoading={isLoading} 
                        fileName={fileName} 
                        onClear={() => { setData([]); setColumns([]); }} 
                      />
                  </div>
                  
                  {data.length > 0 && (
                    <div className="lg:col-span-3 space-y-8">
                      <AIInsights data={data} columns={columns} />
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         <ChartView data={data} columns={columns} />
                         <DataTable data={data} columns={columns} />
                      </div>
                    </div>
                  )}
                </div>
              )}

               {activeTab === 'data' && (
                 <div className="space-y-8">
                    <DataUpload 
                      onUpload={handleFileUpload} 
                      isLoading={isLoading} 
                      fileName={fileName} 
                      onClear={() => { setData([]); setColumns([]); }} 
                    />
                    {data.length > 0 && <DataTable data={data} columns={columns} />}
                 </div>
               )}

               {activeTab === 'insights' && (
                 <div className="space-y-8">
                    {data.length > 0 ? (
                      <AIInsights data={data} columns={columns} />
                    ) : (
                      <Card className="p-20 text-center flex flex-col items-center gap-6">
                         <Sparkles size={48} className="text-primary/20" />
                         <p className="text-muted-foreground">Upload a dataset to generate brain-powered insights.</p>
                      </Card>
                    )}
                 </div>
               )}
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
