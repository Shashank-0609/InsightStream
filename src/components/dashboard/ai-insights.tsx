import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, BrainCircuit, Lightbulb, TrendingUp } from 'lucide-react';
import { AnalysisResult, RawData, ColumnInfo } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { getColumnStats } from '@/src/lib/data-utils';

interface AIInsightsProps {
  data: RawData[];
  columns: ColumnInfo[];
}

export function AIInsights({ data, columns }: AIInsightsProps) {
  const [insight, setInsight] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dataStats = columns.filter(c => c.type === 'number').map(col => ({
        column: col.name,
        stats: getColumnStats(data, col.name)
      }));

      const dataSample = data.slice(0, 100); // Send first 100 rows as sample

      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataSummary: dataSample,
          dataStats: dataStats,
          columnInfo: columns,
          totalRows: data.length
        })
      });
      
      if (!response.ok) {
        throw new Error('Analysis service is currently unavailable');
      }

      const result = await response.json();
      setInsight(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-primary/20 bg-primary/5 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-primary/10 sticky top-0 z-10 backdrop-blur-md">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BrainCircuit className="text-primary w-4 h-4" />
          AI Intelligence Engine
        </CardTitle>
        <Button 
          size="sm" 
          onClick={generateInsights} 
          disabled={isLoading || data.length === 0}
          className="gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {insight ? "Refresh Analysis" : "Analyze Patterns"}
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4"
            >
              {error}
            </motion.div>
          )}

          {!insight && !isLoading && !error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Lightbulb className="w-12 h-12 text-primary/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground italic px-4">
                Let Gemini's advanced intelligence analyze your data schema and provide key business observations.
              </p>
            </motion.div>
          )}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 py-4"
            >
              <div className="h-4 bg-primary/10 rounded w-3/4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 bg-primary/10 rounded animate-pulse" />
                <div className="h-3 bg-primary/10 rounded animate-pulse w-5/6" />
                <div className="h-3 bg-primary/10 rounded animate-pulse w-4/6" />
              </div>
            </motion.div>
          )}

          {insight && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" />
                  Market Intelligence Summary
                </h4>
                <p className="text-sm leading-relaxed text-foreground font-medium">{insight.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-primary/10">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Observed Trends
                  </h4>
                  <ul className="space-y-3">
                    {insight.insights.map((item, i) => (
                      <li key={i} className="text-xs leading-normal flex gap-3 text-muted-foreground">
                        <span className="text-blue-500 font-mono mt-0.5 shrink-0">0{i+1}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-500 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Actionable Insights
                  </h4>
                  <ul className="space-y-3">
                    {insight.recommendations.map((item, i) => (
                      <li key={i} className="text-xs leading-normal flex gap-3 text-muted-foreground">
                        <span className="text-green-500 font-mono mt-0.5 shrink-0">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
