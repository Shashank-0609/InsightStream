import { motion } from "motion/react";
import { useTheme } from "@/src/components/theme-provider";
import { Moon, Sun, Monitor, Github, BarChart3, Database, Sparkles, Download, ArrowRight, Laptop, Smartphone, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <BarChart3 size={20} />
            </div>
            <span>InsightStream</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <Button variant="outline" className="hidden sm:flex gap-2">
              <Github size={18} />
              <span>Star on GitHub</span>
            </Button>
            <Button onClick={onEnter} className="gap-2 group">
              Launch Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Visualize Your Data <br />With AI Precision
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              The professional analytics platform for modern teams. Upload datasets, 
              generate stunning visualizations, and extract AI-powered insights in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={onEnter} className="h-14 px-8 text-lg gap-2">
                Get Started for Free
                <ArrowRight size={20} />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                View Demo
              </Button>
            </div>
          </motion.div>

          {/* Feature Preview (Dashboard Mockup) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-20 relative"
          >
             <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full" />
             <div className="rounded-2xl border bg-card shadow-2xl p-4 overflow-hidden">
                <div className="flex items-center gap-2 mb-4 border-b pb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3 h-64 bg-muted/50 rounded-lg animate-pulse" />
                  <div className="col-span-9 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 bg-muted/50 rounded-lg animate-pulse" />
                      <div className="h-24 bg-muted/50 rounded-lg animate-pulse" />
                      <div className="h-24 bg-muted/50 rounded-lg animate-pulse" />
                    </div>
                    <div className="h-32 bg-muted/50 rounded-lg animate-pulse" />
                  </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground">Everything you need to master your data.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive Section */}
      <section className="py-20 border-y">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6 italic">Works on every device.</h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Your data doesn't stop. Neither does InsightStream. Access your professional 
              dashboards from your desktop, tablet, or mobile phone with zero compromise.
            </p>
            <div className="flex gap-6">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Laptop size={32} />
                <span className="text-xs uppercase tracking-widest font-mono">Desktop</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Tablet size={32} />
                <span className="text-xs uppercase tracking-widest font-mono">Tablet</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Smartphone size={32} />
                <span className="text-xs uppercase tracking-widest font-mono">Mobile</span>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-ink text-white p-12 rounded-3xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 text-primary opacity-20 group-hover:opacity-100 transition-opacity">
                <Monitor size={120} />
             </div>
             <div className="relative z-10">
               <div className="text-sm font-mono opacity-50 mb-4 tracking-[0.2em] uppercase">Built for efficiency</div>
               <div className="text-2xl font-serif italic mb-8">"The resolution and precision of the data grids are unmatched in the current SaaS landscape."</div>
               <div className="font-semibold">— Senior Data Architect, Global Tech</div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-muted/20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2 font-bold text-xl">
            <BarChart3 size={24} className="text-primary" />
            <span>InsightStream</span>
          </div>
          <div className="flex gap-8 text-muted-foreground text-sm">
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <div className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} InsightStream Platforms Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Dynamic Parsing",
    description: "Upload CSV or JSON and watch the dashboard adapt automatically to your schema.",
    icon: <Database size={24} />
  },
  {
    title: "AI Insights",
    description: "Get professional-grade analysis and business recommendations powered by Gemini AI.",
    icon: <Sparkles size={24} />
  },
  {
     title: "Interactive Charts",
     description: "Beautiful, responsive charts with hover tooltips, filtering, and style toggles.",
     icon: <BarChart3 size={24} />
  }
];
