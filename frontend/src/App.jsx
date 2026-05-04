import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, History, Sparkles, MessageSquare, User, List, LogOut, Bell, Moon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';
import ComparePage from './pages/ComparePage';
import ChatAssistant from './pages/ChatAssistant';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

function MainLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/compare', label: 'Compare', icon: List },
    { path: '/history', label: 'History', icon: History },
    { path: '/chat', label: 'AI Chat', icon: MessageSquare },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-gh-bg text-gh-text overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gh-card border-r border-gh-border flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-2 border-b border-gh-border">
          <Sparkles className="w-6 h-6 text-gh-blue" />
          <h1 className="font-bold text-xl tracking-tight text-white">Appliance<span className="text-gh-blue">AI</span></h1>
        </div>
        
        <nav className="flex-1 px-4 mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-gh-blue/10 text-gh-blue font-medium' 
                    : 'text-gh-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gh-border">
          <div className="flex items-center justify-between gh-card p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gh-blue/20 text-gh-blue flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white truncate w-24">{user?.name}</span>
                <span className="text-[10px] text-gh-muted">Pro Plan</span>
              </div>
            </div>
            <button onClick={logout} className="text-gh-muted hover:text-gh-red">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-gh-bg border-b border-gh-border flex items-center justify-between px-6 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-white hidden md:block"></h2>
            <h2 className="text-lg font-semibold text-white md:hidden">ApplianceAI</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gh-muted hover:text-white">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-gh-muted hover:text-white">
              <Moon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/chat" element={<ChatAssistant />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-gh-card border-t border-gh-border flex justify-around p-3 z-50">
        {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-gh-blue' : 'text-gh-muted'}`}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            )
          })}
      </nav>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
