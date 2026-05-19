import { useState } from 'react';
import { LandingPage } from './pages/landing';
import { DashboardPage } from './pages/dashboard';
import { ThemeProvider } from './components/theme-provider';
import { ViewType } from './types';

export default function App() {
  const [view, setView] = useState<ViewType>('landing');

  return (
    <ThemeProvider defaultTheme="dark" storageKey="insight-stream-theme">
      {view === 'landing' ? (
        <LandingPage onEnter={() => setView('dashboard')} />
      ) : (
        <DashboardPage onExit={() => setView('landing')} />
      )}
    </ThemeProvider>
  );
}
