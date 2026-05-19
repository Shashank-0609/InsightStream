import { LayoutDashboard, Upload, Sparkles, Settings, FileText, BarChart3, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExit: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onExit }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Analytics' },
    { id: 'data', icon: Upload, label: 'Dataset' },
    { id: 'insights', icon: Sparkles, label: 'AI Intelligence' },
    { id: 'reports', icon: FileText, label: 'Export Hub' },
    { id: 'settings', icon: Settings, label: 'Configuration' },
  ];

  return (
    <aside className={cn(
      "h-screen border-r bg-background flex flex-col transition-all duration-300 z-40 sticky top-0",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="h-16 flex items-center px-4 border-b">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <BarChart3 size={20} />
          </div>
          {!collapsed && <span className="font-bold text-lg tracking-tight">InsightStream</span>}
        </div>
      </div>

      <div className="flex-1 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all group relative",
              activeTab === item.id 
                ? "bg-primary/10 text-primary border-r-2 border-primary" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon size={18} className={cn("shrink-0", activeTab === item.id && "text-primary")} />
            {!collapsed && <span>{item.label}</span>}
            {collapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-ink text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t space-y-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start gap-3" 
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onExit}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
